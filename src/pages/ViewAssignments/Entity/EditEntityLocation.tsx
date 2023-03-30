import { useMutation } from "@apollo/client";
import { Button, Col, Form, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { memo, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { UPDATE_ENTITY_LOCATION } from "../../../api/mutations";
import { LocationSelector } from "../../../components/Config/Location/LocationSelector";
import { errorMessage } from "../../../helpers/gql";
import { Entity } from "../../../models/Entity/Entity";
import classes from "./EditEntityDivision.module.css";

const EditEntityLocation = ({ entity }: { entity: Entity }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [locationId, setLocationId] = useState<number | null>(null);

  const [updateEntityLocation, { loading: loadingEntity }] = useMutation(
    UPDATE_ENTITY_LOCATION,
    {
      onCompleted: () => {
        message.success("Successfully updated entity's location.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while updating entity's location."
        );
      },
      refetchQueries: ["getAllEntity"],
    }
  );

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    updateEntityLocation({
      variables: {
        entityId: entity.id,
        locationId: locationId,
      },
    });
  };

  return (
    <div className={classes["info-edit"]}>
      <FaRegEdit onClick={() => setVisible(true)} />
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Update location`}
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
              <Form.Item label="Location" name="location" required={false}>
                <LocationSelector
                  currentId={entity?.location?.id}
                  currentName={entity?.location?.name}
                  setLocationId={setLocationId}
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

export default memo(EditEntityLocation);
