import { FormOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { EDIT_ENTITY, UPDATE_ENTITY_NOTE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { Entity } from "../../../models/Entity/Entity";
import { LocationSelector } from "../../Config/Location/LocationSelector";
import classes from "./EditEntityNote.module.css";

const EditEntityNote = ({
  entity,
  isDeleted,
}: {
  entity: Entity;
  isDeleted: boolean | undefined;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [locationId, setLocationId] = useState<number | null>(null);

  const [updateEntityNote, { loading: loadingEntity }] = useMutation(
    UPDATE_ENTITY_NOTE,
    {
      onCompleted: () => {
        message.success("Successfully updated note.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating note.");
      },
      refetchQueries: ["getSingleEntity", "getAllHistoryOfEntity"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { note } = values;

    updateEntityNote({
      variables: {
        id: entity?.id,
        note,
      },
    });
  };

  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit Note">
        <FormOutlined
          onClick={() => setVisible(true)}
          style={{
            pointerEvents: isDeleted ? "none" : "auto",
            color: isDeleted ? "grey" : "inherit",
          }}
        />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Edit Note"}
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
          <Row>
            <Col style={{ width: "100%" }}>
              <Form.Item
                label="Description"
                name="note"
                required={false}
                initialValue={entity?.note}
              >
                <TextArea placeholder="Description" allowClear />
              </Form.Item>
            </Col>
          </Row>

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

export default EditEntityNote;
