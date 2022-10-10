import React from "react";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { errorMessage } from "../../../helpers/gql";
import { CREATE_DIVISION } from "../../../api/mutations";

export interface CreateDivisionProps {}

export const CreateDivision: React.FC<CreateDivisionProps> = () => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [create, { loading }] = useMutation(CREATE_DIVISION, {
    onCompleted: () => {
      message.success("Successfully created division.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while creating division.");
    },
    refetchQueries: ["divisions"],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name } = values;
    create({
      variables: {
        input: {
          name,
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
        Add Division
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Add Division"
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
