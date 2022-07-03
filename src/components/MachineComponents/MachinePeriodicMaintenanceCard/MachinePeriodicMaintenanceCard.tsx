import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Badge,
  Checkbox,
  Collapse,
  Divider,
  Progress,
  Spin,
  Tooltip,
} from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegBell, FaRegClock } from "react-icons/fa";
import {
  DELETE_MACHINE_CHECKLIST_ITEM,
  DELETE_TASK,
  TOGGLE_MACHINE_CHECKLIST_ITEM,
  TOGGLE_TASK,
} from "../../../api/mutations";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import { getEqualValuesUnder140 } from "../../../helpers/style";
import PeriodicMaintenance from "../../../models/Machine/MachinePeriodicMaintenance";
import MachinePMTask from "../../../models/Machine/MachinePMTask";
import AddMachinePMSubTasks from "../AddMachinePMSubTasks/AddMachinePMSubTasks";
import DeleteMachinePeriodicMaintenance from "../DeleteMachinePeriodicMaintenance/DeleteMachinePeriodicMaintenance";
import EditMachinePeriodicMaintenance from "../EditMachinePeriodicMaintenance/EditMachinePeriodicMaintenance";
import MachinePeriodicMaintenanceStatus from "../MachinePeriodicMaintenanceStatus/MachinePeriodicMaintenanceStatus";
import classes from "./MachinePeriodicMaintenanceCard.module.css";

const MachinePeriodicMaintenanceCard = ({
  periodicMaintenance,
  isDeleted,
}: {
  periodicMaintenance: PeriodicMaintenance;
  isDeleted: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);

  const [deleteMachineChecklistItem, { loading: deleting }] = useMutation(
    DELETE_TASK,
    {
      onCompleted: () => {},
      onError: (error) => {
        errorMessage(error, "Unexpected error while deleting checklist item.");
      },
      refetchQueries: [
        "getAllPeriodicMaintenanceOfMachine",
        "getAllHistoryOfMachine",
      ],
    }
  );
  const [toggleTask, { loading: toggling }] = useMutation(TOGGLE_TASK, {
    onCompleted: () => {},
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating checklist item.");
    },
    refetchQueries: [
      "getAllPeriodicMaintenanceOfMachine",
      "getAllHistoryOfMachine",
    ],
  });

  const highestCount = () => {
    let highest = 5;
    periodicMaintenance.MachinePeriodicMaintenanceTask?.forEach((aq: any) => {
      const count = aq.subTasks.length;
      if (count > highest) highest = count;
    });
    return highest;
  };

  const colors = getEqualValuesUnder140(highestCount());

  const taskData = periodicMaintenance?.MachinePeriodicMaintenanceTask!;

  const progressPercentage = Math.round(
    (taskData?.filter((task) => task.completedAt !== null).length /
      taskData?.length) *
      100
  );

  return (
    <div className={classes["container"]}>
      <div className={classes["container-wrapper"]}>
        <div className={classes["wrapper"]}>
          <div className={classes["first-block"]}>
            <div>{periodicMaintenance?.id}</div>
            <div className={classes["time-wrapper"]}>
              <Tooltip title="Created At">
                <FaRegClock />
              </Tooltip>
              <div className={classes["time"]}>
                {moment(periodicMaintenance?.createdAt).format(
                  DATETIME_FORMATS.DAY_MONTH_YEAR
                )}
              </div>
            </div>
            <div className={classes["time-wrapper"]}>
              <Tooltip title="Start Date">
                <FaRegClock />
              </Tooltip>
              <div className={classes["time"]}>
                {moment(periodicMaintenance?.startDate).format(
                  DATETIME_FORMATS.FULL
                )}
              </div>
            </div>
            
            <div>Title: {periodicMaintenance?.title}</div>
            {/* <div>Description: {periodicMaintenance?.description}</div> */}
            {periodicMaintenance?.completedBy?.fullName && (
              <div className={classes["completedBy"]}>
                Completed by {periodicMaintenance?.completedBy?.fullName}
              </div>
            )}
          </div>
          <div className={classes["second-block"]}>
            <div className={classes["second-block-wrapper"]}>
              <Tooltip title="Notification reminder">
                <FaRegBell />
              </Tooltip>
              <div className={classes["second-block-title"]}>
                {periodicMaintenance?.value} {periodicMaintenance?.measurement}
              </div>
            </div>
          </div>
          <div className={classes["third-block"]}>
            {self.assignedPermission.hasMachinePeriodicMaintenanceEdit ? (
              <MachinePeriodicMaintenanceStatus
                periodicMaintenance={periodicMaintenance}
                isDeleted={isDeleted}
              />
            ) : null}
          </div>
        </div>
        {!isDeleted && <div className={classes["fourth-block"]}>
          <AddMachinePMSubTasks
            tasks={periodicMaintenance?.MachinePeriodicMaintenanceTask}
          />
          {self.assignedPermission.hasMachinePeriodicMaintenanceEdit ? (
            <EditMachinePeriodicMaintenance
              periodicMaintenance={periodicMaintenance}
            />
          ) : null}
          {self.assignedPermission.hasMachinePeriodicMaintenanceDelete ? (
            <DeleteMachinePeriodicMaintenance id={periodicMaintenance?.id} />
          ) : null}
        </div>}
        
      </div>
      <div className={classes["task-progress"]}>Task Progress</div>

      {periodicMaintenance.MachinePeriodicMaintenanceTask!.length > 0 && (
        <Progress
          percent={progressPercentage}
          strokeWidth={5}
          style={{ marginBottom: 10, paddingRight: 10 }}
        />
      )}
      {taskData?.length > 0 ? (
        <Collapse ghost style={{ paddingBottom: 12 }}>
          {taskData?.map((task: any) => {
            if (task.parentTaskId === null) {
              return (
                <Collapse.Panel
                  header={
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <Badge
                            count={task?.subTasks?.length}
                            showZero
                            style={{
                              backgroundColor: `hsla(${
                                colors[task.subTasks.length]
                              },100%, 85%, 1)`,
                              color: "black",
                              marginRight: ".5rem",
                            }}
                          />
                          <div className={classes["taskID-bold"]}>
                            {" "}
                            {task.id}:{" "}
                          </div>

                          {task.name}
                        </div>
                        {task?.completedBy?.fullName && (
                          <div className={classes["completedBy"]}>
                            Completed by {task?.completedBy?.fullName}
                          </div>
                        )}
                      </div>

                      <div className={classes["checkbox-container"]}>
                        {self.assignedPermission.hasMachineChecklistEdit ? (
                          <Checkbox
                            checked={task.completedAt !== null}
                            onChange={(e) =>
                              toggleTask({
                                variables: {
                                  id: task.id,
                                  complete: e.target.checked,
                                },
                              })
                            }
                            className={classes["checkbox"]}
                            disabled={isDeleted}
                          >
                            {task.completedAt && (
                              <div>
                                <span
                                  className={classes["completedAt"]}
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
                          </Checkbox>
                        ) : (
                          <div>
                            {task.completedAt && (
                              <div>
                                <span
                                  className={classes["completedAt"]}
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
                          </div>
                        )}

                        <div className={classes["deleteWrapper"]}>
                          {(deleting || toggling) && (
                            <Spin style={{ marginRight: 5 }} size="small" />
                          )}
                          {!deleting && (
                            <div>
                              {self.assignedPermission
                                .hasMachineChecklistDelete ? (
                                <CloseCircleOutlined
                                  className={classes["delete"]}
                                  onClick={() => {
                                    deleteMachineChecklistItem({
                                      variables: {
                                        id: task.id,
                                      },
                                    });
                                  }}
                                  style={{
                                    pointerEvents: isDeleted ? "none" : "auto",
                                    color: isDeleted ? "grey" : "inherit"
                                  }}
                                  disabled={isDeleted}
                                />
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  }
                  key={task.id}
                >
                  {task?.subTasks?.map((subtask: any, i: number) => {
                    if (subtask.subTasks.length > 0) {
                      return (
                        <Collapse
                          key={subtask.id}
                          ghost
                          style={{ paddingBottom: 12 }}
                        >
                          <Collapse.Panel
                            header={
                              <div
                                style={{
                                  display: "flex",
                                  width: "100%",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <Badge
                                    count={subtask?.subTasks?.length}
                                    showZero
                                    style={{
                                      backgroundColor: `hsla(${
                                        colors[task.subTasks.length]
                                      },100%, 85%, 1)`,
                                      color: "black",
                                      marginRight: ".5rem",
                                    }}
                                  />
                                  <div className={classes["taskID-bold"]}>
                                    {" "}
                                    {subtask.id}:{" "}
                                  </div>

                                  {subtask.name}
                                </div>
                                <div className={classes["checkbox-container"]}>
                                  {self.assignedPermission
                                    .hasMachineChecklistEdit ? (
                                    <Checkbox
                                      checked={subtask.completedAt !== null}
                                      onChange={(e) =>
                                        toggleTask({
                                          variables: {
                                            id: subtask.id,
                                            complete: e.target.checked,
                                          },
                                        })
                                      }
                                      className={classes["checkbox"]}
                                      disabled={isDeleted}
                                    >
                                      {subtask.completedAt && (
                                        <span
                                          className={classes["completedAt"]}
                                          title={moment(
                                            subtask.completedAt
                                          ).format(DATETIME_FORMATS.FULL)}
                                        >
                                          {moment(subtask.completedAt).format(
                                            DATETIME_FORMATS.SHORT
                                          )}
                                        </span>
                                      )}
                                    </Checkbox>
                                  ) : (
                                    <div>
                                      {subtask.completedAt && (
                                        <span
                                          className={classes["completedAt"]}
                                          title={moment(
                                            subtask.completedAt
                                          ).format(DATETIME_FORMATS.FULL)}
                                        >
                                          {moment(subtask.completedAt).format(
                                            DATETIME_FORMATS.SHORT
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  <div className={classes["deleteWrapper"]}>
                                    {(deleting || toggling) && (
                                      <Spin
                                        style={{ marginRight: 5 }}
                                        size="small"
                                      />
                                    )}
                                    {!deleting && (
                                      <div>
                                        {self.assignedPermission
                                          .hasMachineChecklistDelete ? (
                                          <CloseCircleOutlined
                                            className={classes["delete"]}
                                            onClick={() => {
                                              deleteMachineChecklistItem({
                                                variables: {
                                                  id: subtask.id,
                                                },
                                              });
                                            }}
                                            style={{
                                              pointerEvents: isDeleted ? "none" : "auto",
                                              color: isDeleted ? "grey" : "inherit"
                                            }}
                                            disabled={isDeleted}
                                          />
                                        ) : null}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            }
                            key={subtask.id}
                          >
                            {subtask?.subTasks?.map(
                              (subtaskTwo: any, i2: number) => {
                                return (
                                  <div key={subtaskTwo.id}>
                                    {i2 !== 0 && (
                                      <Divider style={{ margin: 5 }} />
                                    )}
                                    <div
                                      id="innerSubTask"
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "4px 0 4px 10px",
                                        borderRadius: 20,
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          width: "100%",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>
                                          <strong
                                            style={{ marginRight: ".25rem" }}
                                          >
                                            {subtaskTwo.id}:
                                          </strong>
                                          {subtaskTwo.name}
                                        </div>

                                        <div
                                          className={
                                            classes["checkbox-container"]
                                          }
                                        >
                                          {self.assignedPermission
                                            .hasMachineChecklistEdit ? (
                                            <Checkbox
                                              checked={
                                                subtaskTwo.completedAt !== null
                                              }
                                              onChange={(e) =>
                                                toggleTask({
                                                  variables: {
                                                    id: subtaskTwo.id,
                                                    complete: e.target.checked,
                                                  },
                                                })
                                              }
                                              className={classes["checkbox"]}
                                              disabled={isDeleted}
                                            >
                                              {subtaskTwo.completedAt && (
                                                <span
                                                  className={
                                                    classes["completedAt"]
                                                  }
                                                  title={moment(
                                                    subtaskTwo.completedAt
                                                  ).format(
                                                    DATETIME_FORMATS.FULL
                                                  )}
                                                >
                                                  {moment(
                                                    subtaskTwo.completedAt
                                                  ).format(
                                                    DATETIME_FORMATS.SHORT
                                                  )}
                                                </span>
                                              )}
                                            </Checkbox>
                                          ) : (
                                            <div>
                                              {subtaskTwo.completedAt && (
                                                <span
                                                  className={
                                                    classes["completedAt"]
                                                  }
                                                  title={moment(
                                                    subtaskTwo.completedAt
                                                  ).format(
                                                    DATETIME_FORMATS.FULL
                                                  )}
                                                >
                                                  {moment(
                                                    subtaskTwo.completedAt
                                                  ).format(
                                                    DATETIME_FORMATS.SHORT
                                                  )}
                                                </span>
                                              )}
                                            </div>
                                          )}

                                          <div
                                            className={classes["deleteWrapper"]}
                                          >
                                            {(deleting || toggling) && (
                                              <Spin
                                                style={{ marginRight: 5 }}
                                                size="small"
                                              />
                                            )}
                                            {!deleting && (
                                              <div>
                                                {self.assignedPermission
                                                  .hasMachineChecklistDelete ? (
                                                  <CloseCircleOutlined
                                                    className={
                                                      classes["delete"]
                                                    }
                                                    onClick={() => {
                                                      deleteMachineChecklistItem(
                                                        {
                                                          variables: {
                                                            id: subtaskTwo.id,
                                                          },
                                                        }
                                                      );
                                                    }}
                                                    style={{
                                                      pointerEvents: isDeleted ? "none" : "auto",
                                                      color: isDeleted ? "grey" : "inherit"
                                                    }}
                                                    disabled={isDeleted}
                                                  />
                                                ) : null}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </Collapse.Panel>
                        </Collapse>
                      );
                    } else {
                      return (
                        <div
                          key={subtask.id}
                          id="innerSubTask"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "4px 0 4px 10px",
                            borderRadius: 20,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <strong style={{ marginRight: ".25rem" }}>
                                {subtask.id}:
                              </strong>
                              {subtask.name}
                            </div>
                            {subtask?.completedBy?.fullName && (
                              <div className={classes["completedBy"]}>
                                Completed by {subtask?.completedBy?.fullName}
                              </div>
                            )}
                          </div>

                          <div className={classes["checkbox-container"]}>
                            {self.assignedPermission.hasMachineChecklistEdit ? (
                              <Checkbox
                                checked={subtask.completedAt !== null}
                                onChange={(e) =>
                                  toggleTask({
                                    variables: {
                                      id: subtask.id,
                                      complete: e.target.checked,
                                    },
                                  })
                                }
                                className={classes["checkbox"]}
                                disabled={isDeleted}
                              >
                                {subtask.completedAt && (
                                  <span
                                    className={classes["completedAt"]}
                                    title={moment(subtask.completedAt).format(
                                      DATETIME_FORMATS.FULL
                                    )}
                                  >
                                    {moment(subtask.completedAt).format(
                                      DATETIME_FORMATS.SHORT
                                    )}
                                  </span>
                                )}
                              </Checkbox>
                            ) : (
                              <div>
                                {subtask.completedAt && (
                                  <span
                                    className={classes["completedAt"]}
                                    title={moment(subtask.completedAt).format(
                                      DATETIME_FORMATS.FULL
                                    )}
                                  >
                                    {moment(subtask.completedAt).format(
                                      DATETIME_FORMATS.SHORT
                                    )}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className={classes["deleteWrapper"]}>
                              {(deleting || toggling) && (
                                <Spin style={{ marginRight: 5 }} size="small" />
                              )}
                              {!deleting && (
                                <div>
                                  {self.assignedPermission
                                    .hasMachineChecklistDelete ? (
                                    <CloseCircleOutlined
                                      className={classes["delete"]}
                                      onClick={() => {
                                        deleteMachineChecklistItem({
                                          variables: {
                                            id: subtask.id,
                                          },
                                        });
                                      }}
                                      style={{
                                        pointerEvents: isDeleted ? "none" : "auto",
                                        color: isDeleted ? "grey" : "inherit"
                                      }}
                                      disabled={isDeleted}
                                    />
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </Collapse.Panel>
              );
            }
          })}
        </Collapse>
      ) : (
        "No tasks."
      )}
    </div>
  );
};

export default MachinePeriodicMaintenanceCard;
