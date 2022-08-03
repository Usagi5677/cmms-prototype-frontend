import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";


import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  EDIT_TRANSPORTATION_LOCATION,
} from "../../../api/mutations";
import { ISLANDS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import Transportation from "../../../models/Transportation";
import classes from "./EditTransportationLocation.module.css";

const EditTransportationLocation = ({
  transportation,
  isDeleted,
}: {
  transportation: Transportation;
  isDeleted: boolean | undefined;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editTransportationLocation, { loading: loadingTransportation }] = useMutation(
    EDIT_TRANSPORTATION_LOCATION,
    {
      onCompleted: () => {
        message.success("Successfully updated location.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating location.");
      },
      refetchQueries: [
        "getSingleTransportation",
        "getAllHistoryOfTransportation",
      ],
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
    editTransportationLocation({
      variables: {
        id: transportation?.id,
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
                initialValue={transportation?.location}
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
                  loading={loadingTransportation}
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

export default EditTransportationLocation;
