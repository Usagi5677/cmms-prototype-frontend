import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { EDIT_CHECKLIST_TEMPLATE } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";

export interface SaveAsTemplateProps {
  id: number;
}

export const SaveAsTemplate: React.FC<SaveAsTemplateProps> = ({ id }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editChecklistTemplate, { loading }] = useMutation(
    EDIT_CHECKLIST_TEMPLATE,
    {
      onCompleted: () => {
        message.success("Successfully saved as checklist template.");
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while saving as checklist template."
        );
      },
      refetchQueries: ["checklistTemplates", "entityChecklistTemplate"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name } = values;

    editChecklistTemplate({
      variables: {
        input: {
          id,
          name,
        },
      },
    });
  };
  return (
    <>
      <span style={{ opacity: 0.7 }}>
        <a
          style={{ textDecoration: "underline" }}
          onClick={() => setVisible(true)}
        >
          Save as template
        </a>{" "}
        to enable using this checklist in other machines.
      </span>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Save as Checklist Template`}
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
          preserve={false}
        >
          <Form.Item
            label="Name"
            name="name"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the name.",
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
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
