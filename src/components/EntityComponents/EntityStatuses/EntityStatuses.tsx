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
}: {
  entityID: number;
  entityStatus: EntityStatus;
  isDeleted?: boolean | undefined;
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
  };

  const onFinish = async (values: any) => {
    const { name, type } = values;

    if (!name) {
      message.error("Please enter the name.");
      return;
    }
    if (!type) {
      message.error("Please select the type.");
      return;
    }

    createBreakdown({
      variables: {
        createBreakdownInput: {
          entityId: entityID,
          name,
          type,
        },
      },
    });
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
            <Input placeholder="Title" />
          </Form.Item>
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
        disabled={isDeleted}
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
