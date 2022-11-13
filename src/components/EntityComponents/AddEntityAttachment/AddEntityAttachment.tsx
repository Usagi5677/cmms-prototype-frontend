import { InboxOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Upload } from "antd";
import { useForm } from "antd/lib/form/Form";
import { RcFile } from "antd/lib/upload";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router";
import {
  GET_ALL_ATTACHMENT_OF_ENTITY,
  GET_ALL_HISTORY_OF_ENTITY,
} from "../../../api/queries";
import { MAX_FILE_SIZE } from "../../../helpers/constants";
import classes from "./AddEntityAttachment.module.css";

const AddEntityAttachment = () => {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const { id }: any = useParams();
  const { refetch } = useQuery(GET_ALL_ATTACHMENT_OF_ENTITY, {
    variables: {
      first: 20,
      last: null,
      before: null,
      after: null,
      search: "",
      entityId: parseInt(id),
    },
  });

  const { refetch: refetchHistory } = useQuery(GET_ALL_HISTORY_OF_ENTITY, {
    variables: {
      first: 20,
      last: null,
      before: null,
      after: null,
      search: "",
      entityId: parseInt(id),
    },
  });

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { description } = values;
    if (!description) {
      message.error("Please enter the description.");
      return;
    }
    if (!fileList) {
      message.error("Please select an image.");
      return;
    }
    for (const f of fileList) {
      if (!f.type.includes("image")) {
        message.error("Please select an image file.");
        return;
      }
      // Max allowed file size in bytes.
      if (f.size > MAX_FILE_SIZE) {
        message.error("File size cannot be greater than 10 MB.");
        return;
      }
    }
    setUploading(true);
    // Send request as form data as files cannot be sent through graphql
    const data: any = new FormData();
    data.append("entityId", `${parseInt(id)}`);
    data.append("description", description.trim());
    for (const f of fileList) {
      data.append("attachments", f);
    }
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
        //timeout since it was showing error when refetching
        setTimeout(function () {
          refetch({
            first: 20,
            last: null,
            before: null,
            after: null,
            search: "",
            entityId: parseInt(id),
          });
          refetchHistory({
            first: 20,
            last: null,
            before: null,
            after: null,
            search: "",
            entityId: parseInt(id),
          });
        }, 1000);
      });

    handleCancel();
  };
  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        type="primary"
        onClick={() => setVisible(true)}
        loading={uploading}
        className={classes["custom-btn-primary"]}
      >
        Upload Image
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Upload Image"}
        width="90vw"
        style={{ maxWidth: 700 }}
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
            name="attachments"
            rules={[
              {
                required: true,
                message: "Please select an image.",
              },
            ]}
          >
            <Upload.Dragger
              name="attachments"
              fileList={fileList}
              onRemove={(file) => {
                setFileList(fileList.filter((f) => f.uid !== file.uid));
              }}
              beforeUpload={(file) => {
                fileList.push(file);
                return false;
              }}
              multiple={true}
              listType={"picture"}
              accept="image/*"
              style={{ width: "100% !important" }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload.
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Row justify="end" gutter={16} style={{ marginTop: 20 }}>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="ghost"
                  onClick={handleCancel}
                  className={classes["custom-btn-secondary"]}
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
                  className={classes["custom-btn-primary"]}
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

export default AddEntityAttachment;
