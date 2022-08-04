import { useMutation } from "@apollo/client";
import { Button, Col, Form, message, Modal, Row, Select, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { EDIT_ENTITY_LOCATION } from "../../../api/mutations";
import { ISLANDS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import EntityModel from "../../../models/Entity/EntityModel";
import classes from "./EditEntityLocation.module.css";

const EditEntityLocation = ({
  entity,
  isDeleted,
}: {
  entity: EntityModel;
  isDeleted: boolean | undefined;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editEntityLocation, { loading: loadingEntity }] = useMutation(
    EDIT_ENTITY_LOCATION,
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

  const onFinish = async (values: any) => {
    const { location } = values;

    if (!location) {
      message.error("Please enter select the location.");
      return;
    }
    editEntityLocation({
      variables: {
        id: entity?.id,
        location,
      },
    });
  };

  let options: any = [];
  ISLANDS?.map((island: string) => {
    options.push({
      value: island,
      label: island,
    });
  });

  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit Location">
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
        title={"Edit Location"}
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
            <Col span={12}>
              <Form.Item
                label="Location"
                name="location"
                required={false}
                initialValue={entity?.location}
                rules={[
                  {
                    required: true,
                    message: "Please enter the location.",
                  },
                ]}
              >
                <Select
                  showArrow
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={"Location"}
                  options={options}
                />
              </Form.Item>
            </Col>
          </Row>

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
