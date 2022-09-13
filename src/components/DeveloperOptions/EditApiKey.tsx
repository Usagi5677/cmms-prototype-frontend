import React, { useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
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
import { errorMessage } from "../../helpers/gql";
import { EDIT_KEY } from "../../api/mutations";
import { GET_ALL_PERMISSIONS } from "../../api/queries";
import Permission from "../../models/Permission";
import ApiKey from "../../models/ApiKey";
import { FaEdit } from "react-icons/fa";

export interface EditApiKeyProps {
  apiKey: ApiKey;
}

export const EditApiKey: React.FC<EditApiKeyProps> = ({ apiKey }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [
    getAllPermissions,
    { data: allPermissions, loading: loadingAllPermissions },
  ] = useLazyQuery(GET_ALL_PERMISSIONS, {
    onError: (err) => {
      errorMessage(err, "Error loading all permissions.");
    },
  });

  const [edit, { loading }] = useMutation(EDIT_KEY, {
    onCompleted: () => {
      message.success("Successfully updated API key.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating API key.");
    },
    refetchQueries: ["apiKeys"],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name, permissions } = values;
    edit({
      variables: {
        input: {
          keyId: apiKey.id,
          name,
          permissions,
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
      <Tooltip title="Edit" placement="top">
        <FaEdit
          className="editButton"
          onClick={() => setVisible(true)}
          style={{ marginRight: ".5rem" }}
        />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Edit API Key"
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
          initialValues={{
            name: apiKey.name,
            permissions: apiKey.permissions.map((p) => p.permission),
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
