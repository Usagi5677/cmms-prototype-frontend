import React from "react";
import { useMutation } from "@apollo/client";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { CREATE_PERIODIC_MAINTENANCE } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

export interface CreatePeriodicMaintenanceProps {}

export const CreatePeriodicMaintenance: React.FC<
  CreatePeriodicMaintenanceProps
> = () => {
  const [visible, setVisible] = useState(false);
  const [checkbox, setCheckbox] = useState(true);
  const [form] = useForm();

  const [createPeriodicMaintenance, { loading }] = useMutation(
    CREATE_PERIODIC_MAINTENANCE,
    {
      onCompleted: () => {
        message.success("Successfully created periodic maintenance template.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while creating periodic maintenance template."
        );
      },
      refetchQueries: ["periodicMaintenances"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name, measurement, value } = values;

    createPeriodicMaintenance({
      variables: {
        name,
        measurement,
        value,
        recur: checkbox,
      },
    });
  };

  const onchange = (e: CheckboxChangeEvent) => {
    setCheckbox(e.target.checked);
  };
  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        loading={loading}
        className="primaryButton"
      >
        Add Template
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Add Periodic Maintenance Template"
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
                message: "Please enter a name.",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Measurement"
            name="measurement"
            required={false}
            rules={[
              {
                required: true,
                message: "Please select the measurement.",
              },
            ]}
          >
            <Select
              className="notRounded"
              showArrow
              placeholder="Select measurement"
              allowClear={true}
            >
              {["Hour", "Kilometer", "Day", "Week", "Month"].map(
                (measurement: string) => (
                  <Select.Option key={measurement} value={measurement}>
                    {measurement}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="recur"
            required={false}
            initialValue={checkbox}
            valuePropName="checked"
          >
            <Checkbox onChange={(e) => onchange(e)}>Recur</Checkbox>
          </Form.Item>
          {checkbox && (
            <Form.Item
              label={
                <>
                  Value
                  <span style={{ paddingLeft: 10, opacity: 0.5 }}>
                    For example, value = 3 will be every hour 3 / km 3
                  </span>
                </>
              }
              name="value"
              required={false}
              rules={[
                {
                  required: true,
                  message: "Please enter the value.",
                },
              ]}
            >
              <InputNumber placeholder="Value" style={{ width: "100%" }} min={0} />
            </Form.Item>
          )}

          <Row justify="end" gutter={16}>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="ghost"
                  onClick={handleCancel}
                  className="secondaryButton"
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
                  loading={loading}
                  className="primaryButton"
                >
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
