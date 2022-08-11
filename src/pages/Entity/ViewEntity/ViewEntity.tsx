import { CloseCircleOutlined, LeftOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Avatar, Button, Divider, message, Spin, Tabs, Tooltip } from "antd";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  GET_ENTITY_LATEST_ATTACHMENT,
  GET_SINGLE_ENTITY,
} from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import classes from "./ViewEntity.module.css";
import moment from "moment";
import {
  DATETIME_FORMATS,
  ENTITY_ASSIGNMENT_TYPES,
} from "../../../helpers/constants";
import ViewPeriodicMaintenance from "./ViewPeriodicMaintenance/ViewPeriodicMaintenance";
import ViewSparePR from "./ViewSparePR/ViewSparePR";
import ViewRepair from "./ViewRepair/ViewRepair";
import ViewBreakdown from "./ViewBreakdown/ViewBreakdown";
import ViewHistory from "./ViewHistory/ViewHistory";
import ViewGallery from "./ViewGallery/ViewGallery";
import ViewChecklist from "./ViewChecklist/ViewChecklist";
import UserContext from "../../../contexts/UserContext";
import { stringToColor } from "../../../helpers/style";
import { FaMapMarkerAlt, FaTractor, FaTruck } from "react-icons/fa";
import { Entity } from "../../../models/Entity/Entity";
import EditEntityLocation from "../../../components/EntityComponents/EditEntityLocation/EditEntityLocation";
import EditEntity from "../../../components/EntityComponents/EditEntity/EditEntity";
import DeleteEntity from "../../../components/EntityComponents/DeleteEntity/DeleteEntity";
import EntityAssignment from "../../../components/EntityComponents/EntityAssignment/EntityAssignment";
import EntityStatuses from "../../../components/EntityComponents/EntityStatuses/EntityStatuses";
import GetLatestEntityImage from "../../../components/EntityComponents/GetLatestEntityImage/GetLatestEntityImage";
import { UNASSIGN_USER_FROM_ENTITY } from "../../../api/mutations";
import EntityUsageHistory from "../../../components/EntityComponents/EntityUsageHistory/EntityUsageHistory";
import { RiSailboatFill } from "react-icons/ri";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";

const ViewEntity = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();
  const { user: self } = useContext(UserContext);
  const [getSingleEntity, { data: entity, loading: loadingEntity }] =
    useLazyQuery(GET_SINGLE_ENTITY, {
      onError: (err) => {
        errorMessage(err, "Error loading request.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    });

  // Fetch entity when component mount
  useEffect(() => {
    if (!self.assignedPermission.hasViewEntity) {
      navigate("/");
      message.error("No permission to view entity.");
    }
    getSingleEntity({ variables: { entityId: parseInt(id) } });
  }, [getSingleEntity, id]);

  const [unassignUserFromEntity, { loading: unassigning }] = useMutation(
    UNASSIGN_USER_FROM_ENTITY,
    {
      onCompleted: () => {
        message.success("Successfully unassigned user from entity.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while unassigning user.");
      },
      refetchQueries: ["getSingleEntity", "getAllHistoryOfEntity"],
    }
  );

  const entityData: Entity = entity?.getSingleEntity;

  const renderUsers = (type: "Admin" | "Engineer" | "User") => {
    return (
      entityData?.assignees?.length! > 0 && (
        <Avatar.Group
          maxCount={5}
          maxStyle={{
            color: "#f56a00",
            backgroundColor: "#fde3cf",
          }}
        >
          {entityData?.assignees?.map((assign) => {
            console.log({ assign });
            if (assign.type !== type) return;
            return (
              <Tooltip
                title={
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {assign?.user?.fullName} ({assign?.user?.rcno})
                      {self.assignedPermission.hasEntityUnassignmentToUser && (
                        <CloseCircleOutlined
                          style={{
                            cursor: "pointer",
                            marginLeft: 3,
                          }}
                          onClick={() =>
                            unassignUserFromEntity({
                              variables: {
                                entityId: entityData?.id,
                                userId: assign?.user?.id,
                                type,
                              },
                            })
                          }
                        />
                      )}
                    </div>
                  </>
                }
                placement="bottom"
                key={assign?.user?.id}
              >
                <Avatar
                  style={{
                    backgroundColor: stringToColor(assign?.user?.fullName!),
                  }}
                >
                  {assign?.user?.fullName
                    .match(/^\w|\b\w(?=\S+$)/g)
                    ?.join()
                    .replace(",", "")
                    .toUpperCase()}
                </Avatar>
              </Tooltip>
            );
          })}
        </Avatar.Group>
      )
    );
  };

  const [
    getEntityLatestAttachment,
    { data: attachmentData, loading: loadingImage, error },
  ] = useLazyQuery(GET_ENTITY_LATEST_ATTACHMENT, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch attachment when component mounts or when the filter object changes
  useEffect(() => {
    getEntityLatestAttachment({
      variables: {
        entityId: parseInt(id),
      },
    });
  }, [id, getEntityLatestAttachment]);

  const isSmallDevice = useIsSmallDevice();

  return (
    <>
      <div className={classes["container"]}>
        <div className={classes["info-container"]}>
          <div className={classes["info-btn-wrapper"]}>
            {self.assignedPermission.hasEditEntityLocation ? (
              <EditEntityLocation
                entity={entityData}
                isDeleted={entityData?.isDeleted}
              />
            ) : null}
            {self.assignedPermission.hasEntityEdit ? (
              <EditEntity
                entity={entityData}
                isDeleted={entityData?.isDeleted}
              />
            ) : null}
            {self.assignedPermission.hasEntityDelete ? (
              <DeleteEntity
                entityID={entityData?.id}
                isDeleted={entityData?.isDeleted}
              />
            ) : null}
          </div>
          {entityData?.isDeleted ? (
            <div className={classes["deleted"]}>DISPOSED</div>
          ) : null}
          <div className={classes["info-wrapper"]}>
            <div className={classes["location-wrapper"]}>
              <FaMapMarkerAlt />
              <span className={classes["title"]}>{entityData?.zone}</span>
              {entityData?.zone && <span className={classes["dash"]}>-</span>}
              <span>{entityData?.location}</span>
            </div>
          </div>
          <div className={classes["title-wrapper"]}>
            {entityData?.type?.entityType === "Machine" ? (
              <FaTractor />
            ) : entityData?.type?.entityType === "Vehicle" ? (
              <FaTruck />
            ) : entityData?.type?.entityType === "Vessel" ? (
              <RiSailboatFill />
            ) : null}

            <span className={classes["title"]}>
              {entityData?.machineNumber}
            </span>
          </div>
          <div className={classes["info-title-container"]}>
            <div className={classes["grid-one"]}>
              <div className={classes["info-title-wrapper"]}>
                <div>Entity Type</div>
                <div className={classes["info-content"]}>
                  {entityData?.type?.entityType}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Machine Number</div>
                <div className={classes["info-content"]}>
                  {entityData?.machineNumber}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Model</div>
                <div className={classes["info-content"]}>
                  {entityData?.model}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Type</div>
                <div className={classes["info-content"]}>
                  {entityData?.type?.name}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Zone</div>
                <div className={classes["info-content"]}>
                  {entityData?.zone}
                </div>
              </div>
            </div>
            <div className={classes["grid-two"]}>
              <div className={classes["info-title-wrapper"]}>
                <div>Current running {entityData?.measurement}</div>
                <div className={classes["info-content"]}>
                  {entityData?.currentRunning}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Last service {entityData?.measurement}</div>
                <div className={classes["info-content"]}>
                  {entityData?.lastService}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Inter service {entityData?.measurement}</div>
                <div className={classes["info-content"]}>
                  {(entityData?.currentRunning ?? 0) -
                    (entityData?.lastService ?? 0)}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Registered date</div>
                <div className={classes["info-content"]}>
                  {moment(entityData?.registeredDate).format(
                    DATETIME_FORMATS.DAY_MONTH_YEAR
                  )}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Status</div>
                <div className={classes["info-content"]}>
                  <EntityStatuses
                    entityStatus={entityData?.status}
                    entityID={entityData?.id}
                    isDeleted={entityData?.isDeleted}
                  />
                </div>
              </div>
            </div>
            <GetLatestEntityImage
              attachmentData={attachmentData?.getEntityLatestAttachment}
            />
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
          <div
            style={{
              display: "flex",
              flexDirection: isSmallDevice ? "column" : "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            {ENTITY_ASSIGNMENT_TYPES.map((type) => (
              <div key={type} style={{ marginTop: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: isSmallDevice ? "space-between" : undefined,
                  }}
                >
                  <div>
                    {entityData?.type?.entityType} {type}
                  </div>
                  <div
                    className={classes["info-content"]}
                    style={{ marginLeft: "1rem" }}
                  >
                    {self.assignedPermission.hasEntityAssignmentToUser &&
                    !entityData?.isDeleted ? (
                      <EntityAssignment entityId={entityData?.id} type={type} />
                    ) : (
                      <>{renderUsers(type)}</>
                    )}
                  </div>
                </div>
                {self.assignedPermission.hasEntityAssignmentToUser &&
                  renderUsers(type)}
              </div>
            ))}
          </div>
        </div>
        <div className={classes["first-wrapper"]}>
          <div className={classes["tab-container"]}>
            <div className={classes["view-ticket-wrapper__header"]}>
              <Button
                className={classes["custom-btn-secondary"]}
                onClick={() => navigate(-1)}
                icon={<LeftOutlined />}
              >
                Back
              </Button>
              <div className={classes["tab-header-wrapper"]}>
                {entityData?.type?.entityType === "Machine" ? (
                  <FaTractor className={classes["icon"]}/>
                ) : entityData?.type?.entityType === "Vehicle" ? (
                  <FaTruck className={classes["icon"]}/>
                ) : entityData?.type?.entityType === "Vessel" ? (
                  <RiSailboatFill className={classes["icon"]}/>
                ) : null}
                <div className={classes["tab-header"]}>
                  {entityData?.machineNumber}
                </div>
              </div>
              <div style={{ width: 28 }}>
                {loadingEntity || (unassigning && <Spin />)}
              </div>
            </div>
            <Tabs
              defaultActiveKey="checklist"
              style={{
                flex: 1,
              }}
            >
              <Tabs.TabPane tab="Checklist" key="checklist">
                <ViewChecklist
                  entityData={entityData}
                  isDeleted={entityData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Periodic Maintenance"
                key="periodicMaintenance"
              >
                <ViewPeriodicMaintenance
                  entityID={entityData?.id}
                  value={entityData?.currentRunning}
                  measurement={entityData?.measurement}
                  isDeleted={entityData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Spare PR" key="sparePR">
                <ViewSparePR
                  entityID={entityData?.id}
                  isDeleted={entityData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Repair" key="repair">
                <ViewRepair
                  entityID={entityData?.id}
                  isDeleted={entityData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Breakdown" key="breakdown">
                <ViewBreakdown
                  entityID={entityData?.id}
                  isDeleted={entityData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="History" key="history">
                <ViewHistory entityID={entityData?.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Gallery" key="gallery">
                <ViewGallery
                  entityID={entityData?.id}
                  isDeleted={entityData?.isDeleted}
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
        <div className={classes["usage-container"]}>
          <EntityUsageHistory />
        </div>
      </div>
    </>
  );
};

export default ViewEntity;
