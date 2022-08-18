import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  message,
  Modal,
  Row,
  Select,
  Tag,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";
import { errorMessage } from "../../../helpers/gql";
import { ADD_USER_ROLE, EDIT_USER_LOCATION } from "../../../api/mutations";
import { GET_ROLES, ME_QUERY } from "../../../api/queries";
import Role from "../../../models/Role";
import User from "../../../models/User";
import { FaEdit, FaMapMarkerAlt } from "react-icons/fa";
import classes from "./EditUserLocation.module.css";
import { RoleTagStringToColor } from "../../../helpers/style";
import { ISLANDS } from "../../../helpers/constants";
import { LocationSelector } from "../../Config/Location/LocationSelector";

const EditUserLocation = ({ userData }: { userData?: User }) => {
  const [visible, setVisible] = useState(false);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [form] = useForm();

  const [editUserLocation, { loading: loadingEditLocation }] = useMutation(
    EDIT_USER_LOCATION,
    {
      onCompleted: () => {
        message.success("Successfully updated user location.");
        handleCancel();
        //window.location.reload();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating user location.");
      },
      refetchQueries: ["getAllUsers", { query: ME_QUERY }],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    editUserLocation({
      variables: {
        id: userData?.id,
        locationId,
      },
    });
  };

  function tagRender(props: any) {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          fontWeight: 700,
          borderRadius: 20,
          textAlign: "center",
          maxWidth: 250,
          backgroundColor: RoleTagStringToColor(label),
          borderColor: RoleTagStringToColor(label),
          borderWidth: 1,
        }}
      >
        {label}
      </Tag>
    );
  }

  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit">
        <FaMapMarkerAlt
          onClick={(e) => {
            setVisible(true);
          }}
        />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Edit User Location"}
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
              currentId={userData?.location?.id}
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
                  loading={loadingEditLocation}
                  style={{ borderRadius: 20 }}
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

export default EditUserLocation;
