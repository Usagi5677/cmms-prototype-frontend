import React from "react";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { EDIT_TYPE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { FaEdit } from "react-icons/fa";
import Type from "../../../models/Type";

export interface EditTypeProps {
  type: Type;
}

export const EditType: React.FC<EditTypeProps> = ({ type }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [create, { loading }] = useMutation(EDIT_TYPE, {
    onCompleted: () => {
      message.success("Successfully updated type.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating type.");
    },
    refetchQueries: ["types"],
  });

  const handleCancel = () => {
    //form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name, entityType } = values;
    create({
      variables: {
        input: {
          id: type.id,
          name,
          entityType,
        },
      },
    });
  };

  return (
    <>
      <Tooltip title="Edit" placement="top">
        <FaEdit
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
        title="Edit Type"
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
          initialValues={{ name: type.name, entityType: type.entityType }}
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
          {/* <Form.Item
            label="Entity Type"
            name="entityType"
            required={false}
            rules={[
              {
                required: true,
                message: "Please select a type of entity",
              },
            ]}
          >
            <Select
              className="notRounded"
              showArrow
              placeholder="Select type"
              allowClear={true}
            >
              {ENTITY_TYPES.map((type: string) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
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
