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
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { FaUserCog } from "react-icons/fa";
import { GET_USERS_WITH_PERMISSION, ME_QUERY } from "../../../api/queries";
import { ASSIGN_USER_TO_ENTITY } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { stringToColor } from "../../../helpers/style";
import User from "../../../models/User";
import classes from "./EntityAssignment.module.css";
import React from "react";

export interface EntityAssignmentProps {
  entityId: number;
  type: "Admin" | "Engineer" | "Technician" | "User";
}

export const EntityAssignment: React.FC<EntityAssignmentProps> = ({
  entityId,
  type,
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [assignUsersToEntity, { loading: loadingAssign }] = useMutation(
    ASSIGN_USER_TO_ENTITY,
    {
      onCompleted: () => {
        message.success("Successfully assigned.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while assigning.");
      },
      refetchQueries: [
        "getSingleEntity",
        "getAllHistoryOfEntity",
        "getAllEntityChecklistAndPMSummary",
        { query: ME_QUERY },
      ],
    }
  );

  const [getUsersWithPermission, { data: userData, loading: loadingUsers }] =
    useLazyQuery(GET_USERS_WITH_PERMISSION, {
      onError: (err) => {
        errorMessage(err, "Error loading request.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    });

  let typePermission: string;
  if (type === "Admin") typePermission = "ENTITY_ADMIN";
  else if (type === "Engineer") typePermission = "ENTITY_ENGINEER";
  else if (type === "Technician") typePermission = "ENTITY_TECHNICIAN";
  else if (type === "User") typePermission = "ENTITY_USER";

  // Fetch users when component mount
  useEffect(() => {
    getUsersWithPermission({
      variables: { permissions: [typePermission] },
    });
  }, [getUsersWithPermission]);

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
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
          backgroundColor: stringToColor(label?.split("(")[0].trim()),
          borderColor: stringToColor(label?.split("(")[0].trim()),
          borderWidth: 1,
        }}
      >
        {label}
      </Tag>
    );
  }

  const onFinish = async (values: any) => {
    const { assign } = values;

    if (!assign) {
      message.error("Please assign the user.");
      return;
    }

    assignUsersToEntity({
      variables: {
        entityId: entityId,
        userIds: assign,
        type,
      },
    });
  };

  let options: any = [];
  userData?.getUsersWithPermission?.map((user: User) => {
    options.push({
      value: user.id,
      label: user.fullName + " " + "(" + user.rcno + ")",
    });
  });

  return (
    <>
      <div className={classes["info-edit"]}>
        <Tooltip title={`Assign ${type}`}>
          <FaUserCog onClick={() => setVisible(true)} />
        </Tooltip>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          title={`Assign ${type}`}
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
              label="User"
              name="assign"
              required={false}
              rules={[
                {
                  required: true,
                  message: "Please select a user.",
                },
              ]}
            >
              <Select
                mode="multiple"
                showArrow
                tagRender={tagRender}
                style={{ width: "100%" }}
                options={options}
                placeholder="Select employees"
                showSearch
                filterOption={(input, option: any) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
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
                    loading={loadingAssign}
                    className={classes["custom-btn-primary"]}
                  >
                    Assign
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

export default EntityAssignment;
