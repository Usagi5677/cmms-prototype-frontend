import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import {
  ADD_ENTITY_BREAKDOWN,
  SET_ENTITY_STATUS,
} from "../../../api/mutations";
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
  const [addEntityBreakdown, { loading: loadingBreakdown }] = useMutation(
    ADD_ENTITY_BREAKDOWN,
    {
      onCompleted: () => {
        message.success("Successfully created breakdown.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating breakdown.");
      },
      refetchQueries: [
        "getAllBreakdownOfEntity",
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
    const { title, description } = values;

    if (!title) {
      message.error("Please enter the title.");
      return;
    }
    if (!description) {
      message.error("Please enter the description.");
      return;
    }

    addEntityBreakdown({
      variables: {
        entityId: entityID,
        title,
        description,
      },
    });
  };
  const onChangeClick = async (status: EntityStatus) => {
    if (status === "Breakdown") {
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
            label="Title"
            name="title"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the title.",
              },
            ]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the description.",
              },
            ]}
          >
            <Input placeholder="Description" />
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
        {(
          Object.keys(EntityStatus) as Array<
            keyof typeof EntityStatus
          >
        ).map((status: any) => (
          <Select.Option key={status} value={status}>
            <EntityStatusTag status={status} />
          </Select.Option>
        ))}
      </Select>
    </>
  );
};

export default EntityStatuses;
