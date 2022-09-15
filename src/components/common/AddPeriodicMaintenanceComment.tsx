import { MessageOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { ADD_PERIODIC_MAINTENANCE_COMMENT } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import PeriodicMaintenance from "../../models/PeriodicMaintenance/PeriodicMaintenance";
import PeriodicMaintenanceTask from "../../models/PeriodicMaintenance/PeriodicMaintenanceTask";

export interface AddPeriodicMaintenanceCommentProps {
  periodicMaintenance: PeriodicMaintenance;
  task: PeriodicMaintenanceTask;
  type: string;
  isDeleted?: boolean;
  isOlder?: boolean;
  isCopy?: boolean;
}

export const AddPeriodicMaintenanceComment: React.FC<
  AddPeriodicMaintenanceCommentProps
> = ({ periodicMaintenance, task, type, isDeleted, isOlder, isCopy }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [create, { loading }] = useMutation(ADD_PERIODIC_MAINTENANCE_COMMENT, {
    onCompleted: () => {
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while adding issue.");
    },
    refetchQueries: ["periodicMaintenances", "periodicMaintenanceSummary"],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { description } = values;
    create({
      variables: {
        periodicMaintenanceId: periodicMaintenance.id,
        taskId: task.id,
        type,
        description,
      },
    });
  };
  return (
    <div>
      <Tooltip title={`Add ${type}`}>
        <div
          style={{ marginLeft: ".5rem", marginRight: ".5rem" }}
          onClick={() => setVisible(true)}
        >
          <MessageOutlined disabled={isDeleted || isOlder || isCopy} />
        </div>
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Add ${type} to ${
          type === "Remark" ? "Task" : "Periodic Maintenance"
        }: ${task.name}`}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
        >
          <Form.Item
            label={type}
            name="description"
            required={false}
            rules={[
              {
                required: true,
                message: `Please enter the ${type}.`,
              },
            ]}
          >
            <Input placeholder={`Enter ${type}`} />
          </Form.Item>
          <Row justify="end" gutter={16}>
            <Col>
              <Button
                type="ghost"
                onClick={handleCancel}
                className="secondaryButton"
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="primaryButton"
                  disabled={isDeleted || isOlder || !isCopy}
                >
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
