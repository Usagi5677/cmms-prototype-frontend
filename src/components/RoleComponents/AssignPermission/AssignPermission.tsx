import { Tooltip } from "antd";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import Role from "../../../models/Role";
import classes from "./AssignPermission.module.css";

const AssignPermission = ({ role }: { role: Role }) => {
  return (
    <>
      <Link to={"/role/" + role.id + "/permission"}>
        <Tooltip title="Assign permission">
          <FaLock className={classes["info-edit"]} />
        </Tooltip>
      </Link>
    </>
  );
};

export default AssignPermission;

/*
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
          
        >
          <Form
            form={form}
            layout="vertical"
            name="basic"
            onFinish={onFinish}
            id="myForm"
          >
            <Form.Item name="permissions">
              <div className={classes["checkbox-wrapper"]}>
                {(PERMISSIONS).map((permission, index) => {
                  let exist = false;
                  role.permissionRoles.map((data) => {
                    if (data.permission === permission) {
                      exist = true;
                    }
                  });
                  return (
                    <div key={index}>
                      <Checkbox
                        defaultChecked={exist}
                        onChange={(e) =>
                          onClickCheckbox(e, permission)
                        }
                        className={classes["checkbox"]}
                      >
                        {permission}
                      </Checkbox>
                    </div>
                  );
                })}
              </div>
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

*/
