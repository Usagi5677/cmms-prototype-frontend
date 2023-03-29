import React from "react";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { EDIT_ENGINE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { FaRegEdit } from "react-icons/fa";
import Engine from "../../../models/Engine";

export interface EditEngineProps {
  engine: Engine;
}

export const EditEngine: React.FC<EditEngineProps> = ({ engine }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [update, { loading }] = useMutation(EDIT_ENGINE, {
    onCompleted: () => {
      message.success("Successfully updated engine.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating engine.");
    },
    refetchQueries: ["engines"],
  });

  const handleCancel = () => {
    //form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name, serial, model } = values;
    update({
      variables: {
        input: {
          id: engine?.id,
          name,
          model,
          serial,
        },
      },
    });
  };

  return (
    <>
      <FaRegEdit
          className="editButton"
          onClick={() => setVisible(true)}
          style={{ marginRight: ".5rem" }}
          // size="20px"
        />
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Edit Engine"
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
          initialValues={{
            name: engine?.name,
            model: engine?.model,
            serial: engine?.serial,
          }}
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
                  Update
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
