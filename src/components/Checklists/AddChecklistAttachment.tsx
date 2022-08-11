import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import Upload, { RcFile } from "antd/lib/upload";
import axios from "axios";
import React, { useState } from "react";
import Checklist from "../../models/Checklist";
import { Entity } from "../../models/Entity/Entity";

export interface AddChecklistAttachmentProps {
  entity: Entity;
  checklist: Checklist;
  refetchChecklist: any;
}

export const AddChecklistAttachment: React.FC<AddChecklistAttachmentProps> = ({
  entity,
  checklist,
  refetchChecklist,
}) => {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { description, attachment } = values;

    if (!description) {
      message.error("Please enter the description.");
      return;
    }
    if (!attachment) {
      message.error("Please select an attachment.");
      return;
    }
    // Whenever file is selected, upload

    if (attachment.file.status === "removed") return;
    // Max allowed file size in bytes.
    const maxFileSize = 2 * 1000000;
    if (attachment.file.size > maxFileSize) {
      message.error("File size cannot be greater than 2 MB.");
      return;
    }
    setUploading(true);
    // Send request as form data as files cannot be sent through graphql
    const data: any = new FormData();
    data.append("entityId", `${entity.id}`);
    data.append("checklistId", `${checklist.id}`);
    data.append("description", description.trim());
    data.append("attachment", attachment.file);
    const token = localStorage.getItem("cmms_token");
    const url = `${
      process.env.REACT_APP_API_URL?.split("graphql")[0]
    }attachment/entity-upload`;
    axios({
      method: "post",
      url,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(function () {
        setValue("");
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      })
      .finally(function () {
        setUploading(false);
        refetchChecklist();
        handleCancel();
      });
  };
  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        loading={uploading}
        className="secondaryButton"
      >
        Upload Image
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Upload Image"}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
        >
          <Form.Item
            label="Description"
            name="description"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the description.",
              },
            ]}
          >
            <Input placeholder="Description" />
          </Form.Item>

          <Form.Item
            label="Image"
            name="attachment"
            required={false}
            rules={[
              {
                required: true,
                message: "Please select an image.",
              },
            ]}
          >
            <Upload
              onRemove={() => {
                setFileList([]);
              }}
              beforeUpload={(file) => {
                setFileList([file]);
                return false;
              }}
              fileList={fileList}
              listType={"picture"}
              accept="image/*"
              style={{ width: "100% !important" }}
            >
              <Button
                icon={<UploadOutlined />}
                shape="round"
                style={{ width: "100% !important" }}
                loading={uploading}
              />
            </Upload>
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
                  loading={uploading}
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
