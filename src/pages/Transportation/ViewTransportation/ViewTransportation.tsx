import { CloseCircleOutlined, LeftOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Avatar, Button, message, Spin, Tabs, Tooltip } from "antd";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  GET_SINGLE_TRANSPORTATION,
  GET_TRANSPORTATION_LATEST_ATTACHMENT,
} from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import classes from "./ViewTransportation.module.css";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import Transportation from "../../../models/Transportation";
import EditTransportation from "../../../components/TransportationComponents/EditTransportation/EditTransportation";
import DeleteTransportation from "../../../components/TransportationComponents/DeleteTransportation/DeleteTransportation";
import TransportationStatuses from "../../../components/TransportationComponents/TransportationStatuses/TransportationStatuses";
import ViewChecklist from "./ViewChecklist/ViewChecklist";
import ViewPeriodicMaintenance from "./ViewPeriodicMaintenance/ViewPeriodicMaintenance";
import ViewSparePR from "./ViewSparePR/ViewSparePR";
import ViewRepair from "./ViewRepair/ViewRepair";
import ViewBreakdown from "./ViewBreakdown/ViewBreakdown";
import ViewHistory from "./ViewHistory/ViewHistory";
import ViewGallery from "./ViewGallery/ViewGallery";
import UserContext from "../../../contexts/UserContext";
import { stringToColor } from "../../../helpers/style";
import { UNASSIGN_USER_FROM_TRANSPORTATION } from "../../../api/mutations";
import TransportationAssignment from "../../../components/TransportationComponents/TransportationAssignment/TransportationAssignment";
import TransportationUsageHistory from "../../../components/TransportationComponents/TransportationUsageHistory/TransportationUsageHistory";
import EditTransportationUsage from "../../../components/TransportationComponents/EditTransportationUsage/EditTransportationUsage";
import { FaMapMarkerAlt, FaTractor } from "react-icons/fa";
import GetLatestTransportationImage from "../../../components/TransportationComponents/GetLatestTransportationImage/GetLatestTransportationImage";

const ViewTransportation = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();
  const { user: self } = useContext(UserContext);
  const [
    getSingleTransportation,
    { data: transportation, loading: loadingTransportation },
  ] = useLazyQuery(GET_SINGLE_TRANSPORTATION, {
    onError: (err) => {
      errorMessage(err, "Error loading request.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  // Fetch transportation when component mount
  useEffect(() => {
    if (
      !self.assignedPermission.hasViewVessel ||
      !self.assignedPermission.hasViewVehicle
    ) {
      navigate("/");
      message.error("No permission to view transportation.");
    }
    getSingleTransportation({ variables: { transportationId: parseInt(id) } });
  }, [getSingleTransportation, id]);

  const [unassignUserFromTransportation, { loading: unassigning }] =
    useMutation(UNASSIGN_USER_FROM_TRANSPORTATION, {
      onCompleted: () => {
        message.success("Successfully unassigned user from transportation.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while unassigning user.");
      },
      refetchQueries: [
        "getSingleTransportation",
        "getAllHistoryOfTransportation",
      ],
    });

  const transportationData: Transportation =
    transportation?.getSingleTransportation;

  const renderUsers = () => {
    return (
      transportationData?.assignees?.length > 0 && (
        <Avatar.Group
          maxCount={5}
          maxStyle={{
            color: "#f56a00",
            backgroundColor: "#fde3cf",
          }}
        >
          {transportationData?.assignees?.map((user) => {
            return (
              <Tooltip
                title={
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {user.fullName} ({user.rcno})
                      {self.assignedPermission
                        .hasTransportationUnassignmentToUser && (
                        <CloseCircleOutlined
                          style={{
                            cursor: "pointer",
                            marginLeft: 3,
                          }}
                          onClick={() =>
                            unassignUserFromTransportation({
                              variables: {
                                transportationId: transportationData?.id,
                                userId: user.id,
                              },
                            })
                          }
                        />
                      )}
                    </div>
                  </>
                }
                placement="bottom"
                key={user.id}
              >
                <Avatar
                  style={{
                    backgroundColor: stringToColor(user.fullName),
                  }}
                >
                  {user.fullName
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
    getTransportationLatestAttachment,
    { data: attachmentData, loading: loadingImage, error },
  ] = useLazyQuery(GET_TRANSPORTATION_LATEST_ATTACHMENT, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch attachment when component mounts or when the filter object changes
  useEffect(() => {
    getTransportationLatestAttachment({
      variables: {
        transportationId: parseInt(id),
      },
    });
  }, [id, getTransportationLatestAttachment]);

  return (
    <>
      <div className={classes["container"]}>
        <div className={classes["info-container"]}>
          <div className={classes["info-btn-wrapper"]}>
            {self.assignedPermission.hasEditTransportationUsage ? (
              <EditTransportationUsage
                transportation={transportationData}
                isDeleted={transportationData?.isDeleted}
              />
            ) : null}
            {self.assignedPermission.hasTransportationEdit ? (
              <EditTransportation
                transportation={transportationData}
                isDeleted={transportationData?.isDeleted}
              />
            ) : null}
            {self.assignedPermission.hasTransportationDelete ? (
              <DeleteTransportation
                transportationID={transportationData?.id}
                isDeleted={transportationData?.isDeleted}
              />
            ) : null}
          </div>
          {transportationData?.isDeleted ? (
            <div className={classes["deleted"]}>DISPOSED</div>
          ) : null}
          <div className={classes["info-wrapper"]}>
            <div className={classes["location-wrapper"]}>
              <FaMapMarkerAlt />
              <span className={classes["title"]}>
                {transportationData?.location}
              </span>
            </div>
          </div>
          <div className={classes["title-wrapper"]}>
            <FaTractor />
            <span className={classes["title"]}>
              {transportationData?.machineNumber}
            </span>
          </div>
          <div className={classes["info-title-container"]}>
            <div className={classes["grid-one"]}>
              <div className={classes["info-title-wrapper"]}>
                <div>Machine Number</div>
                <div className={classes["info-content"]}>
                  {transportationData?.machineNumber}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Model</div>
                <div className={classes["info-content"]}>
                  {transportationData?.model}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Type</div>
                <div className={classes["info-content"]}>
                  {transportationData?.type}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Engine</div>
                <div className={classes["info-content"]}>
                  {transportationData?.engine}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Assignments</div>
                <div className={classes["info-content"]}>
                  {self.assignedPermission.hasTransportationAssignmentToUser &&
                  !transportationData?.isDeleted ? (
                    <TransportationAssignment
                      transportationID={transportationData?.id}
                    />
                  ) : (
                    <>{renderUsers()}</>
                  )}
                </div>
              </div>
              {self.assignedPermission.hasTransportationAssignmentToUser &&
                renderUsers()}
            </div>
            <div className={classes["grid-two"]}>
              <div className={classes["info-title-wrapper"]}>
                <div>Current mileage ({transportationData?.measurement})</div>
                <div className={classes["info-content"]}>
                  {transportationData?.currentMileage}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>
                  Last service mileage ({transportationData?.measurement})
                </div>
                <div className={classes["info-content"]}>
                  {transportationData?.lastServiceMileage}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>
                  Inter service mileage ({transportationData?.measurement})
                </div>
                <div className={classes["info-content"]}>
                  {transportationData?.interServiceMileage}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Registered date</div>
                <div className={classes["info-content"]}>
                  {moment(transportationData?.registeredDate).format(
                    DATETIME_FORMATS.DAY_MONTH_YEAR
                  )}
                </div>
              </div>
              <div className={classes["info-title-wrapper"]}>
                <div>Status</div>
                <div className={classes["info-content"]}>
                  <TransportationStatuses
                    transportationStatus={transportationData?.status}
                    transportationID={transportationData?.id}
                    isDeleted={transportationData?.isDeleted}
                  />
                </div>
              </div>
            </div>
            <GetLatestTransportationImage
              attachmentData={attachmentData?.getTransportationLatestAttachment}
            />
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
                <div className={classes["tab-header"]}>
                  {transportationData?.machineNumber}
                </div>
              </div>
              <div style={{ width: 28 }}>
                {loadingTransportation || (unassigning && <Spin />)}
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
                  transportationData={transportationData}
                  isDeleted={transportationData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Periodic Maintenance"
                key="periodicMaintenance"
              >
                <ViewPeriodicMaintenance
                  transportationID={transportationData?.id}
                  value={transportationData?.currentMileage}
                  measurement={transportationData?.measurement}
                  isDeleted={transportationData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Spare PR" key="sparePR">
                <ViewSparePR
                  transportationID={transportationData?.id}
                  isDeleted={transportationData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Repair" key="repair">
                <ViewRepair
                  transportationID={transportationData?.id}
                  isDeleted={transportationData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Breakdown" key="breakdown">
                <ViewBreakdown
                  transportationID={transportationData?.id}
                  isDeleted={transportationData?.isDeleted}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="History" key="history">
                <ViewHistory transportationID={transportationData?.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Gallery" key="gallery">
                <ViewGallery
                  transportationID={transportationData?.id}
                  isDeleted={transportationData?.isDeleted}
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
        <div className={classes["usage-container"]}>
          <TransportationUsageHistory />
        </div>
      </div>
    </>
  );
};

export default ViewTransportation;
