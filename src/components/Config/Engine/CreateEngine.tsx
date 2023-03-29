import React from "react";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { CREATE_ENGINE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";

export interface CreateEngineProps {}

export const CreateEngine: React.FC<CreateEngineProps> = () => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [create, { loading }] = useMutation(CREATE_ENGINE, {
    onCompleted: () => {
      message.success("Successfully created engine.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while creating engine.");
    },
    refetchQueries: ["engines"],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name, model, serial } = values;
    create({
      variables: {
        input: {
          name,
          model,
          serial,
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
        Add Engine
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Add Engine"
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
            label="Model"
            name="model"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter a model.",
              },
            ]}
          >
            <Input placeholder="Model" />
          </Form.Item>
          <Form.Item
            label="Serial"
            name="serial"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter a serial.",
              },
            ]}
          >
            <Input placeholder="Serial" />
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
