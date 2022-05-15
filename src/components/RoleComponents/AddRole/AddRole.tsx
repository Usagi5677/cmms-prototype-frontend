import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { ADD_ROLE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./AddRole.module.css";

const AddRole = () => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [addRole, { loading: loadingRole }] = useMutation(
    ADD_ROLE,
    {
      onCompleted: () => {
        message.success("Successfully created role.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating role.");
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
      message.error("Please enter the title.");
      return;
    }
    
    addRole({
      variables: {
        name,
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
        className={classes["custom-btn-primary"]}
      >
        Add Role
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Add Repair"}
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
            label="Name"
            name="name"
            required={false}
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

export default AddRole;
