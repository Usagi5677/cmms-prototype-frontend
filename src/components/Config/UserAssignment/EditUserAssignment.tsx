import { useMutation } from "@apollo/client";
import { message, Tooltip, Modal, Form, Input, Row, Col, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { EDIT_BRAND, EDIT_USER_ASSIGNMENT } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import UserAssignment from "../../../models/UserAssignment";
import AssignmentTypeSelector from "../../common/AssignmentTypeSelector";
import { DivisionSelector } from "../Division/DivisionSelector";
import { LocationSelector } from "../Location/LocationSelector";
import { ZoneSelector } from "../Zone/ZoneSelector";


export interface EditUserAssignmentProps {
  userAssignment: UserAssignment;
}

export const EditUserAssignment: React.FC<EditUserAssignmentProps> = ({ userAssignment }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [zoneId, setZoneIds] = useState<number>(userAssignment?.zone?.id!);
  const [locationId, setLocationIds] = useState<number>(userAssignment?.location?.id!);
  const [update, { loading }] = useMutation(EDIT_USER_ASSIGNMENT, {
    onCompleted: () => {
      message.success("Successfully updated user assignment.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, `${error?.graphQLErrors[0].message}`);
    },
    refetchQueries: ["userAssignments"],
  });

  const handleCancel = () => {
    //form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { type } = values;
    if (!type) {
      message.error("Please select the type.");
      return;
    }
    update({
      variables: {
        input: {
          id: userAssignment.id,
          type,
          zoneId,
          locationId,
        },
      },
    });
  };

  return (
    <>
      <Tooltip title="Edit" placement="top">
        <FaRegEdit
          className="editButton"
          onClick={() => setVisible(true)}
          style={{ marginRight: ".5rem" }}
          // size="20px"
        />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Edit User Assignment"
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
        >
          <Form.Item
            label="Type"
            name="type"
            required={false}
            initialValue={userAssignment?.type}
          >
            <AssignmentTypeSelector value={userAssignment?.type} />
          </Form.Item>
          <Form.Item label="Zone" name="zone" required={false}>
            <ZoneSelector
              currentId={userAssignment?.zone?.id}
              currentName={userAssignment?.zone?.name}
              setZoneId={setZoneIds}
            />
          </Form.Item>
          <Form.Item label="Location" name="location" required={false}>
            <LocationSelector
              currentId={userAssignment?.location?.id}
              currentName={userAssignment?.location?.name}
              setLocationId={setLocationIds}
            />
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
                  loading={loading}
                  className="primaryButton"
                >
                  Update
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
