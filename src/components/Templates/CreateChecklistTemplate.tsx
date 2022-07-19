import React from "react";
import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { CREATE_CHECKLIST_TEMPLATE } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import { FaMinusCircle, FaPlus } from "react-icons/fa";

export interface CreateChecklistTemplateProps {}

export const CreateChecklistTemplate: React.FC<
  CreateChecklistTemplateProps
> = () => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [create, { loading: loadingRole }] = useMutation(
    CREATE_CHECKLIST_TEMPLATE,
    {
      onCompleted: () => {
        message.success("Successfully created checklist template.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while creating checklist template."
        );
      },
      refetchQueries: ["checklistTemplates"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name, type, items } = values;

    create({
      variables: {
        input: {
          name,
          type,
          items,
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
        loading={loadingRole}
        className="primaryButton"
      >
        Add Template
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Add Checklist Template"
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
            label="Type"
            name="type"
            required={false}
            rules={[
              {
                required: true,
                message: "Please select a type.",
              },
            ]}
          >
            <Select
              className="notRounded"
              showArrow
              placeholder="Select type"
              allowClear={true}
            >
              {["Daily", "Weekly"].map((type: string) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.List
            name="items"
            rules={[
              {
                validator: async (_, items) => {
                  if (!items || items.length < 1) {
                    return Promise.reject(
                      new Error("At least 1 item required")
                    );
                  }
                },
              },
            ]}
            initialValue={[""]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    label={index === 0 ? "Items" : undefined}
                    required={false}
                    key={field.key}
                    style={{ marginBottom: ".5rem" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message:
                              "Please enter an item or delete this field.",
                          },
                        ]}
                        noStyle
                      >
                        <Input placeholder="Checklist item" />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <Tooltip title="Remove item" placement="bottom">
                          <FaMinusCircle
                            onClick={() => remove(field.name)}
                            style={{ marginLeft: ".5rem" }}
                          />
                        </Tooltip>
                      ) : null}
                    </div>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={
                      <FaPlus
                        style={{ paddingTop: 3, marginRight: ".25rem" }}
                      />
                    }
                  >
                    Add Item
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
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
                  loading={loadingRole}
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
