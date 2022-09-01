import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  message,
  Modal,
  Row,
  Select,
  Tag,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";
import { errorMessage } from "../../../helpers/gql";
import { ADD_USER_ROLE } from "../../../api/mutations";
import { GET_ROLES, ME_QUERY } from "../../../api/queries";
import Role from "../../../models/Role";
import User from "../../../models/User";
import { FaEdit } from "react-icons/fa";
import classes from "./EditUserRoles.module.css";
import { RoleTagStringToColor } from "../../../helpers/style";


const EditUserRoles = ({ userData }: { userData?: User }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [addUserRole, { loading: loadingAddUserRoles }] = useMutation(
    ADD_USER_ROLE,
    {
      onCompleted: () => {
        message.success("Successfully added user roles.");
        handleCancel();
        //window.location.reload();
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
    const { roles } = values;

    if (roles.length === 0) {
      message.error("Please select at least one role.");
      return;
    }

    addUserRole({
      variables: {
        userId: userData?.id,
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
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit">
        <FaEdit onClick={(e) => {setVisible(true)}} />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Edit User Roles"}
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
            label="Roles"
            name="roles"
            initialValue={userData?.roles?.map((role) => role.role.id)}
          >
            <Select
              mode="multiple"
              showArrow
              tagRender={tagRender}
              style={{ width: "100%" }}
              options={options}
              placeholder="Roles"
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
                  style={{ borderRadius: 20 }}
                >
                  Edit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EditUserRoles;
