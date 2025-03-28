import React from "react";
import { useMutation } from "@apollo/client";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { errorMessage } from "../../../helpers/gql";
import { CREATE_LOCATION } from "../../../api/mutations";
import { ZoneSelector } from "../Zone/ZoneSelector";

export interface CreateLocationProps {}

export const CreateLocation: React.FC<CreateLocationProps> = () => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [zoneId, setZoneId] = useState<null | number>(null);

  const [create, { loading }] = useMutation(CREATE_LOCATION, {
    onCompleted: () => {
      message.success("Successfully created location.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while creating location.");
    },
    refetchQueries: ["locations"],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name, skipFriday } = values;
    create({
      variables: {
        input: {
          name,
          zoneId,
          skipFriday,
        },
      },
    });
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
        Add Location
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Add Location"
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
          <Form.Item label="Zone" required={false}>
            <ZoneSelector setZoneId={setZoneId} />
          </Form.Item>
          <Form.Item name="skipFriday" required={false} valuePropName="checked">
            <Checkbox>Skip Friday</Checkbox>
          </Form.Item>
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
