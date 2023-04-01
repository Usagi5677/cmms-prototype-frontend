import { useMutation } from "@apollo/client";
import { Button, Col, Form, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { EDIT_ENTITY } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { Entity } from "../../../models/Entity/Entity";
import { LocationSelector } from "../../Config/Location/LocationSelector";
import classes from "./EditEntityLocation.module.css";

const EditEntityLocation = ({
  entity,
  isDeleted,
}: {
  entity: Entity;
  isDeleted: boolean | undefined;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [locationId, setLocationId] = useState<number | null>(null);

  const [editEntityLocation, { loading: loadingEntity }] = useMutation(
    EDIT_ENTITY,
    {
      onCompleted: () => {
        message.success("Successfully updated location.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating location.");
      },
      refetchQueries: ["getSingleEntity", "getAllHistoryOfEntity"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async () => {
    if (!locationId) {
      message.error("Please select the location.");
      return;
    }
    editEntityLocation({
      variables: {
        input: { id: entity?.id, locationId },
      },
    });
  };

  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Update Location">
        <FaMapMarkerAlt
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
        title={"Update Location"}
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
          <Form.Item label="Location" name="location" required={false}>
            <LocationSelector
              currentId={entity?.location?.id}
              currentName={entity?.location?.name}
              setLocationId={setLocationId}
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
                  loading={loadingEntity}
                  className={classes["custom-btn-primary"]}
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

export default EditEntityLocation;
