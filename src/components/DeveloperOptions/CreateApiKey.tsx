import React, { useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { errorMessage } from "../../helpers/gql";
import { CREATE_KEY } from "../../api/mutations";
import { GET_ALL_PERMISSIONS } from "../../api/queries";
import Permission from "../../models/Permission";
import { DATETIME_FORMATS } from "../../helpers/constants";

export interface CreateApiKeyProps {}

export const CreateApiKey: React.FC<CreateApiKeyProps> = ({}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [newKey, setNewKey] = useState("");

  const [
    getAllPermissions,
    { data: allPermissions, loading: loadingAllPermissions },
  ] = useLazyQuery(GET_ALL_PERMISSIONS, {
    onError: (err) => {
      errorMessage(err, "Error loading all permissions.");
    },
  });

  const [create, { loading }] = useMutation(CREATE_KEY, {
    onCompleted: (data) => {
      message.success("Successfully created API key.");
      setNewKey(data.createApiKey);
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while creating API key.");
    },
    refetchQueries: ["apiKeys"],
  });

  const handleCancel = () => {
    form.resetFields();
    setNewKey("");
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name, permissions, expiresAt } = values;
    create({
      variables: {
        input: {
          name,
          permissions,
          expiresAt,
        },
      },
    });
  };

  useEffect(() => {
    if (visible) {
      getAllPermissions();
    }
  }, [visible]);

  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        loading={loading}
        className="primaryButton"
      >
        Add API Key
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Add API Key"
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
            label="Permissions"
            name="permissions"
            required={false}
            rules={[
              {
                required: true,
                message: "Please select at least one permission.",
              },
            ]}
          >
            <Select
              mode="multiple"
              showArrow
              style={{ width: "100%" }}
              placeholder="Select permissions"
              loading={loadingAllPermissions}
              className="notRounded"
            >
              {allPermissions?.permissions.map((p: Permission) => (
                <Select.Option key={p.name} value={p.name}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Expiration (optional)"
            name="expiresAt"
            required={false}
          >
            <DatePicker
              style={{ width: "100%" }}
              format={DATETIME_FORMATS.DAY_MONTH_YEAR}
            />
          </Form.Item>
          {newKey && (
            <Alert
              style={{ marginBottom: "1rem" }}
              message={
                <div>
                  Your newly created API key:
                  <div>{newKey}</div>
                  <div>
                    Copy and save it as you will not be able to view it again.
                  </div>
                </div>
              }
            />
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
