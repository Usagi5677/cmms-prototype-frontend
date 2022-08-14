import { Badge, Checkbox, Collapse, Spin } from "antd";
import React, { useContext } from "react";
import moment from "moment";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { errorMessage } from "../../helpers/gql";
import UserContext from "../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../helpers/constants";
import EntityPeriodicMaintenance from "../../models/Entity/EntityPeriodicMaintenance";
import EntityPMTask from "../../models/Entity/EntityPMTask";
import {
  DELETE_ENTITY_PM_TASK,
  TOGGLE_ENTITY_PM_TASK,
} from "../../api/mutations";
import { AddEntityPeriodicMaintenanceTask } from "./AddEntityPeriodicMaintenanceTask";

export interface TaskListProps {
  periodicMaintenance: EntityPeriodicMaintenance;
  tasks: EntityPMTask[];
  level: number;
  isDeleted?: boolean | undefined;
}

export const EntityPMTaskList: React.FC<TaskListProps> = ({
  periodicMaintenance,
  tasks,
  level,
  isDeleted,
}) => {
  const { user: self } = useContext(UserContext);

  const [toggleTask, { loading: toggling }] = useMutation(
    TOGGLE_ENTITY_PM_TASK,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating checklist item.");
      },
      refetchQueries: [
        "getAllPeriodicMaintenanceOfEntity",
        "getAllHistoryOfEntity",
      ],
    }
  );

  const [deleteMachineChecklistItem, { loading: deleting }] = useMutation(
    DELETE_ENTITY_PM_TASK,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while deleting checklist item.");
      },
      refetchQueries: [
        "getAllPeriodicMaintenanceOfEntity",
        "getAllHistoryOfEntity",
      ],
    }
  );

  return (
    <div>
      {tasks?.length > 0 && (
        <Collapse ghost style={{ marginBottom: ".5rem" }}>
          {tasks?.map((task: any) => (
            <Collapse.Panel
              header={
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    paddingBottom: 6,
                    alignItems: "center",
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    {task?.subTasks?.length > 0 && (
                      <Badge
                        count={`${task?.subTasks?.length} sub task${
                          task?.subTasks?.length === 1 ? "" : "s"
                        }`}
                        style={{
                          color: "black",
                          backgroundColor: "#e5e5e5",
                          marginRight: ".5rem",
                        }}
                      />
                    )}
                    {task.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {task.completedAt && (
                      <div style={{ opacity: 0.5 }}>
                        {task?.completedBy?.fullName && (
                          <span>{task?.completedBy?.fullName}</span>
                        )}
                        <span
                          style={{
                            marginLeft: ".5rem",
                            marginRight: ".5rem",
                          }}
                          title={moment(task.completedAt).format(
                            DATETIME_FORMATS.FULL
                          )}
                        >
                          {moment(task.completedAt).format(
                            DATETIME_FORMATS.SHORT
                          )}
                        </span>
                      </div>
                    )}
                    {self.assignedPermission?.hasEntityChecklistEdit &&
                      !isDeleted && (
                        <Checkbox
                          checked={task.completedAt !== null}
                          style={{ marginRight: ".5rem" }}
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
                        {self.assignedPermission?.hasEntityChecklistDelete &&
                        !isDeleted ? (
                          <CloseCircleOutlined
                            onClick={() => {
                              deleteMachineChecklistItem({
                                variables: {
                                  id: task.id,
                                },
                              });
                            }}
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              }
              key={task.id}
            >
              <EntityPMTaskList
                periodicMaintenance={periodicMaintenance}
                tasks={task.subTasks}
                level={level + 1}
                isDeleted={isDeleted}
              />
              {level < 2 && !isDeleted && (
                <div>
                  <AddEntityPeriodicMaintenanceTask
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
