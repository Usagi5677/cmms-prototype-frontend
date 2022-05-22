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
import { GET_USERS_WITH_PERMISSION } from "../../../api/queries";
import { ASSIGN_USER_TO_TRANSPORTATION } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { UserTagStringToColor } from "../../../helpers/style";
import User from "../../../models/User";
import classes from "./TransportationAssignment.module.css";

const TransportationAssignment = ({
  transportationID,
}: {
  transportationID: number;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [assignUsersToTransportation, { loading: loadingAssign }] = useMutation(
    ASSIGN_USER_TO_TRANSPORTATION,
    {
      onCompleted: () => {
        message.success("Successfully assigned user.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while assigning user.");
      },
      refetchQueries: [
        "getSingleTransportation",
        "getAllHistoryOfTransportation",
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

  // Fetch users when component mount
  useEffect(() => {
    getUsersWithPermission({
      variables: { permissions: ["ADD_TRANSPORTATION_REPAIR"] },
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
          backgroundColor: UserTagStringToColor(label),
          borderColor: UserTagStringToColor(label),
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

    assignUsersToTransportation({
      variables: {
        transportationId: transportationID,
        userIds: assign,
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
        <Tooltip title="Assign">
          <FaUserCog onClick={() => setVisible(true)} />
        </Tooltip>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          title={"Assign User"}
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
              label="Assign User"
              name="assign"
              required={false}
              rules={[
                {
                  required: true,
                  message: "Please assign the user.",
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

export default TransportationAssignment;
