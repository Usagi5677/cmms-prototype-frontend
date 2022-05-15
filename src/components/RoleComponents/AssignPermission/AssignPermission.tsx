import { useMutation } from "@apollo/client";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";

import { useEffect, useState } from "react";
import { FaEdit, FaLock } from "react-icons/fa";
import { ASSIGN_PERMISSION } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { PermissionEnum } from "../../../models/Enums";
import Role from "../../../models/Role";
import classes from "./AssignPermission.module.css";

const AssignPermission = ({ role }: { role: Role }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [checkboxPermissions, setCheckboxPermissions] = useState<any>([]);

  const [assignPermission, { loading: loadingPermission }] = useMutation(
    ASSIGN_PERMISSION,
    {
      onCompleted: () => {
        message.success("Successfully assigned permission.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while assigning permission.");
      },
      refetchQueries: ["getAllRoles"],
    }
  );

  // Set permissions when component mounts
  useEffect(() => {
    setCheckboxPermissions(role.permissionRoles.map((data) => data.permission));
  }, []);

  const handleCancel = () => {
    
    setVisible(false);
  };

  const onFinish = (value: any) => {
    assignPermission({
      variables: {
        roleId: role.id,
        permissions: checkboxPermissions,
      },
    });
  };
  const onClickCheckbox = (checkbox: any, valueOfCheckbox: any) => {
    const { checked } = checkbox.target;
    setCheckboxPermissions((prev: any) =>
      checked
        ? [...prev, valueOfCheckbox]
        : prev.filter((val: any) => val !== valueOfCheckbox)
    );
  };

  return (
    <>
      <div className={classes["info-edit"]}>
        <Tooltip title="Assign permission">
          <FaLock onClick={() => setVisible(true)} />
        </Tooltip>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          title={"Assign Permission"}
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
            <Form.Item label="Permissions" name="permissions">
              <Row>
                {(
                  Object.keys(PermissionEnum) as Array<
                    keyof typeof PermissionEnum
                  >
                ).map((key, index) => {
                  let exist = false;
                  role.permissionRoles.map((data) => {
                    if (data.permission === PermissionEnum[key]) {
                      exist = true;
                    }
                  });
                  return (
                    <Col span={8} key={index}>
                      <Checkbox
                        defaultChecked={exist}
                        onChange={(e) =>
                          onClickCheckbox(e, PermissionEnum[key])
                        }
                      >
                        {PermissionEnum[key]}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
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
                    loading={loadingPermission}
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

export default AssignPermission;
