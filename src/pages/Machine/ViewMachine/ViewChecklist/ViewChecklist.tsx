import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Button,
  Checkbox,
  Col,
  Form,
  InputNumber,
  message,
  Row,
  Spin,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { useContext, useState } from "react";
import { FaCheck } from "react-icons/fa";
import {
  DELETE_MACHINE_CHECKLIST_ITEM,
  TOGGLE_MACHINE_CHECKLIST_ITEM,
} from "../../../../api/mutations";
import AddMachineChecklist from "../../../../components/MachineComponents/AddMachineChecklist/AddMachineChecklist";
import MachineChecklistItem from "../../../../components/MachineComponents/MachineChecklistItem/MachineChecklistItem";
import UserContext from "../../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../../helpers/constants";
import { errorMessage } from "../../../../helpers/gql";
import Machine from "../../../../models/Machine";
import classes from "./ViewChecklist.module.css";

const ViewChecklist = ({
  machineData,
  isDeleted,
}: {
  machineData: Machine;
  isDeleted?: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);
  const [checkboxState, setCheckboxState] = useState<any>([]);
  const [uncheckboxState, setUncheckboxState] = useState<any>([]);
  const [form] = useForm();

  const [deleteMachineChecklistItem, { loading: deleting }] = useMutation(
    DELETE_MACHINE_CHECKLIST_ITEM,
    {
      onCompleted: () => {},
      onError: (error) => {
        errorMessage(error, "Unexpected error while deleting checklist item.");
      },
      refetchQueries: ["getSingleMachine", "getAllHistoryOfMachine"],
    }
  );
  const [toggleMachineChecklistItem, { loading: toggling }] = useMutation(
    TOGGLE_MACHINE_CHECKLIST_ITEM,
    {
      onCompleted: () => {},
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating checklist item.");
      },
      refetchQueries: [
        "getSingleMachine",
        "getAllHistoryOfMachine",
        "singleMachineUsageHistory",
      ],
    }
  );

  const onFinish = (values: any) => {
    const { currentMeterReading, workingHour } = values;

    if (!currentMeterReading) {
      message.error("Please enter the Current Running Hour.");
      return;
    }
    if (!workingHour) {
      message.error("Please enter the Working Hour.");
      return;
    }
    if (checkboxState.length <= 0 && uncheckboxState.length <= 0) {
      message.error("Please update a checkbox.");
      return;
    }

    toggleMachineChecklistItem({
      variables: {
        id: checkboxState,
        currentMeterReading,
        workingHour,
        uncheckId: uncheckboxState,
      },
    });
    setCheckboxState([]);
    setUncheckboxState([]);
    form.resetFields();
  };

  const onClickCheckbox = (checkbox: any, valueOfCheckbox: any) => {
    const { checked } = checkbox.target;

    setCheckboxState((prev: any) =>
      checked
        ? [...prev, valueOfCheckbox]
        : prev.filter((val: any) => val !== valueOfCheckbox)
    );
    setUncheckboxState((prev: any) =>
      !checked
        ? [...prev, valueOfCheckbox]
        : prev.filter((val: any) => val !== valueOfCheckbox)
    );
    //setCheckboxState((prev: any) => [...prev, valueOfCheckbox]);
  };

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
        >
          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                name="currentMeterReading"
                required={false}
                rules={[
                  {
                    required: true,
                    message: "Please enter the current running hour.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Current running hrs"
                  style={{ width: "100%" }}
                  disabled={isDeleted}
                />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                name="workingHour"
                required={false}
                rules={[
                  {
                    required: true,
                    message: "Please enter the working hour.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Working Hour"
                  style={{ width: "100%" }}
                  disabled={isDeleted}
                />
              </Form.Item>
            </div>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={toggling}
                className={classes["custom-btn-primary"]}
                disabled={isDeleted}
              >
                Done
              </Button>
            </Form.Item>
          </div>
        </Form>
        {self.assignedPermission.hasMachineChecklistAdd && !isDeleted ? (
          <AddMachineChecklist machineID={machineData?.id} />
        ) : null}
      </div>
      <div className={classes["content"]}>
        <div className={classes["content-wrapper-one"]}>
          <div className={classes["content-title"]}>Daily</div>

          {machineData?.checklistItems.map((item) =>
            item.type === "Daily" ? (
              <div className={classes["border"]} key={item.id}>
                <div className={classes["checkbox-container"]}>
                  {self.assignedPermission?.hasMachineChecklistEdit ? (
                    <Checkbox
                      defaultChecked={item.completedAt !== null}
                      onChange={(e) => onClickCheckbox(e, item.id)}
                      className={classes["checkbox"]}
                      disabled={isDeleted}
                    >
                      <div className={classes["description"]}>
                        {item.description}
                      </div>
                    </Checkbox>
                  ) : (
                    <div className={classes["description"]}>
                      {item.description}
                    </div>
                  )}

                  <div className={classes["deleteWrapper"]}>
                    {(deleting || toggling) && (
                      <Spin style={{ marginRight: 5 }} size="small" />
                    )}
                    {!deleting && (
                      <div>
                        {self.assignedPermission?.hasMachineChecklistDelete &&
                        !isDeleted ? (
                          <CloseCircleOutlined
                            className={classes["delete"]}
                            onClick={() => {
                              deleteMachineChecklistItem({
                                variables: {
                                  id: item.id,
                                },
                              });
                            }}
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
                {item.completedAt && (
                  <span className={classes["completedAt"]}>
                    {item.completedAt && (
                      <span
                        title={moment(item.completedAt).format(
                          DATETIME_FORMATS.FULL
                        )}
                      >
                        {moment(item.completedAt).format(
                          DATETIME_FORMATS.SHORT
                        )}
                      </span>
                    )}{" "}
                    • Completed by {item.completedBy?.fullName} (
                    {item.completedBy?.rcno})
                  </span>
                )}
              </div>
            ) : null
          )}
        </div>
        <div className={classes["content-wrapper-two"]}>
          <div className={classes["content-title"]}>Weekly</div>
          {machineData?.checklistItems.map((item) =>
            item.type === "Weekly" ? (
              <div className={classes["border"]} key={item.id}>
                <div className={classes["checkbox-container"]}>
                  {self.assignedPermission?.hasMachineChecklistEdit ? (
                    <Checkbox
                      defaultChecked={item.completedAt !== null}
                      onChange={(e) => onClickCheckbox(e, item.id)}
                      className={classes["checkbox"]}
                      disabled={isDeleted}
                    >
                      <div className={classes["description"]}>
                        {item.description}
                      </div>
                    </Checkbox>
                  ) : (
                    <div className={classes["description"]}>
                      {item.description}
                    </div>
                  )}

                  <div className={classes["deleteWrapper"]}>
                    {(deleting || toggling) && (
                      <Spin style={{ marginRight: 5 }} size="small" />
                    )}
                    {!deleting && (
                      <div>
                        {self.assignedPermission?.hasMachineChecklistDelete &&
                        !isDeleted ? (
                          <CloseCircleOutlined
                            className={classes["delete"]}
                            onClick={() => {
                              deleteMachineChecklistItem({
                                variables: {
                                  id: item.id,
                                },
                              });
                            }}
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
                {item.completedAt && (
                  <span className={classes["completedAt"]}>
                    {item.completedAt && (
                      <span
                        title={moment(item.completedAt).format(
                          DATETIME_FORMATS.FULL
                        )}
                      >
                        {moment(item.completedAt).format(
                          DATETIME_FORMATS.SHORT
                        )}
                      </span>
                    )}{" "}
                    • Completed by {item.completedBy?.fullName} (
                    {item.completedBy?.rcno})
                  </span>
                )}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewChecklist;
