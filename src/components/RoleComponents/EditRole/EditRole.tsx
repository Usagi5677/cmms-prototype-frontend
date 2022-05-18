import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_ROLE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import Role from "../../../models/Role";
import classes from "./EditRole.module.css";

const EditRole = ({ role }: { role: Role }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editRole, { loading: loadingRole }] = useMutation(
    EDIT_ROLE,
    {
      onCompleted: () => {
        message.success("Successfully updated role.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating role.");
      },
      refetchQueries: ["getAllRoles"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name } = values;

    if (!name) {
      message.error("Please enter the name.");
      return;
    }

    editRole({
      variables: {
        id: role.id,
        name,
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
          title={"Edit Role"}
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
              label="Name"
              name="name"
              required={false}
              initialValue={role?.name}
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
                    loading={loadingRole}
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

export default EditRole;
