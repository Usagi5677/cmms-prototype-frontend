import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, Form, message, Modal, Row, Select, Tag } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";
import SearchAPSUser from "../../common/SearchAPS";
import { errorMessage } from "../../../helpers/gql";
import { ADD_APP_USER } from "../../../api/mutations";
import { GET_ROLES, ME_QUERY } from "../../../api/queries";
import Role from "../../../models/Role";
import { RoleTagStringToColor } from "../../../helpers/style";
import classes from "./AddUserRoles.module.css";

const AddUserRoles = () => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [addAppUser, { loading: loadingAddUserRoles }] = useMutation(
    ADD_APP_USER,
    {
      onCompleted: () => {
        message.success("Successfully added user roles.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while adding user roles.");
      },
      refetchQueries: ["getAllUsers", { query: ME_QUERY }],
    }
  );
  const [getRoles, { data: roleData, loading: loadingRole }] = useLazyQuery(
    GET_ROLES,
    {
      onError: (err) => {
        errorMessage(err, "Error loading roles.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    getRoles();
  }, [getRoles]);
  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { employee, roles } = values;
    console.log(roles);
    if (!employee) {
      message.error("Please select an employee.");
      return;
    }

    if (roles.length === 0) {
      message.error("Please select at least one role.");
      return;
    }

    addAppUser({
      variables: {
        userId: employee.userId,
        roles,
      },
    });
  };

  function tagRender(props: any) {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          fontWeight: 700,
          borderRadius: 20,
          textAlign: "center",
          maxWidth: 250,
          backgroundColor: RoleTagStringToColor(label),
          borderColor: RoleTagStringToColor(label),
          borderWidth: 1,
        }}
      >
        {label}
      </Tag>
    );
  }
  let options: any = [];
  roleData?.getRoles?.map((role: Role) => {
    options.push({ value: role.id, label: role.name });
  });

  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        type="primary"
        onClick={() => setVisible(true)}
        className={classes["custom-btn-primary"]}
      >
        Add User Roles
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Add User Roles"}
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
          <Form.Item label="Employee" name="employee">
            {/* As SearchAPSUser component is inside a form, the onChange event 
            handler does not need to be specifically passed. The selected 
            employee will automatically be added to the form value */}
            <SearchAPSUser />
          </Form.Item>
          <Form.Item
            label="Roles"
            name="roles"
            required={false}
            rules={[
              {
                required: true,
                message: "Please select at least one role.",
              },
            ]}
          >
            <Select
              mode="multiple"
              showArrow
              tagRender={tagRender}
              style={{ width: "100%" }}
              options={options}
            />
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
                  loading={loadingAddUserRoles}
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

export default AddUserRoles;
