import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Upload } from "antd";
import { useForm } from "antd/lib/form/Form";
import { RcFile } from "antd/lib/upload";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ADD_MACHINE_BREAKDOWN } from "../../../api/mutations";
import { GET_ALL_ATTACHMENT_OF_MACHINE } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import PaginationArgs from "../../../models/PaginationArgs";
import classes from "./AddMachineAttachment.module.css";

const AddMachineBreakdown = ({ machineID }: { machineID: number }) => {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const { refetch } = useQuery(GET_ALL_ATTACHMENT_OF_MACHINE, {
    variables: {
      first: 6,
      last: null,
      before: null,
      after: null,
      search: "",
      machineId: machineID,
    },
  });

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
    data.append("machineId", `${machineID}`);
    data.append("description", description.trim());
    data.append("attachment", attachment.file);
    const token = localStorage.getItem("cmms_token");
    const url = `${
      process.env.REACT_APP_API_URL?.split("graphql")[0]
    }attachment/upload`;
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
      });

    handleCancel();
    //timeout since it was showing error when refetching
    setTimeout(() => {
      refetch({
        first: 6,
        last: null,
        before: null,
        after: null,
        search: "",
        machineId: machineID,
      });
    }, 1000);
  };
  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        loading={uploading}
        className={classes["custom-btn-primary"]}
      >
        Add Attachment
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Add Attachment"}
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
            label="Attachment"
            name="attachment"
            required={false}
            rules={[
              {
                required: true,
                message: "Please select an attachment.",
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

export default AddMachineBreakdown;
