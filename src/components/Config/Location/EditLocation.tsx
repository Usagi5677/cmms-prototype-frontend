import React from "react";
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
import { useState } from "react";
import { EDIT_LOCATION } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { FaRegEdit } from "react-icons/fa";
import Location from "../../../models/Location";
import { ZoneSelector } from "../Zone/ZoneSelector";

export interface EditLocationProps {
  location: Location;
}

export const EditLocation: React.FC<EditLocationProps> = ({ location }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [zoneId, setZoneId] = useState(location.zone?.id ?? null);

  const [edit, { loading }] = useMutation(EDIT_LOCATION, {
    onCompleted: () => {
      message.success("Successfully updated location.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating location.");
    },
    refetchQueries: ["locations"],
  });

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name, skipFriday } = values;
    edit({
      variables: {
        input: {
          id: location.id,
          name,
          zoneId,
          skipFriday,
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
        />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Edit Location"
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
          initialValues={{ name: location.name }}
        >
          <Form.Item
            label="Name"
            name="name"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter a name.",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Zone" required={false}>
            <ZoneSelector setZoneId={setZoneId} currentId={zoneId} />
          </Form.Item>
          <Form.Item
            name="skipFriday"
            required={false}
            initialValue={location?.skipFriday}
            valuePropName="checked"
          >
            <Checkbox>Skip Friday</Checkbox>
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
