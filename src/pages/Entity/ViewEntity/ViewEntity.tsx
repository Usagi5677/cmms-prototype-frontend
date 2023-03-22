import {
  CheckOutlined,
  CloseCircleOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Divider,
  Menu,
  message,
  Skeleton,
  Spin,
  Switch,
  Tabs,
  Tooltip,
} from "antd";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  GET_ALL_CHECKLIST_AND_PM_SUMMARY,
  GET_LATEST_FAVOURITE_ATTACHMENT,
  GET_SINGLE_ENTITY,
  ME_QUERY,
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
import ViewBreakdown from "./ViewBreakdown/ViewBreakdown";
import ViewHistory from "./ViewHistory/ViewHistory";
import ViewGallery from "./ViewGallery/ViewGallery";
import ViewChecklist from "./ViewChecklist/ViewChecklist";
import UserContext from "../../../contexts/UserContext";
import { stringToColor } from "../../../helpers/style";
import { Entity } from "../../../models/Entity/Entity";
import EditEntityLocation from "../../../components/EntityComponents/EditEntityLocation/EditEntityLocation";
import EditEntity from "../../../components/EntityComponents/EditEntity/EditEntity";
import DeleteEntity from "../../../components/EntityComponents/DeleteEntity/DeleteEntity";
import EntityAssignment from "../../../components/EntityComponents/EntityAssignment/EntityAssignment";
import EntityStatuses from "../../../components/EntityComponents/EntityStatuses/EntityStatuses";
import GetLatestEntityImage from "../../../components/EntityComponents/GetLatestEntityImage/GetLatestEntityImage";
import {
  TOGGLE_ENTITY_TRANSIT,
  UNASSIGN_USER_FROM_ENTITY,
} from "../../../api/mutations";
import EntityUsageHistory from "../../../components/EntityComponents/EntityUsageHistory/EntityUsageHistory";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import { hasPermissions, isAssignedType } from "../../../helpers/permissions";
import { isDeleted } from "../../../helpers/isDeleted";
import AddEntity from "../../../components/EntityComponents/AddEntity/AddEntity";
import { EntityIcon } from "../../../components/common/EntityIcon";
import ViewSubEntity from "./ViewSubEntity/ViewSubEntity";
import OpenParentEntity from "../../../components/common/OpenParentEntity/OpenParentEntity";
import EditEntityNote from "../../../components/EntityComponents/EditEntityNote/EditEntityNote";
import TextArea from "antd/lib/input/TextArea";
import { Link, useSearchParams } from "react-router-dom";

const ViewEntity = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();
  const { user: self } = useContext(UserContext);
  const [params, setParams] = useSearchParams();
  const urlParamTab = params.get("tab");

  const [getSingleEntity, { data: entity, loading: loadingEntity }] =
    useLazyQuery(GET_SINGLE_ENTITY, {
      onError: (err) => {
        // if (err.)
        errorMessage(err, "Error loading request.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    });

  const [getAllEntityChecklistAndPMSummary, { data: summaryData }] =
    useLazyQuery(GET_ALL_CHECKLIST_AND_PM_SUMMARY, {
      onError: (err) => {
        errorMessage(err, "Error loading summary data.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  // Fetch entity when component mount
  useEffect(() => {
    // if (!self.assignedPermission.hasViewEntity) {
    //   navigate("/");
    //   message.error("No permission to view entity.");
    // }
    getSingleEntity({ variables: { entityId: parseInt(id) } });
    getAllEntityChecklistAndPMSummary();
  }, [getSingleEntity, id, getAllEntityChecklistAndPMSummary]);

  const [unassignUserFromEntity, { loading: unassigning }] = useMutation(
    UNASSIGN_USER_FROM_ENTITY,
    {
      onCompleted: () => {
        message.success("Successfully unassigned user from entity.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while unassigning user.");
      },
      refetchQueries: [
        "getSingleEntity",
        "getAllHistoryOfEntity",
        { query: ME_QUERY },
      ],
    }
  );

  const [toggleComplete, { loading: toggling }] = useMutation(
    TOGGLE_ENTITY_TRANSIT,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating transit.");
      },
      refetchQueries: ["getAllHistoryOfEntity", "getSingleEntity"],
    }
  );

  let loading = true;
  const entityData: Entity = entity?.getSingleEntity;
  if (entityData) {
    loading = false;
  }

  const renderUsers = (type: "Admin" | "Engineer" | "Technician" | "User") => {
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
            if (assign.type !== type) return;
            return (
              <Tooltip
                title={
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {assign?.user?.fullName} ({assign?.user?.rcno})
                      {(isAssignedType(
                        "Admin",
                        entity?.getSingleEntity,
                        self
                      ) ||
                        hasPermissions(self, ["ASSIGN_TO_ENTITY"])) && (
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
    getLatestFavouriteAttachment,
    { data: attachmentData, loading: loadingImage, error },
  ] = useLazyQuery(GET_LATEST_FAVOURITE_ATTACHMENT, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch attachment when component mounts or when the filter object changes
  useEffect(() => {
    getLatestFavouriteAttachment({
      variables: {
        entityId: parseInt(id),
      },
    });
  }, [id, getLatestFavouriteAttachment]);

  const isSmallDevice = useIsSmallDevice();

  const flag = isDeleted(entityData?.deletedAt, entityData?.status);

  return (
    <>
      <div className={classes["container"]}>
        <Breadcrumb style={{ marginBottom: 6 }}>
          <Breadcrumb.Item>
            <Link to={"/"}>Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link
              to={`${
                entityData?.status === "Dispose"
                  ? "/dispose"
                  : urlParamTab
                  ? "/maintenances"
                  : entityData?.type?.entityType === "Machine"
                  ? "/machinery"
                  : entityData?.type?.entityType === "Vehicle"
                  ? "/vehicles"
                  : "/vessels"
              }`}
            >{`${
              entityData?.status === "Dispose"
                ? "Dispose"
                : urlParamTab
                ? "Maintenances"
                : entityData?.type?.entityType === "Machine"
                ? "Machinery"
                : entityData?.type?.entityType === "Vehicle"
                ? "Vehicles"
                : "Vessels"
            }`}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {entityData?.machineNumber
              ? entityData?.machineNumber
              : entityData?.id}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className={classes["info-container"]}>
          {loading ? (
            <Skeleton active />
          ) : (
            <>
              <div className={classes["info-btn-wrapper"]}>
                {entityData?.parentEntityId ? (
                  <OpenParentEntity id={entityData?.parentEntityId} />
                ) : (
                  <div></div>
                )}
                <div className={classes["info-option-wrapper"]}>
                  {isAssignedType("Admin", entity?.getSingleEntity, self) ? (
                    <EditEntityLocation entity={entityData} isDeleted={flag} />
                  ) : null}
                  {isAssignedType("Admin", entity?.getSingleEntity, self) ? (
                    <EditEntity entity={entityData} isDeleted={flag} />
                  ) : null}
                  {isAssignedType("Admin", entity?.getSingleEntity, self) ? (
                    <DeleteEntity
                      entityID={entityData?.id}
                      isDeleted={flag}
                      entityType={entityData?.type?.entityType}
                    />
                  ) : null}
                </div>
              </div>
              {entityData?.status === "Dispose" ? (
                <div className={classes["deleted"]}>DISPOSED</div>
              ) : null}
              <span className={classes["main-title"]} title={"Machine Number"}>
                {entityData?.machineNumber}
              </span>
              <div className={classes["info-wrapper"]}>
                <div className={classes["location-wrapper"]}>
                  <span className={classes["second-title"]} title="Location">
                    {entityData?.location?.name}
                  </span>
                  {entityData?.location?.zone?.name && (
                    <span className={classes["dot"]}>•</span>
                  )}

                  <span title="Zone" className={classes["second-title"]}>
                    {entityData?.location?.zone?.name}
                  </span>
                </div>
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
                    <div>Registered date</div>
                    <div className={classes["info-content"]}>
                      {moment(entityData?.registeredDate).format(
                        DATETIME_FORMATS.DAY_MONTH_YEAR
                      )}
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
                      {entityData?.location?.zone?.name}
                    </div>
                  </div>
                  {entityData.parentEntityId == null && (
                    <div className={classes["info-title-btn-wrapper"]}>
                      <div>Sub Entity</div>
                      <div className={classes["info-content-btn"]}>
                        {hasPermissions(self, ["ADD_ENTITY"]) && (
                          <AddEntity
                            includeSubEntity
                            entityType={entityData?.type?.entityType!}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className={classes["grid-two"]}>
                  <div className={classes["info-title-wrapper"]}>
                    <div>Brand</div>
                    <div className={classes["info-content"]}>
                      {entityData?.brand?.name}
                    </div>
                  </div>
                  {entityData?.measurement === "days" ? (
                    <div className={classes["info-title-wrapper"]}>
                      <div>Current running {entityData?.measurement}</div>
                      {entityData?.currentRunningUpdateAt !== null ? (
                        <div className={classes["info-content"]}>
                          {moment(entityData?.currentRunningUpdateAt).format(
                            DATETIME_FORMATS.DAY_MONTH_YEAR
                          )}
                        </div>
                      ) : (
                        <span>None</span>
                      )}
                    </div>
                  ) : (
                    <div className={classes["info-title-wrapper"]}>
                      <div>Current running {entityData?.measurement}</div>
                      <div className={classes["info-content"]}>
                        {entityData?.currentRunning}
                      </div>
                    </div>
                  )}

                  {entityData?.measurement === "days" ? (
                    <div className={classes["info-title-wrapper"]}>
                      <div>Last service {entityData?.measurement}</div>
                      {entityData?.lastServiceUpdateAt !== null ? (
                        <div className={classes["info-content"]}>
                          {moment(entityData?.lastServiceUpdateAt).format(
                            DATETIME_FORMATS.DAY_MONTH_YEAR
                          )}
                        </div>
                      ) : (
                        <span>None</span>
                      )}
                    </div>
                  ) : (
                    <div className={classes["info-title-wrapper"]}>
                      <div>Last service {entityData?.measurement}</div>
                      <div className={classes["info-content"]}>
                        {entityData?.lastService}
                      </div>
                    </div>
                  )}
                  {entityData?.measurement === "days" ? (
                    <div className={classes["info-title-wrapper"]}>
                      <div>Inter service {entityData?.measurement}</div>
                      <div className={classes["info-content"]}>
                        {Math.abs(
                          moment(entityData?.currentRunningUpdateAt).diff(
                            moment(entityData?.lastServiceUpdateAt),
                            "days"
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={classes["info-title-wrapper"]}>
                      <div>Inter service {entityData?.measurement}</div>
                      <div className={classes["info-content"]}>
                        {(entityData?.currentRunning ?? 0) -
                          (entityData?.lastService ?? 0)}
                      </div>
                    </div>
                  )}

                  {entityData?.dimension && (
                    <div className={classes["info-title-wrapper"]}>
                      <div>Length (m)</div>
                      <div className={classes["info-content"]}>
                        {entityData?.dimension}
                      </div>
                    </div>
                  )}

                  <div className={classes["info-title-wrapper"]}>
                    <div>Status</div>
                    <div className={classes["info-content"]}>
                      <EntityStatuses
                        entityStatus={entityData?.status}
                        entityID={entityData?.id}
                        isDeleted={entityData?.deletedAt !== null}
                        hasPermission={
                          !hasPermissions(self, ["MODIFY_BREAKDOWN"]) &&
                          !isAssignedType(
                            "Admin",
                            entity?.getSingleEntity,
                            self
                          ) &&
                          !isAssignedType(
                            "Engineer",
                            entity?.getSingleEntity,
                            self
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className={classes["info-title-wrapper"]}>
                    <div>In transit</div>
                    <div className={classes["info-content"]}>
                      <Switch
                        checked={entityData?.transit}
                        checkedChildren={
                          <CheckOutlined style={{ fontSize: "10px" }} />
                        }
                        disabled={
                          !isAssignedType(
                            "Admin",
                            entity?.getSingleEntity,
                            self
                          )
                        }
                        onChange={(e) =>
                          toggleComplete({
                            variables: {
                              id: entityData.id,
                              complete: e,
                            },
                          })
                        }
                        loading={toggling}
                      />
                    </div>
                  </div>
                </div>
                <GetLatestEntityImage
                  attachmentData={attachmentData?.getLatestFavouriteAttachment}
                />
              </div>
              <div className={classes["note-option-wrapper"]}>
                <div className={classes["note-option"]}>Note</div>
                {isAssignedType("Admin", entity?.getSingleEntity, self) ? (
                  <EditEntityNote entity={entityData} isDeleted={flag} />
                ) : null}
              </div>
              {entityData?.note !== null && (
                <>
                  <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                  <TextArea
                    placeholder="Description"
                    value={entityData?.note}
                    readOnly
                  />
                </>
              )}

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
                        justifyContent: isSmallDevice
                          ? "space-between"
                          : undefined,
                      }}
                    >
                      <div style={{ marginBottom: 6 }}>
                        {entityData?.type?.entityType} {type}
                      </div>
                      {(isAssignedType(
                        "Admin",
                        entity?.getSingleEntity,
                        self
                      ) ||
                        hasPermissions(self, ["ASSIGN_TO_ENTITY"])) &&
                        !flag && (
                          <div
                            className={classes["info-content"]}
                            style={{ marginLeft: "1rem" }}
                          >
                            <EntityAssignment
                              entityId={entityData?.id}
                              type={type}
                            />
                          </div>
                        )}
                    </div>
                    {renderUsers(type)}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {entityData?.subEntities?.length! > 0 && (
          <div>
            {hasPermissions(self, ["ADD_ENTITY"]) ? (
              <ViewSubEntity entity={entityData} isDeleted={flag} />
            ) : null}
          </div>
        )}
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
                <EntityIcon
                  entityType={entityData?.type?.entityType}
                  size={16}
                />
                <div className={classes["tab-header"]}>
                  {entityData?.machineNumber}
                </div>
              </div>
              <div style={{ width: 28 }}>
                {loadingEntity || (unassigning && <Spin />)}
              </div>
            </div>
            <Tabs
              defaultActiveKey={urlParamTab ? urlParamTab : "checklist"}
              style={{
                flex: 1,
              }}
            >
              <Tabs.TabPane
                tab={
                  <div style={{ display: "flex" }}>
                    <div>Checklist</div>
                    {summaryData?.getAllEntityChecklistAndPMSummary
                      ?.machineTaskComplete === true && (
                      <Tooltip
                        color="var(--dot-tooltip)"
                        title={
                          <div>
                            <Badge
                              color={"red"}
                              text={"Some checklists not completed"}
                              status={"processing"}
                            />
                          </div>
                        }
                      >
                        <Badge
                          color={"red"}
                          status={"processing"}
                          style={{ marginLeft: 10 }}
                        />
                      </Tooltip>
                    )}
                  </div>
                }
                key="checklist"
              >
                <ViewChecklist entityData={entityData} isDeleted={flag} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <div style={{ display: "flex" }}>
                    <div>Periodic Maintenance</div>
                    {summaryData?.getAllEntityChecklistAndPMSummary
                      ?.machineTaskComplete === true && (
                      <Tooltip
                        color="var(--dot-tooltip)"
                        title={
                          <div>
                            <Badge
                              color={"red"}
                              text={"Some tasks not completed"}
                              status={"processing"}
                            />
                          </div>
                        }
                      >
                        <Badge
                          color={"red"}
                          status={"processing"}
                          style={{ marginLeft: 10 }}
                        />
                      </Tooltip>
                    )}
                  </div>
                }
                key="periodicMaintenance"
              >
                <ViewPeriodicMaintenance isDeleted={flag} entity={entityData} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Spare PR" key="sparePR">
                <ViewSparePR isDeleted={flag} entity={entityData} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Breakdown" key="breakdown">
                <ViewBreakdown isDeleted={flag} entity={entityData} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="History" key="history">
                <ViewHistory />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Gallery" key="gallery">
                <ViewGallery isDeleted={flag} entity={entityData} />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
        <div className={classes["usage-container"]}>
          <EntityUsageHistory entity={entityData} />
        </div>
      </div>
    </>
  );
};

export default ViewEntity;
