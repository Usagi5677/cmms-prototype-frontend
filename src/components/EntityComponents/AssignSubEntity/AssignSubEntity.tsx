import { PushpinOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { ASSIGN_SUB_ENTITY_TO_ENTITY } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { Entity } from "../../../models/Entity/Entity";
import { EntitySelector } from "../../common/EntitySelector";
import classes from "./AssignSubEntity.module.css";

const AssignSubEntity = ({ entity }: { entity: Entity }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [entityIds, setEntityIds] = useState<number[]>([]);
  const [assignSubEntityToEntity, { loading: loadingAttachment }] = useMutation(
    ASSIGN_SUB_ENTITY_TO_ENTITY,
    {
      onCompleted: () => {
        message.success("Successfully assigned sub entity to entity.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while assigning sub entity.");
      },
      refetchQueries: ["getSingleEntity", "getAllEntity"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    assignSubEntityToEntity({
      variables: {
        id: entity.id,
        parentEntityId: entityIds,
      },
    });
  };

  return (
    <>
      <div className={classes["info-edit"]}>
        <Tooltip title="Assign">
          <PushpinOutlined onClick={() => setVisible(true)} />
        </Tooltip>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          title={"Assign Sub Entity"}
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
              label="Entity"
              required={false}
              rules={[
                {
                  required: true,
                  message: "Please select the entity.",
                },
              ]}
            >
              <EntitySelector
                setEntityId={setEntityIds}
                currentId={entity?.parentEntityId}
                currentName={entity?.parentEntity?.machineNumber}
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
                    loading={loadingAttachment}
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

export default AssignSubEntity;
