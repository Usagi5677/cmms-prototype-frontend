import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Checkbox, Form, InputNumber, message, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { useContext, useState } from "react";
import {
  DELETE_TRANSPORTATION_CHECKLIST_ITEM,
  TOGGLE_TRANSPORTATION_CHECKLIST_ITEM,
} from "../../../../api/mutations";
import AddTransportationChecklist from "../../../../components/TransportationComponents/AddTransportationChecklist/AddTransportationChecklist";
import TransportationChecklistItem from "../../../../components/TransportationComponents/TransportationChecklistItem/TransportationChecklistItem";
import UserContext from "../../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../../helpers/constants";
import { errorMessage } from "../../../../helpers/gql";
import Transportation from "../../../../models/Transportation";
import classes from "./ViewChecklist.module.css";

const ViewChecklist = ({
  transportationData,
}: {
  transportationData: Transportation;
}) => {
  const { user: self } = useContext(UserContext);
  const [checkboxState, setCheckboxState] = useState<any>([]);
  const [uncheckboxState, setUncheckboxState] = useState<any>([]);
  const [form] = useForm();

  const [deleteTransportationChecklistItem, { loading: deleting }] =
    useMutation(DELETE_TRANSPORTATION_CHECKLIST_ITEM, {
      onCompleted: () => {},
      onError: (error) => {
        errorMessage(error, "Unexpected error while deleting checklist item.");
      },
      refetchQueries: [
        "getSingleTransportation",
        "getAllHistoryOfTransportation",
      ],
    });
  const [toggleTransportationChecklistItem, { loading: toggling }] =
    useMutation(TOGGLE_TRANSPORTATION_CHECKLIST_ITEM, {
      onCompleted: () => {},
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating checklist item.");
      },
      refetchQueries: [
        "getSingleTransportation",
        "getAllHistoryOfTransportation",
      ],
    });

  const onFinish = (values: any) => {
    const { currentMeterReading, workingHour } = values;

    if (!currentMeterReading) {
      message.error("Please enter the Current Meter Reading.");
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

    toggleTransportationChecklistItem({
      variables: {
        id: checkboxState,
        currentMeterReading,
        workingHour,
        uncheckId: uncheckboxState,
      },
    });
    setCheckboxState([]);
    setUncheckboxState([]);
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
                    message: "Please enter the current meter reading.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Current running hrs"
                  style={{ width: "100%" }}
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
                />
              </Form.Item>
            </div>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={toggling}
                className={classes["custom-btn-primary"]}
              >
                Done
              </Button>
            </Form.Item>
          </div>
        </Form>
        {self.assignedPermission.hasMachineChecklistAdd ? (
          <AddTransportationChecklist
            transportationID={transportationData?.id}
          />
        ) : null}
      </div>
      <div className={classes["content"]}>
        <div className={classes["content-wrapper-one"]}>
          <div className={classes["content-title"]}>Daily</div>
          {transportationData?.checklistItems.map((item) =>
            item.type === "Daily" ? (
              <div className={classes["checkbox-container"]}>
                {self.assignedPermission.hasTransportationChecklistEdit ? (
                  <Checkbox
                    defaultChecked={item.completedAt !== null}
                    onChange={(e) => onClickCheckbox(e, item.id)}
                    className={classes["checkbox"]}
                  >
                    {item.description}{" "}
                    {item.completedAt && (
                      <span
                        className={classes["completedAt"]}
                        title={moment(item.completedAt).format(
                          DATETIME_FORMATS.FULL
                        )}
                      >
                        {moment(item.completedAt).format(
                          DATETIME_FORMATS.SHORT
                        )}
                      </span>
                    )}
                  </Checkbox>
                ) : (
                  <div>
                    {item.description}{" "}
                    {item.completedAt && (
                      <span
                        className={classes["completedAt"]}
                        title={moment(item.completedAt).format(
                          DATETIME_FORMATS.FULL
                        )}
                      >
                        {moment(item.completedAt).format(
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
                        .hasTransportationChecklistDelete ? (
                        <CloseCircleOutlined
                          className={classes["delete"]}
                          onClick={() => {
                            deleteTransportationChecklistItem({
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
            ) : null
          )}
        </div>
        <div className={classes["content-wrapper-two"]}>
          <div className={classes["content-title"]}>Weekly</div>
          {transportationData?.checklistItems.map((item) =>
            item.type === "Weekly" ? (
              <div className={classes["checkbox-container"]}>
                {self.assignedPermission.hasTransportationChecklistEdit ? (
                  <Checkbox
                    defaultChecked={item.completedAt !== null}
                    onChange={(e) => onClickCheckbox(e, item.id)}
                    className={classes["checkbox"]}
                  >
                    {item.description}{" "}
                    {item.completedAt && (
                      <span
                        className={classes["completedAt"]}
                        title={moment(item.completedAt).format(
                          DATETIME_FORMATS.FULL
                        )}
                      >
                        {moment(item.completedAt).format(
                          DATETIME_FORMATS.SHORT
                        )}
                      </span>
                    )}
                  </Checkbox>
                ) : (
                  <div>
                    {item.description}{" "}
                    {item.completedAt && (
                      <span
                        className={classes["completedAt"]}
                        title={moment(item.completedAt).format(
                          DATETIME_FORMATS.FULL
                        )}
                      >
                        {moment(item.completedAt).format(
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
                        .hasTransportationChecklistDelete ? (
                        <CloseCircleOutlined
                          className={classes["delete"]}
                          onClick={() => {
                            deleteTransportationChecklistItem({
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
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewChecklist;
