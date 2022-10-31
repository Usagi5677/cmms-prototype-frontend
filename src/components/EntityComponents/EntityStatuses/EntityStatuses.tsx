import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaMinusCircle, FaPlus } from "react-icons/fa";
import { CREATE_BREAKDOWN, SET_ENTITY_STATUS } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { EntityStatus } from "../../../models/Enums";
import EntityStatusTag from "../../common/EntityStatusTag";
import classes from "./EntityStatuses.module.css";

const EntityStatuses = ({
  entityID,
  entityStatus,
  isDeleted,
  hasPermission,
}: {
  entityID: number;
  entityStatus: EntityStatus;
  isDeleted?: boolean | undefined;
  hasPermission?: boolean;
}) => {
  const [initStatus, setInitStatus] = useState("");
  const [setEntityStatus, { loading: settingStatus }] = useMutation(
    SET_ENTITY_STATUS,
    {
      onCompleted: () => {
        message.success("Successfully updated entity status.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error occured.");
      },
      refetchQueries: [
        "getSingleEntity",
        "getAllBreakdownOfEntity",
        "getAllHistoryOfEntity",
        "allEntityBreakdownCount",
      ],
    }
  );

  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [createBreakdown, { loading: loadingBreakdown }] = useMutation(
    CREATE_BREAKDOWN,
    {
      onCompleted: () => {
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating breakdown.");
      },
      refetchQueries: [
        "breakdowns",
        "getSingleEntity",
        "getAllHistoryOfEntity",
        "allEntityBreakdownCount",
      ],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    setInitStatus("");
  };

  const onFinish = async (values: any) => {
    const { type, details } = values;

    if (!type) {
      message.error("Please select the type.");
      return;
    }

    createBreakdown({
      variables: {
        createBreakdownInput: {
          entityId: entityID,
          type,
          details,
        },
      },
    });
    setEntityStatus({
      variables: { entityId: entityID, status: type },
    });
  };

  const onChangeClick = async (status: EntityStatus) => {
    if (status === "Breakdown") {
      setInitStatus("Breakdown");
      setVisible(true);
    } else if (status === "Critical") {
      setInitStatus("Critical");
      setVisible(true);
    } else {
      setEntityStatus({
        variables: { entityId: entityID, status },
      });
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width="90vw"
        title={"Add Breakdown"}
        style={{ maxWidth: 700 }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
          preserve={false}
        >
          <Form.Item
            label="Type"
            name="type"
            required={false}
            rules={[
              {
                required: true,
                message: "Please select the type.",
              },
            ]}
            initialValue={initStatus}
          >
            <Select
              style={{ width: "100%" }}
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder={"Type"}
              className={"notRounded"}
            >
              {["Breakdown", "Critical"].map((type: string) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.List
            name="details"
            rules={[
              {
                validator: async (_, items) => {
                  if (!items || items.length < 1) {
                    return Promise.reject(
                      new Error("At least 1 detail required")
                    );
                  }
                },
              },
            ]}
            initialValue={[""]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    label={index === 0 ? "Details" : undefined}
                    required={false}
                    key={field.key}
                    style={{ marginBottom: ".5rem" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message:
                              "Please enter a detail or delete this field.",
                          },
                        ]}
                        noStyle
                      >
                        <Input placeholder="Detail" />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <Tooltip title="Remove detail" placement="bottom">
                          <FaMinusCircle
                            onClick={() => remove(field.name)}
                            style={{ marginLeft: ".5rem" }}
                          />
                        </Tooltip>
                      ) : null}
                    </div>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={
                      <FaPlus
                        style={{ paddingTop: 3, marginRight: ".25rem" }}
                      />
                    }
                  >
                    Add Detail
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
          <Row justify="end" gutter={16}>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="ghost"
                  onClick={handleCancel}
                  className={classes["custom-btn-secondary"]}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loadingBreakdown}
                  className={classes["custom-btn-primary"]}
                  disabled={isDeleted || hasPermission}
                >
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Select
        showArrow
        loading={settingStatus}
        style={{ width: "100%" }}
        placeholder="Select status"
        value={entityStatus}
        onChange={(status) => onChangeClick(status)}
        disabled={isDeleted || hasPermission}
        getPopupContainer={(trigger) => trigger.parentNode}
      >
        {(Object.keys(EntityStatus) as Array<keyof typeof EntityStatus>).map(
          (status: any) => (
            <Select.Option key={status} value={status}>
              <EntityStatusTag status={status} />
            </Select.Option>
          )
        )}
      </Select>
    </>
  );
};

export default EntityStatuses;
