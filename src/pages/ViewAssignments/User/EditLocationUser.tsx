import { useMutation } from "@apollo/client";
import { Button, Col, Form, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { memo, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { UPDATE_LOCATION_USER } from "../../../api/mutations";
import AssignmentTypeSelector from "../../../components/common/AssignmentTypeSelector";
import { LocationSelector } from "../../../components/Config/Location/LocationSelector";
import { errorMessage } from "../../../helpers/gql";
import LocationAssign from "../../../models/LocationAssign";
import classes from "./EditLocationUser.module.css";

const EditLocationUser = ({ locAssign }: { locAssign: LocationAssign }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [locationId, setLocationId] = useState<number>(locAssign?.location?.id!);

  const [updateLocationUser, { loading: loadingEntity }] = useMutation(
    UPDATE_LOCATION_USER,
    {
      onCompleted: () => {
        message.success("Successfully updated.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating location user.");
      },
      refetchQueries: ["locationAssignments"],
    }
  );
  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { userType } = values;
    updateLocationUser({
      variables: {
        id: locAssign?.id,
        locationId,
        userType,
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
        title={`Update Location User`}
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
          <Form.Item label="Location" name="location" required={false}>
            <LocationSelector
              currentId={locAssign?.location?.id}
              currentName={locAssign?.location?.name}
              setLocationId={setLocationId}
            />
          </Form.Item>
          <Form.Item
            label="Type"
            name="userType"
            required={false}
            initialValue={locAssign?.userType}
          >
            <AssignmentTypeSelector value={locAssign?.userType!} />
          </Form.Item>
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

export default memo(EditLocationUser);
