import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
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
  const [detail, setDetail] = useState("");
  const [details, setDetails] = useState<string[]>([]);
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
    setDetail("");
    setDetails([]);
  };

  const onFinish = async (values: any) => {
    const { type } = values;

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

    setDetail("");
    setDetails([]);
  };
  const onChangeClick = async (status: EntityStatus) => {
    if (status === "Breakdown") {
      setVisible(true);
    } else if (status === "Critical") {
      setVisible(true);
    } else {
      setEntityStatus({
        variables: { entityId: entityID, status },
      });
    }
  };

  const submit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") setDetail("");
    else if (event.key === "Enter") {
      event.preventDefault();
      if (detail.trim() === "") return;
      setDetail("");
      setDetails([...details, detail]);
    }
  };
  const removeItem = (index: number) => {
    setDetails([
      ...details.slice(0, index),
      ...details.slice(index + 1, details.length),
    ]);
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
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
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

          <div style={{ marginBottom: 6 }}>Details</div>
          <div style={{ marginBottom: 20 }}>
            {details.map((d: string, index: number) => (
              <div key={index} className={classes["detail"]}>
                {d}
                <CloseCircleOutlined
                  style={{ color: "red" }}
                  onClick={() => {
                    removeItem(index);
                  }}
                />
              </div>
            ))}
          </div>

          <input
            type="text"
            placeholder={"Add detail"}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            onKeyDown={submit}
            style={{
              border: "solid 1px var(--border-2)",
              borderRadius: 5,
              padding: ".5rem",
              width: "100%",
              marginBottom: 20,
            }}
          />
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
