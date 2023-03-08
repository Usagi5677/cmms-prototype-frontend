import React from "react";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { EDIT_DIVISION } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { FaRegEdit } from "react-icons/fa";
import Division from "../../../models/Division";

export interface EditDivisionProps {
  division: Division;
}

export const EditDivision: React.FC<EditDivisionProps> = ({ division }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [create, { loading }] = useMutation(EDIT_DIVISION, {
    onCompleted: () => {
      message.success("Successfully updated division.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating division.");
    },
    refetchQueries: ["divisions"],
  });

  const handleCancel = () => {
    //form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name } = values;
    create({
      variables: {
        input: {
          id: division.id,
          name,
        },
      },
    });
  };

  return (
    <>
      <Tooltip title="Edit" placement="top">
        <FaRegEdit
          className="editButton"
          onClick={() => setVisible(true)}
          style={{ marginRight: ".5rem" }}
          // size="20px"
        />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Edit Division"
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
          initialValues={{ name: division.name }}
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
