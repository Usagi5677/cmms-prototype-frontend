import { Badge, Checkbox, Collapse, Spin } from "antd";
import React, { useContext } from "react";
import moment from "moment";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import TransportationPeriodicMaintenance from "../../models/Transportation/TransportationPeriodicMaintenance";
import TransportationPMTask from "../../models/Machine/TransportationPMTask";
import { DELETE_TRANSPORTATION_PM_TASK, TOGGLE_TRANSPORTATION_PM_TASK } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import UserContext from "../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../helpers/constants";
import { AddTransportationPeriodicMaintenanceTask } from "./AddTransportationPeriodicMaintenanceTask";


export interface TaskListProps {
  periodicMaintenance: TransportationPeriodicMaintenance;
  tasks: TransportationPMTask[];
  level: number;
  isDeleted?: boolean | undefined;
}

export const TransportationPMTaskList: React.FC<TaskListProps> = ({
  periodicMaintenance,
  tasks,
  level,
  isDeleted
}) => {
  const { user: self } = useContext(UserContext);

  const [toggleTask, { loading: toggling }] = useMutation(TOGGLE_TRANSPORTATION_PM_TASK, {
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating checklist item.");
    },
    refetchQueries: [
      "getAllPeriodicMaintenanceOfTransportation",
      "getAllHistoryOfTransportation",
    ],
  });

  const [deleteMachineChecklistItem, { loading: deleting }] = useMutation(
    DELETE_TRANSPORTATION_PM_TASK,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while deleting checklist item.");
      },
      refetchQueries: [
        "getAllPeriodicMaintenanceOfTransportation",
        "getAllHistoryOfTransportation",
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
                    {self.assignedPermission.hasMachineChecklistEdit && !isDeleted && (
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
                        {self.assignedPermission.hasMachineChecklistDelete && !isDeleted ? (
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
              <TransportationPMTaskList
                periodicMaintenance={periodicMaintenance}
                tasks={task.subTasks}
                level={level + 1}
                isDeleted={isDeleted}
              />
              {level < 2 && !isDeleted && (
                <div>
                  <AddTransportationPeriodicMaintenanceTask
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
