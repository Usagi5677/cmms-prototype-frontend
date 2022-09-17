import { useMutation } from "@apollo/client";
import { Button, Col, Form, InputNumber, Modal, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { UPDATE_DAILY_USAGE } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import Checklist from "../../models/Checklist";
import { Entity } from "../../models/Entity/Entity";

export interface AddDailyUsageProps {
  entity: Entity;
  checklist: Checklist;
}

export const AddDailyUsage: React.FC<AddDailyUsageProps> = ({
  entity,
  checklist,
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [updateDailyUsage, { loading: updatingDailyUsage }] = useMutation(
    UPDATE_DAILY_USAGE,
    {
      onCompleted: () => {
        handleCancel();
      },
      onError: (err) => {
        errorMessage(err, "Error adding daily usage.");
      },
      refetchQueries: ["checklist", "getSingleEntity", "checklistSummary"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { dailyUsage } = values;
    updateDailyUsage({
      variables: {
        id: checklist.id,
        hours: dailyUsage,
      },
    });
  };

  return (
    <div>
      <Button className="primaryButton" onClick={() => setVisible(true)}>
        Add Daily Usage
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Add Daily Usage`}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
        >
          <Form.Item label="Daily Usage" name="dailyUsage" required={false}>
            <InputNumber
              addonAfter={`hr`}
              placeholder={`Enter hr`}
              style={{ width: "100%", marginBottom: ".5rem" }}
              max={24}
            />
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
                  loading={updatingDailyUsage}
                  className="primaryButton"
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
