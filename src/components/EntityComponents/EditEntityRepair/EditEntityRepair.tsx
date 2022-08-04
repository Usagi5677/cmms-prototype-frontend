import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_ENTITY_REPAIR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import EntityRepair from "../../../models/Entity/EntityRepair";

import classes from "./EditEntityRepair.module.css";

const EditEntityRepair = ({ repair }: { repair: EntityRepair }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editEntityRepair, { loading: loadingRepair }] = useMutation(
    EDIT_ENTITY_REPAIR,
    {
      onCompleted: () => {
        message.success("Successfully updated repair.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating repair.");
      },
      refetchQueries: ["getAllRepairOfEntity", "getAllHistoryOfEntity"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { title, description } = values;

    if (!title) {
      message.error("Please enter the title.");
      return;
    }
    if (!description) {
      message.error("Please enter the description.");
      return;
    }

    editEntityRepair({
      variables: {
        id: repair.id,
        title,
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
          title={"Edit Repair"}
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
              label="Title"
              name="title"
              required={false}
              initialValue={repair?.title}
              rules={[
                {
                  required: true,
                  message: "Please enter the title.",
                },
              ]}
            >
              <Input placeholder="Title" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              required={false}
              initialValue={repair?.description}
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
                    loading={loadingRepair}
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

export default EditEntityRepair;
