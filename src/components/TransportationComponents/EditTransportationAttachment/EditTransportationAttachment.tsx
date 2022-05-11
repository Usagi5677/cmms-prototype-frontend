import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_TRANSPORTATION_ATTACHMENT } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import TransportationAttachment from "../../../models/Transportation/TransportationAttachment";
import classes from "./EditTransportationAttachment.module.css";

const EditTransportationAttachment = ({ attachment }: { attachment: TransportationAttachment }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editTransportationAttachment, { loading: loadingAttachment }] = useMutation(
    EDIT_TRANSPORTATION_ATTACHMENT,
    {
      onCompleted: () => {
        message.success("Successfully updated attachment.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating attachment.");
      },
      refetchQueries: ["transportationAttachments", "getAllHistoryOfTransportation"],
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

    editTransportationAttachment({
      variables: {
        id: attachment.id,
        description,
      },
    });
  };
  return (
    <>
      <div className={classes["info-edit"]}>
        <Tooltip title="Edit">
          <FaEdit onClick={() => setVisible(true)} />
        </Tooltip>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          title={"Edit Attachment"}
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

export default EditTransportationAttachment;
