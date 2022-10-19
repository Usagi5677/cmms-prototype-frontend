import { Checkbox, Collapse, Progress, Spin, Tooltip } from "antd";
import moment from "moment";
import { useContext, useEffect } from "react";
import { FaRegClock, FaRegUser } from "react-icons/fa";
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
import { RiseOutlined, ToolOutlined } from "@ant-design/icons";
import { PeriodicMaintenanceTaskList } from "../../common/PeriodicMaintenanceTaskList/PeriodicMaintenanceTaskList";
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

const PeriodicMaintenanceCard = ({
  periodicMaintenance,
  isDeleted,
  isOlder,
  summary,
  isCopy,
  entity,
}: {
  periodicMaintenance: PeriodicMaintenance;
  isDeleted?: boolean | undefined;
  isOlder?: boolean;
  summary?: PeriodicMaintenanceSummary[];
  isCopy?: boolean;
  entity?: Entity;
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
      <div style={{ display: "flex", alignItems: "center", paddingRight: 5 }}>
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
            <div className={classes["wrapper"]}>
              <div className={classes["header-container"]}>
                <div className={classes["level-one"]}>
                  <div className={classes["header-info-wrapper"]}>
                    <div className={classes["first-block"]}>
                      {periodicMaintenance.type === "Template" ? (
                        <Checkbox
                          checked={data?.checkCopyPMExist}
                          disabled={
                            (!hasPermissions(self, [
                              "MODIFY_PERIODIC_MAINTENANCE",
                            ]) &&
                              !isAssignedType("Technician", entity!, self)) ||
                            isDeleted ||
                            isOlder ||
                            data?.checkCopyPMExist
                          }
                          onChange={(e) =>
                            toggleActivate({
                              variables: {
                                id: periodicMaintenance.id,
                              },
                            })
                          }
                          style={{ wordBreak: "break-all", marginRight: 40 }}
                        >
                          Activate{" "}
                          {toggling && (
                            <Spin style={{ marginRight: 5 }} size="small" />
                          )}
                        </Checkbox>
                      ) : (
                        periodicMaintenance.type === "Copy" && (
                          <Checkbox
                            checked={periodicMaintenance.verifiedAt !== null}
                            disabled={flag2}
                            onChange={(e) =>
                              toggleVerify({
                                variables: {
                                  id: periodicMaintenance.id,
                                  verify: e.target.checked,
                                },
                              })
                            }
                            style={{ wordBreak: "break-all", marginRight: 40 }}
                          >
                            Verify{" "}
                            {toggling && (
                              <Spin style={{ marginRight: 5 }} size="small" />
                            )}
                          </Checkbox>
                        )
                      )}
                      {periodicMaintenance?.value && (
                        <div
                          className={(classes["reading"], classes["space-two"])}
                        >
                          <span className={classes["reading-title"]}>
                            Every:
                          </span>
                          <span>
                            <span title="Value">
                              {periodicMaintenance?.value}{" "}
                            </span>
                            <span title="Measurement">
                              {periodicMaintenance?.measurement}
                            </span>
                          </span>
                        </div>
                      )}
                      {periodicMaintenance?.currentMeterReading !== null && (
                        <div
                          className={(classes["reading"], classes["space-two"])}
                        >
                          <span className={classes["reading-title"]}>
                            Current meter reading:
                          </span>
                          {periodicMaintenance?.currentMeterReading}
                        </div>
                      )}

                      <div
                        className={(classes["reading"], classes["flex-limit"])}
                      >
                        <span className={classes["reading-title"]}>Name:</span>
                        {periodicMaintenance?.name}
                      </div>
                    </div>
                  </div>

                  <div className={classes["second-block"]}>
                    {hasPermissions(self, ["MODIFY_PERIODIC_MAINTENANCE"]) ||
                    isAssignedType("Technician", entity!, self) ? (
                      <EditPeriodicMaintenance
                        periodicMaintenance={periodicMaintenance}
                        isDeleted={isDeleted || isOlder}
                        isCopy={
                          periodicMaintenance.type === "Copy" ? true : false
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
                        isDeleted={isDeleted || isOlder}
                        isCopy={
                          periodicMaintenance.type === "Copy" ? true : false
                        }
                      />
                    ) : null}
                  </div>
                </div>
                {periodicMaintenance.tasks!.length > 0 &&
                  periodicMaintenance.type === "Copy" && (
                    <Progress percent={progressPercentage} strokeWidth={5} />
                  )}
                <div className={classes["level-two"]}>
                  {summaryMatchCurrent()}
                  <div className={(classes["id-wrapper"], classes["space"])}>
                    <ToolOutlined className={classes["icon"]} />
                    <span className={classes["title"]}>
                      {periodicMaintenance?.id}
                    </span>
                  </div>
                  <div className={(classes["title-wrapper"], classes["space"])}>
                    <Tooltip title="Created Date">
                      <FaRegClock className={classes["icon"]} />
                    </Tooltip>

                    <span
                      className={classes["title"]}
                      title={moment(periodicMaintenance?.createdAt).format(
                        DATETIME_FORMATS.FULL
                      )}
                    >
                      {moment(periodicMaintenance?.createdAt).format(
                        DATETIME_FORMATS.SHORT
                      )}
                    </span>
                  </div>
                  {periodicMaintenance?.type === "Template" &&
                    periodicMaintenance?.value! !== null && (
                      <div
                        className={
                          (classes["title-wrapper"],
                          classes["spaceWithNoOpacity"])
                        }
                        title={`${
                          entity?.currentRunning! -
                          periodicMaintenance?.currentMeterReading!
                        }`}
                      >
                        <RiseOutlined
                          className={classes["icon"]}
                          style={{ opacity: 0.5 }}
                        />

                        <span
                          className={classes["title"]}
                          style={{ color: percentageStyle, fontWeight: 700 }}
                        >
                          {percentage}
                          {"%"}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>
          }
          key={periodicMaintenance.id}
        >
          <div className={classes["collapse-container"]}>
            <div className={classes["info-wrapper"]}>
              {periodicMaintenance.verifiedAt && (
                <div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Verified by:
                    </span>
                    <span>
                      {periodicMaintenance.verifiedBy?.fullName} (
                      {periodicMaintenance.verifiedBy?.rcno})
                    </span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Verified at:
                    </span>
                    <span
                      title={moment(periodicMaintenance.verifiedAt).format(
                        DATETIME_FORMATS.FULL
                      )}
                    >
                      {moment(periodicMaintenance.verifiedAt).format(
                        DATETIME_FORMATS.SHORT
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <PeriodicMaintenanceTaskList
              periodicMaintenance={periodicMaintenance}
              tasks={taskData}
              level={0}
              isDeleted={isDeleted}
              isOlder={isOlder ? true : false}
              isCopy={isCopy}
            />
            {flag && (
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
                      key={observation.id}
                      isDeleted={isDeleted}
                      isOlder={isOlder}
                      isCopy={periodicMaintenance.type === "Copy"}
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

            {!isDeleted && !isOlder && periodicMaintenance.type === "Copy" && (
              <AddPeriodicMaintenanceObservation
                periodicMaintenanceId={periodicMaintenance.id}
                type={"Observation"}
                placeholder={"Add new observation"}
                isDeleted={isDeleted}
                isOlder={isOlder}
                isCopy={periodicMaintenance.type === "Copy"}
              />
            )}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default PeriodicMaintenanceCard;
