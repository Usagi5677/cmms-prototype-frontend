import { Checkbox, Collapse, Progress, Spin, Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import classes from "./PeriodicMaintenanceCard.module.css";
import { useMutation } from "@apollo/client";
import { errorMessage } from "../../../helpers/gql";
import { TOGGLE_VERIFY_PERIODIC_MAINTENANCE } from "../../../api/mutations";
import DeletePeriodicMaintenance from "../DeletePeriodicMaintenance/DeletePeriodicMaintenance";
import { hasPermissions } from "../../../helpers/permissions";
import { ToolOutlined } from "@ant-design/icons";
import { PeriodicMaintenanceTaskList } from "../../common/PeriodicMaintenanceTaskList/PeriodicMaintenanceTaskList";
import { AddPeriodicMaintenanceTask } from "../../common/AddPeriodicMaintenanceTask";
import PeriodicMaintenance from "../../../models/PeriodicMaintenance/PeriodicMaintenance";
import PeriodicMaintenanceUpdateReading from "../PeriodicMaintenanceUpdateReading/PeriodicMaintenanceUpdateReading";
import EditPeriodicMaintenance from "../EditPeriodicMaintenance/EditPeriodicMaintenance";
import {
  PeriodicMaintenanceStatus,
  PeriodicMaintenanceSummary,
} from "../../PeriodicMaintenanceStatus/PeriodicMaintenanceStatus";
import { AddPeriodicMaintenanceObservation } from "../../common/AddPeriodicMaintenanceObservation";
import PeriodicMaintenanceCommentModel from "../../../models/PeriodicMaintenance/PeriodicMaintenanceComment";
import { PeriodicMaintenanceComment } from "../../common/PeriodicMaintenanceComment/PeriodicMaintenanceComment";

const PeriodicMaintenanceCard = ({
  periodicMaintenance,
  isDeleted,
  isOlder,
  summary,
}: {
  periodicMaintenance: PeriodicMaintenance;
  isDeleted?: boolean | undefined;
  isOlder?: boolean;
  summary?: PeriodicMaintenanceSummary[];
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
      ],
    }
  );

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
      <div style={{ marginLeft: "1rem" }}>
        <PeriodicMaintenanceStatus summary={match} />
      </div>
    );
  };

  return (
    <div id="collapseTwo">
      <Collapse ghost style={{ marginBottom: ".5rem" }}>
        <Collapse.Panel
          header={
            <div className={classes["wrapper"]}>
              <div
                className={classes["header-container"]}
                onClick={(event) => event.stopPropagation()}
              >
                <div className={classes["first-block"]}>
                  <div className={classes["id-wrapper"]}>
                    <ToolOutlined className={classes["icon"]} />
                    <span className={classes["title"]}>
                      {periodicMaintenance?.id}
                    </span>
                    {summaryMatchCurrent()}
                  </div>
                  <div className={classes["time-wrapper"]}>
                    <Tooltip title="Created At">
                      <FaRegClock />
                    </Tooltip>
                    <div
                      className={classes["time"]}
                      title={moment(periodicMaintenance?.createdAt).format(
                        DATETIME_FORMATS.FULL
                      )}
                    >
                      {moment(periodicMaintenance?.createdAt).format(
                        DATETIME_FORMATS.SHORT
                      )}
                    </div>
                  </div>
                </div>
                <div className={classes["second-block"]}>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>Name:</span>
                    <span>{periodicMaintenance?.name}</span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>Value:</span>
                    <span>
                      <span title="Value">{periodicMaintenance?.value} </span>
                      <span title="Measurement">
                        {periodicMaintenance?.measurement}
                      </span>
                    </span>
                  </div>
                </div>
                <div className={classes["third-block"]}>
                  <Checkbox
                    checked={periodicMaintenance.verifiedAt !== null}
                    disabled={
                      isDeleted ||
                      isOlder ||
                      periodicMaintenance.type === "Template"
                        ? true
                        : false
                    }
                    onChange={(e) =>
                      toggleVerify({
                        variables: {
                          id: periodicMaintenance.id,
                          verify: e.target.checked,
                        },
                      })
                    }
                    style={{ wordBreak: "break-all" }}
                  >
                    Verify{" "}
                    {toggling && (
                      <Spin style={{ marginRight: 5 }} size="small" />
                    )}
                  </Checkbox>
                  <div className={classes["fourth-block"]}>
                    {hasPermissions(self, ["MODIFY_PERIODIC_MAINTENANCE"]) ? (
                      <EditPeriodicMaintenance
                        periodicMaintenance={periodicMaintenance}
                        isDeleted={isDeleted || isOlder}
                        isCopy={
                          periodicMaintenance.type === "Copy" ? true : false
                        }
                      />
                    ) : null}
                    {hasPermissions(self, ["MODIFY_PERIODIC_MAINTENANCE"]) ? (
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
              </div>
              {periodicMaintenance.tasks!.length > 0 && periodicMaintenance.type === "Copy" && (
                <Progress
                  percent={progressPercentage}
                  strokeWidth={5}
                  style={{ marginBottom: 10, paddingRight: 10 }}
                />
              )}
            </div>
          }
          key={periodicMaintenance.id}
        >
          <div className={classes["collapse-container"]}>
            {periodicMaintenance?.type === "Copy" && !isDeleted && !isOlder && (
              <PeriodicMaintenanceUpdateReading
                periodicMaintenance={periodicMaintenance}
                isDeleted={isDeleted}
                isOlder={isOlder}
              />
            )}
            <div className={classes["info-wrapper"]}>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>
                  Current meter reading:
                </span>
                <span>{periodicMaintenance?.currentMeterReading}</span>
              </div>
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
              isOlder={isOlder}
              isCopy={periodicMaintenance.type === "Copy"}
            />
            {!isDeleted ||
              (!isOlder && (
                <div style={{ marginTop: ".5rem", fontSize: 14 }}>
                  <AddPeriodicMaintenanceTask
                    periodicMaintenance={periodicMaintenance}
                  />
                </div>
              ))}
            <div className={classes["observation-wrapper"]}>
              {periodicMaintenance?.comments?.map(
                (observation: PeriodicMaintenanceCommentModel) => {
                  return (
                    observation?.type === "Observation" && (
                      <PeriodicMaintenanceComment
                        comment={observation}
                        key={observation.id}
                        isDeleted={isDeleted}
                        isOlder={isOlder}
                        isCopy={periodicMaintenance.type === "Copy"}
                      />
                    )
                  );
                }
              )}
            </div>

            {!isDeleted && !isOlder && periodicMaintenance.type === "Copy" && (
              <AddPeriodicMaintenanceObservation
                periodicMaintenance={periodicMaintenance}
                type={"Observation"}
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
