import { EditOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_ENTITY_ATTACHMENT } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import EntityAttachment from "../../../models/Entity/EntityAttachment";

import classes from "./EditEntityAttachment.module.css";

const EditEntityAttachment = ({ attachment }: { attachment: EntityAttachment }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editEntityAttachment, { loading: loadingAttachment }] = useMutation(
    EDIT_ENTITY_ATTACHMENT,
    {
      onCompleted: () => {
        message.success("Successfully updated attachment.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating attachment.");
      },
      refetchQueries: ["entityAttachments", "getAllHistoryOfEntity"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { description } = values;

    if (!description) {
      message.error("Please enter the description.");
      return;
    }

    editEntityAttachment({
      variables: {
        id: attachment.id,
        description,
      },
    });
  };
  return (
    <>
      <div>
        <Tooltip title="Edit">
          <EditOutlined className={classes["info-edit"]} onClick={() => setVisible(true)} />
        </Tooltip>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          title={"Edit Attachment"}
          width="90vw"
          style={{ maxWidth: 700 }}
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
              label="Description"
              name="description"
              required={false}
              initialValue={attachment?.description}
              rules={[
                {
                  required: true,
                  message: "Please enter the description.",
                },
              ]}
            >
              <Input placeholder="Description" />
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
                    loading={loadingAttachment}
                    className={classes["custom-btn-primary"]}
                  >
                    Edit
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default EditEntityAttachment;
