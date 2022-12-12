import { Badge, Checkbox, Collapse, Spin } from "antd";
import React, { useContext, useState } from "react";
import moment from "moment";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { errorMessage } from "../../../helpers/gql";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import {
  TOGGLE_PERIODIC_MAINTENANCE_TASK,
  DELETE_PERIODIC_MAINTENANCE_TASK,
  DELETE_PERIODIC_MAINTENANCE_COMMENT,
} from "../../../api/mutations";
import PeriodicMaintenance from "../../../models/PeriodicMaintenance/PeriodicMaintenance";
import PeriodicMaintenanceTask from "../../../models/PeriodicMaintenance/PeriodicMaintenanceTask";
import { AddPeriodicMaintenanceTask } from "../AddPeriodicMaintenanceTask";
import { hasPermissions } from "../../../helpers/permissions";
import { AddPeriodicMaintenanceComment } from "../AddPeriodicMaintenanceComment";
import { CommentCard } from "../CommentCard/CommentCard";
import classes from "./PeriodicMaintenanceTaskList.module.css";
import Comment from "../../../models/Comment";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";

export interface TaskListProps {
  periodicMaintenance: PeriodicMaintenance;
  tasks: PeriodicMaintenanceTask[];
  level: number;
  isDeleted?: boolean | undefined;
  isOlder?: boolean;
  isCopy?: boolean;
  upcoming?: boolean;
}

export const PeriodicMaintenanceTaskList: React.FC<TaskListProps> = ({
  periodicMaintenance,
  tasks,
  level,
  isDeleted,
  isOlder,
  isCopy,
  upcoming,
}) => {
  const { user: self } = useContext(UserContext);
  const [toggleTask, { loading: toggling }] = useMutation(
    TOGGLE_PERIODIC_MAINTENANCE_TASK,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating task.");
      },
      refetchQueries: [
        "getAllHistoryOfEntity",
        "getAllEntityChecklistAndPMSummary",
        "periodicMaintenances",
        "periodicMaintenanceSummary",
      ],
    }
  );

  const [deleteTask, { loading: deleting }] = useMutation(
    DELETE_PERIODIC_MAINTENANCE_TASK,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while deleting task.");
      },
      refetchQueries: [
        "getAllHistoryOfEntity",
        "getAllEntityChecklistAndPMSummary",
        "periodicMaintenances",
        "periodicMaintenanceSummary",
      ],
    }
  );

  const isSmallDevice = useIsSmallDevice(600, true);

  return (
    <div id="collapseThree">
      {tasks?.length > 0 && (
        <Collapse ghost style={{ marginBottom: ".5rem" }}>
          {tasks?.map((task: any) => (
            <Collapse.Panel
              header={
                <div className={classes["header-container"]}>
                  <div className={classes["comment-wrapper"]}>
                    <div className={classes["top-wrapper"]}>
                      <div className={classes["name-wrapper"]}>
                        {task.name}
                        {task?.subTasks?.length > 0 && (
                          <Badge
                            count={`${task?.subTasks?.length} sub task${
                              task?.subTasks?.length === 1 ? "" : "s"
                            }`}
                            size={"small"}
                            style={{
                              color: "black",
                              backgroundColor: "#e5e5e5",
                              marginLeft: ".5rem",
                              fontSize: isSmallDevice ? 12 : 8,
                            }}
                          />
                        )}
                      </div>

                      <div className={classes["actions-wrapper"]}>
                        {task.completedAt && (
                          <div className={classes["completedAt"]}>
                            {task?.completedBy?.fullName && (
                              <div>{task?.completedBy?.fullName}</div>
                            )}
                            <div
                              className={classes["date"]}
                              title={moment(task.completedAt).format(
                                DATETIME_FORMATS.FULL
                              )}
                            >
                              {moment(task.completedAt).format(
                                DATETIME_FORMATS.SHORT
                              )}
                            </div>
                          </div>
                        )}
                        <div className={classes["actions"]}>
                          {isCopy && (
                            <AddPeriodicMaintenanceComment
                              periodicMaintenance={periodicMaintenance}
                              task={task}
                              type={"Remark"}
                              isDeleted={isDeleted}
                              isOlder={isOlder}
                              isCopy={isCopy}
                            />
                          )}

                          {isCopy && !isDeleted && (
                            <Checkbox
                              checked={task.completedAt !== null}
                              style={{ marginRight: ".5rem" }}
                              disabled={isOlder || !isCopy}
                              onChange={(e) =>
                                toggleTask({
                                  variables: {
                                    id: task.id,
                                    complete: e.target.checked,
                                  },
                                })
                              }
                            ></Checkbox>
                          )}
                          {(deleting || toggling) && (
                            <Spin style={{ marginRight: 5 }} size="small" />
                          )}
                          {!deleting && (
                            <div>
                              {hasPermissions(self, [
                                "MODIFY_PERIODIC_MAINTENANCE",
                              ]) &&
                              !isDeleted &&
                              !isOlder ? (
                                <CloseCircleOutlined
                                  onClick={() => {
                                    deleteTask({
                                      variables: {
                                        id: task.id,
                                      },
                                    });
                                  }}
                                  disabled={isOlder}
                                />
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {task?.remarks?.map((remark: Comment) => (
                      <CommentCard
                        comment={remark}
                        isRemark
                        key={remark.id}
                        isDeleted={isDeleted}
                        isOlder={isOlder}
                        mutation={DELETE_PERIODIC_MAINTENANCE_COMMENT}
                        refetchQueries={[
                          "periodicMaintenances",
                          "periodicMaintenanceSummary",
                        ]}
                      />
                    ))}
                  </div>
                </div>
              }
              key={task.id}
            >
              <PeriodicMaintenanceTaskList
                periodicMaintenance={periodicMaintenance}
                tasks={task.subTasks}
                level={level + 1}
                isDeleted={isDeleted}
                isOlder={isOlder}
                isCopy={isCopy}
                upcoming={upcoming}
              />
              {level < 2 && !isDeleted && !isOlder && !isCopy && !upcoming && (
                <div>
                  <AddPeriodicMaintenanceTask
                    periodicMaintenance={periodicMaintenance}
                    parentTaskId={task.id}
                    text="Add new sub task"
                  />
                </div>
              )}
            </Collapse.Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
};
