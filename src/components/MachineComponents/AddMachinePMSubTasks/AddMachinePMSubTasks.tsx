import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { FaTasks, FaTimes } from "react-icons/fa";
import {
  Badge,
  Button,
  Collapse,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Spin,
  Tooltip,
} from "antd";
import { errorMessage } from "../../../helpers/gql";
import { useForm } from "antd/lib/form/Form";
import {
  ADD_MACHINE_BREAKDOWN,
  ADD_MACHINE_PERIODIC_MAINTENANCE_TASK,
} from "../../../api/mutations";
import classes from "./AddMachinePMSubTasks.module.css";
import { getEqualValuesUnder140 } from "../../../helpers/style";

const AddMachinePMSubTasks = (periodicMaintenanceTasks: any) => {
  const [details, setDetails] = useState("");
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [addPeriodicMaintenanceSubTask, { loading }] = useMutation(
    ADD_MACHINE_PERIODIC_MAINTENANCE_TASK,
    {
      onCompleted: () => {
        setDetails("");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while adding sub task.");
      },
      refetchQueries: [
        "getAllPeriodicMaintenanceOfMachine",
        "getAllHistoryOfMachine",
      ],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { parentTaskID, name } = values;

    if (!parentTaskID) {
      message.error("Please enter the task ID.");
      return;
    }
    if (!name) {
      message.error("Please enter the name.");
      return;
    }

    addPeriodicMaintenanceSubTask({
      variables: {
        parentTaskId: parentTaskID,
        periodicMaintenanceId:
          periodicMaintenanceTasks?.tasks[0]?.periodicMaintenanceId,
        name,
      },
    });
  };

  const highestCount = () => {
    let highest = 5;
    periodicMaintenanceTasks?.tasks.forEach((aq: any) => {
      const count = aq.subTasks.length;
      if (count > highest) highest = count;
    });
    return highest;
  };

  const colors = getEqualValuesUnder140(highestCount());

  return (
    <>
      <div className={classes["info-edit"]}>
        <Tooltip title="Add sub task">
          <FaTasks onClick={() => setVisible(true)} />
        </Tooltip>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          title={"Add Sub Tasks"}
          width="90vw"
          style={{ maxWidth: 700 }}
        >
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            id="myForm"
            labelAlign="right"
          >
            <Row>
              <div className={classes["taskID-col"]}>
                <Form.Item
                  label="Task ID"
                  name="parentTaskID"
                  required={false}
                  rules={[
                    {
                      required: true,
                      message: "Please enter the parent task ID.",
                    },
                  ]}
                >
                  <InputNumber placeholder="Task ID" />
                </Form.Item>
              </div>
              <div className={classes["taskName-col"]}>
                <Form.Item
                  label="Name"
                  name="name"
                  required={false}
                  rules={[
                    {
                      required: true,
                      message: "Please enter the name.",
                    },
                  ]}
                >
                  <Input placeholder="Name" />
                </Form.Item>
              </div>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className={classes["custom-btn-primary"]}
                >
                  Add
                </Button>
              </Form.Item>
            </Row>
          </Form>
          {periodicMaintenanceTasks?.tasks.length > 0 ? (
            <Collapse ghost style={{ paddingBottom: 12 }}>
              {periodicMaintenanceTasks.tasks.map((task: any) => {
                if (task.parentTaskId === null) {
                  return (
                    <Collapse.Panel
                      header={
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
                                }
                                key={task.id}
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
                                            }}
                                          >
                                            <strong
                                              style={{ marginRight: ".25rem" }}
                                            >
                                              {subtaskTwo.id}:
                                            </strong>
                                            {subtaskTwo.name}
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
        </Modal>
      </div>
    </>
  );
};

export default AddMachinePMSubTasks;
