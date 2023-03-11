import { useMutation } from "@apollo/client";
import { Button, Col, Form, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { UPDATE_ENTITY_DIVISION } from "../../../api/mutations";
import { DivisionSelector } from "../../../components/Config/Division/DivisionSelector";
import { errorMessage } from "../../../helpers/gql";
import { Entity } from "../../../models/Entity/Entity";
import classes from "./EditEntityDivision.module.css";

const EditEntityDivision = ({ entity }: { entity: Entity }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [divisionId, setDivisionId] = useState<number | null>(null);

  const [updateEntityDivision, { loading: loadingEntity }] = useMutation(
    UPDATE_ENTITY_DIVISION,
    {
      onCompleted: () => {
        message.success("Successfully updated entity's division.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while updating entity's division."
        );
      },
      refetchQueries: ["getAllEntity"],
    }
  );

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    updateEntityDivision({
      variables: {
        entityId: entity.id,
        divisionId: divisionId,
      },
    });
  };

  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit">
        <FaRegEdit onClick={() => setVisible(true)} />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Update division`}
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
          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item label="Division" name="division" required={false}>
                <DivisionSelector
                  currentId={entity?.division?.id}
                  currentName={entity?.division?.name}
                  setDivisionId={setDivisionId}
                />
              </Form.Item>
            </div>
          </div>
          <Row justify="end" gutter={16}>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="ghost"
                  onClick={handleCancel}
                  className="secondaryButton"
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
                  loading={loadingEntity}
                  className="primaryButton"
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

export default EditEntityDivision;
