import {
  Avatar,
  Checkbox,
  Collapse,
  Divider,
  Progress,
  Spin,
  Tooltip,
} from "antd";
import moment from "moment";
import { memo, useContext, useEffect } from "react";
import { FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import classes from "./PeriodicMaintenanceCard.module.css";
import { useLazyQuery, useMutation } from "@apollo/client";
import { errorMessage } from "../../../helpers/gql";
import {
  ACTIVATE_PERIODIC_MAINTENANCE,
  DELETE_PERIODIC_MAINTENANCE_COMMENT,
  TOGGLE_VERIFY_PERIODIC_MAINTENANCE,
} from "../../../api/mutations";
import DeletePeriodicMaintenance from "../DeletePeriodicMaintenance/DeletePeriodicMaintenance";
import { hasPermissions, isAssignedType } from "../../../helpers/permissions";
import { CheckCircleOutlined, ToolOutlined } from "@ant-design/icons";

import { AddPeriodicMaintenanceTask } from "../../common/AddPeriodicMaintenanceTask";
import PeriodicMaintenance from "../../../models/PeriodicMaintenance/PeriodicMaintenance";
import PeriodicMaintenanceUpdateReading from "../PeriodicMaintenanceUpdateReading/PeriodicMaintenanceUpdateReading";
import EditPeriodicMaintenance from "../EditPeriodicMaintenance/EditPeriodicMaintenance";
import {
  PeriodicMaintenanceStatus,
  PeriodicMaintenanceSummary,
} from "../../PeriodicMaintenanceStatus/PeriodicMaintenanceStatus";
import { CommentCard } from "../../common/CommentCard/CommentCard";
import UpsertPMNotificationReminder from "../../common/EditPMNotificationReminder/UpsertPMNotificationReminder";
import Comment from "../../../models/Comment";
import { AddPeriodicMaintenanceObservation } from "../../common/AddPeriodicMaintenanceObservation";
import { Entity } from "../../../models/Entity/Entity";
import { CHECK_COPY_PM_EXIST } from "../../../api/queries";
import PeriodicMaintenanceStatusTag from "../../common/PeriodicMaintenanceStatusTag";
import { PeriodicMaintenanceStatus as pmstatus } from "../../../models/Enums";
import PeriodicMaintenanceTaskList from "../../common/PeriodicMaintenanceTaskList/PeriodicMaintenanceTaskList";
import { stringToColor } from "../../../helpers/style";

const PeriodicMaintenanceCard = ({
  periodicMaintenance,
  isDeleted,
  isOlder,
  summary,
  isCopy,
  entity,
  upcoming,
}: {
  periodicMaintenance: PeriodicMaintenance;
  isDeleted?: boolean | undefined;
  isOlder?: boolean;
  summary?: PeriodicMaintenanceSummary[];
  isCopy?: boolean;
  entity?: Entity;
  upcoming?: boolean;
}) => {
  const { user: self } = useContext(UserContext);

  const [toggleVerify, { loading: toggling }] = useMutation(
    TOGGLE_VERIFY_PERIODIC_MAINTENANCE,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating verify.");
      },
      refetchQueries: [
        "getAllHistoryOfEntity",
        "periodicMaintenances",
        "periodicMaintenanceSummary",
        "getSingleEntity",
        "getAllPMWithPagination",
        "allPMStatusCount",
      ],
    }
  );

  const [toggleActivate, { loading: toggling2 }] = useMutation(
    ACTIVATE_PERIODIC_MAINTENANCE,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while activating.");
      },
      refetchQueries: [
        "checkCopyPMExist",
        "getAllHistoryOfEntity",
        "periodicMaintenances",
        "periodicMaintenanceSummary",
        "getAllPMWithPagination",
        "allPMStatusCount",
      ],
    }
  );

  const [checkCopyPMExist, { data }] = useLazyQuery(CHECK_COPY_PM_EXIST, {
    onError: (err) => {
      errorMessage(
        err,
        "Error loading check if periodic maintenance copy exist"
      );
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    checkCopyPMExist({
      variables: {
        id: periodicMaintenance.id,
      },
    });
  }, []);

  const taskData = periodicMaintenance?.tasks!;

  const progressPercentage = Math.round(
    (taskData?.filter((task) => task.completedAt !== null).length /
      taskData?.length) *
      100
  );
  const summaryMatchCurrent = () => {
    if (!summary || !periodicMaintenance) return null;
    const match = summary?.find(
      (ps: PeriodicMaintenanceSummary) => ps.id === periodicMaintenance.id
    );
    if (!match) return null;
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <PeriodicMaintenanceStatus summary={match} />
      </div>
    );
  };

  const flag =
    (!isDeleted ||
      !(isOlder ? true : false) ||
      isAssignedType("Technician", entity!, self) ||
      hasPermissions(self, ["MODIFY_PERIODIC_MAINTENANCE"])) &&
    periodicMaintenance.type !== "Copy";

  const flag2 =
    (!hasPermissions(self, ["MODIFY_PERIODIC_MAINTENANCE"]) &&
      (!isAssignedType("Technician", entity!, self) ||
        !isAssignedType("User", entity!, self))) ||
    isDeleted ||
    isOlder;
  let percentage = (
    ((entity?.currentRunning! - periodicMaintenance?.currentMeterReading!) /
      periodicMaintenance?.value!) *
    100
  ).toFixed(0);
  let percentageStyle = "var(--text-primary)";
  if (percentage) {
    if (parseInt(percentage) > 100) {
      percentage = "100";
    }
    if (parseInt(percentage) < 0) {
      percentage = "0";
    }
    if (parseInt(percentage) >= 80) {
      percentageStyle = "#52c41a";
    } else if (parseInt(percentage) >= 40) {
      percentageStyle = "#faad13";
    } else {
      percentageStyle = "#fa541c";
    }
  }
  return (
    <div id="collapseTwo">
      <Collapse ghost style={{ marginBottom: ".5rem" }}>
        <Collapse.Panel
          header={
            <>
              <div className={classes["header-container"]}>
                <div className={classes["level-one"]}>
                  <div className={classes["name-wrapper"]}>
                    {periodicMaintenance?.type !== "Template" && (
                      <div>{summaryMatchCurrent()}</div>
                    )}
                    <Tooltip title="Name">
                      <span className={classes["title"]}>
                        {periodicMaintenance?.name}
                      </span>
                    </Tooltip>
                  </div>

                  <div className={classes["actions"]}>
                    {hasPermissions(self, ["MODIFY_PERIODIC_MAINTENANCE"]) ||
                    isAssignedType("Technician", entity!, self) ? (
                      <EditPeriodicMaintenance
                        periodicMaintenance={periodicMaintenance}
                        isDeleted={
                          isDeleted || periodicMaintenance?.verifiedAt !== null
                        }
                        isCopy={
                          periodicMaintenance?.type === "Copy" ? true : false
                        }
                      />
                    ) : null}
                    {/*hasPermissions(self, ["MODIFY_PERIODIC_MAINTENANCE"]) ||
                    (isAssignedType("Technician", entity!, self) &&
                      !isDeleted) ? (
                      <UpsertPMNotificationReminder
                        periodicMaintenance={periodicMaintenance}
                        isDeleted={isDeleted}
                        isCopy={
                          periodicMaintenance.type === "Copy" ? true : false
                        }
                        isTemplate={
                          periodicMaintenance.type === "Template" ? true : false
                        }
                      />
                      ) : null */}
                    {hasPermissions(self, ["MODIFY_PERIODIC_MAINTENANCE"]) ||
                    isAssignedType("Technician", entity!, self) ? (
                      <DeletePeriodicMaintenance
                        id={periodicMaintenance?.id}
                        isDeleted={
                          isDeleted || periodicMaintenance?.verifiedAt !== null
                        }
                        isCopy={
                          periodicMaintenance?.type === "Copy" ? true : false
                        }
                      />
                    ) : null}
                  </div>
                </div>
                <div className={classes["level-two"]}>
                  {periodicMaintenance?.type === "Template" ? (
                    <Checkbox
                      checked={data?.checkCopyPMExist}
                      className={classes["checkbox"]}
                      disabled={
                        (!hasPermissions(self, [
                          "MODIFY_PERIODIC_MAINTENANCE",
                        ]) &&
                          !isAssignedType("Technician", entity!, self)) ||
                        isDeleted ||
                        data?.checkCopyPMExist
                      }
                      onChange={(e) =>
                        toggleActivate({
                          variables: {
                            id: periodicMaintenance?.id,
                          },
                        })
                      }
                    >
                      Activate{" "}
                      {toggling && (
                        <Spin style={{ marginRight: 5 }} size="small" />
                      )}
                    </Checkbox>
                  ) : (
                    periodicMaintenance?.type === "Copy" && (
                      <Checkbox
                        checked={periodicMaintenance?.verifiedAt !== null}
                        className={classes["checkbox"]}
                        disabled={
                          !isAssignedType("Admin", entity!, self) || isDeleted
                        }
                        onChange={(e) =>
                          toggleVerify({
                            variables: {
                              id: periodicMaintenance?.id,
                              verify: e.target.checked,
                            },
                          })
                        }
                      >
                        Verify{" "}
                        {toggling && (
                          <Spin style={{ marginRight: 5 }} size="small" />
                        )}
                      </Checkbox>
                    )
                  )}
                  <Divider className={classes["divider"]} type="vertical" />
                  {periodicMaintenance?.value && (
                    <div className={classes["reading"]}>
                      <Tooltip title="Value">
                        <span>
                          {periodicMaintenance?.value?.toLocaleString()}{" "}
                        </span>
                      </Tooltip>
                      <Tooltip title="Measurement">
                        <span className={classes["suffix"]}>
                          {periodicMaintenance?.measurement === "Kilometer"
                            ? "km"
                            : periodicMaintenance?.measurement === "Hour"
                            ? "hr"
                            : periodicMaintenance?.measurement === "Day" ||
                              periodicMaintenance?.measurement === "Week" ||
                              periodicMaintenance?.measurement === "Month"
                            ? "days"
                            : ""}
                        </span>
                      </Tooltip>
                    </div>
                  )}
                  {periodicMaintenance?.currentMeterReading !== null && (
                    <Divider className={classes["divider"]} type="vertical" />
                  )}

                  {periodicMaintenance?.currentMeterReading !== null && (
                    <div className={classes["reading"]}>
                      <span>
                        {periodicMaintenance?.currentMeterReading?.toLocaleString()}
                      </span>
                      <span className={classes["suffix"]}>current reading</span>
                    </div>
                  )}
                </div>

                {periodicMaintenance?.tasks!.length > 0 &&
                  periodicMaintenance?.type === "Copy" && (
                    <Progress
                      percent={progressPercentage}
                      strokeWidth={5}
                      style={{ paddingRight: 8 }}
                    />
                  )}
                <div className={classes["level-three"]}>
                  <div className={classes["icon-text-opac"]}>
                    <ToolOutlined className={classes["icon"]} />
                    <span>{periodicMaintenance?.id}</span>
                  </div>
                  <Divider className={classes["divider"]} type="vertical" />
                  <Tooltip title="Created At">
                    <div className={classes["icon-text-opac"]}>
                      <FaRegClock className={classes["icon"]} />
                      <span>
                        {moment(periodicMaintenance?.createdAt).format(
                          DATETIME_FORMATS.SHORT
                        )}
                      </span>
                    </div>
                  </Tooltip>

                  <Divider className={classes["divider"]} type="vertical" />
                  <PeriodicMaintenanceStatusTag
                    status={periodicMaintenance?.status as pmstatus}
                    height={16}
                    fontSize={9}
                    borderRadius={2}
                    marginBottom={2}
                  />
                </div>
              </div>
            </>
          }
          key={periodicMaintenance?.id}
        >
          <div className={classes["collapse-container"]}>
            <div className={classes["info-wrapper"]}>
              {periodicMaintenance?.verifiedAt && (
                <div>
                  <span className={classes["collapse-title"]}>
                    Verified <CheckCircleOutlined />
                  </span>
                  <Divider style={{ marginTop: 0 }} />
                  <div className={classes["user-avatar-wrapper"]}>
                    <Avatar
                      style={{
                        backgroundColor: stringToColor(
                          periodicMaintenance?.verifiedBy?.fullName === null &&
                            periodicMaintenance?.verifiedAt
                            ? "Automatically"
                            : periodicMaintenance?.verifiedBy?.fullName!
                        ),
                      }}
                      size={"large"}
                    >
                      {periodicMaintenance?.verifiedBy?.fullName === null &&
                      periodicMaintenance?.verifiedAt
                        ? "Automatically"
                            .match(/^\w|\b\w(?=\S+$)/g)
                            ?.join()
                            .replace(",", "")
                            .toUpperCase()
                        : periodicMaintenance?.verifiedBy?.fullName
                            .match(/^\w|\b\w(?=\S+$)/g)
                            ?.join()
                            .replace(",", "")
                            .toUpperCase()}
                    </Avatar>
                    <div className={classes["user-avatar-detail"]}>
                      <div className={classes["user-avatar-name-wrapper"]}>
                        {periodicMaintenance?.verifiedBy?.fullName === null &&
                        periodicMaintenance?.verifiedAt ? (
                          <Tooltip title={"Verified By"}>
                            <span>Automatically</span>
                          </Tooltip>
                        ) : (
                          <Tooltip title={"Verified By"}>
                            <span>
                              {periodicMaintenance?.verifiedBy?.fullName}
                            </span>
                          </Tooltip>
                        )}
                        <span className={classes["dot"]}>•</span>
                        <Tooltip title={"RCNO"}>
                          <span>{periodicMaintenance?.verifiedBy?.rcno}</span>
                        </Tooltip>
                      </div>
                      <Tooltip title={"Verified At"}>
                        <span className={classes["user-avatar-level-two"]}>
                          {moment(periodicMaintenance?.verifiedAt).format(
                            DATETIME_FORMATS.SHORT
                          )}
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}
              {periodicMaintenance?.type === "Copy" && (
                <>
                  <span className={classes["collapse-title-two"]}>
                    Current Meter Reading
                  </span>
                  <Divider style={{ marginTop: 0 }} />
                </>
              )}

              {periodicMaintenance?.type === "Copy" && (
                <PeriodicMaintenanceUpdateReading
                  periodicMaintenance={periodicMaintenance}
                  isVerified={periodicMaintenance?.verifiedAt !== null}
                />
              )}
            </div>
            <span className={classes["collapse-title-two"]}>Task</span>
            <Divider style={{ marginTop: 0 }} />
            <PeriodicMaintenanceTaskList
              periodicMaintenance={periodicMaintenance}
              tasks={taskData}
              level={0}
              isDeleted={isDeleted}
              isVerified={periodicMaintenance?.verifiedAt !== null}
              isCopy={isCopy}
              upcoming={upcoming}
            />
            {flag && !upcoming && (
              <div style={{ marginTop: ".5rem", fontSize: 14 }}>
                <AddPeriodicMaintenanceTask
                  periodicMaintenance={periodicMaintenance}
                />
              </div>
            )}
            <div className={classes["observation-wrapper"]}>
              {periodicMaintenance?.comments?.map((observation: Comment) => {
                return (
                  observation?.type === "Observation" && (
                    <CommentCard
                      comment={observation}
                      key={observation?.id}
                      isDeleted={isDeleted}
                      isVerified={periodicMaintenance?.verifiedAt !== null}
                      isCopy={periodicMaintenance?.type === "Copy"}
                      mutation={DELETE_PERIODIC_MAINTENANCE_COMMENT}
                      refetchQueries={[
                        "periodicMaintenances",
                        "periodicMaintenanceSummary",
                      ]}
                    />
                  )
                );
              })}
            </div>

            {!isDeleted && !isOlder && periodicMaintenance?.type === "Copy" && (
              <div className={classes["add-observation-wrapper"]}>
                <AddPeriodicMaintenanceObservation
                  periodicMaintenanceId={periodicMaintenance?.id}
                  type={"Observation"}
                  placeholder={"Add Observation"}
                  isDeleted={isDeleted}
                  isVerified={periodicMaintenance?.verifiedAt !== null}
                  isCopy={periodicMaintenance?.type === "Copy"}
                />
              </div>
            )}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default memo(PeriodicMaintenanceCard);
