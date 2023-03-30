import React from "react";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { EDIT_HULL_TYPE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { FaRegEdit } from "react-icons/fa";
import HullType from "../../../models/HullType";

export interface EditHullTypeProps {
  hullType: HullType;
}

export const EditHullType: React.FC<EditHullTypeProps> = ({ hullType }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [update, { loading }] = useMutation(EDIT_HULL_TYPE, {
    onCompleted: () => {
      message.success("Successfully updated hull type.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating hull type.");
    },
    refetchQueries: ["hullTypes"],
  });

  const handleCancel = () => {
    //form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name } = values;
    update({
      variables: {
        input: {
          id: hullType.id,
          name,
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
        title="Edit Hull Type"
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
          initialValues={{ name: hullType.name}}
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
