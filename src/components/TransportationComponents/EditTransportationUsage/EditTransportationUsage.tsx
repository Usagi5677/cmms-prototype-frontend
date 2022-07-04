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
  Radio,
  Row,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";

import { useState } from "react";
import { FaEdit, FaRegEdit } from "react-icons/fa";
import { EDIT_TRANSPORTATION_USAGE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import Transportation from "../../../models/Transportation";
import classes from "./EditTransportationUsage.module.css";

const EditTransportationUsage = ({
  transportation,
  isDeleted,
}: {
  transportation: Transportation;
  isDeleted?: boolean | undefined;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editTransportationUsage, { loading: loadingTransportation }] =
    useMutation(EDIT_TRANSPORTATION_USAGE, {
      onCompleted: () => {
        message.success("Successfully updated transportation usage.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while updating transportation usage."
        );
      },
      refetchQueries: [
        "getSingleTransportation",
        "getAllHistoryOfTransportation",
        "singleTransportationUsageHistory",
      ],
    });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { currentMileage, lastServiceMileage } = values;

    if (!currentMileage) {
      message.error("Please enter the current mileage.");
      return;
    }
    if (!lastServiceMileage) {
      message.error("Please enter the last service mileage.");
      return;
    }

    editTransportationUsage({
      variables: {
        id: transportation?.id,
        currentMileage,
        lastServiceMileage,
      },
    });
  };

  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit Usage">
        <FaRegEdit
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
        title={"Edit Usage"}
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
          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Current mileage"
                name="currentMileage"
                required={false}
                initialValue={transportation?.currentMileage}
                rules={[
                  {
                    required: true,
                    message: "Please enter the current mileage.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Current mileage"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Last service mileage"
                name="lastServiceMileage"
                required={false}
                initialValue={transportation?.lastServiceMileage}
                rules={[
                  {
                    required: true,
                    message: "Please enter the last service mileage.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Last service mileage"
                  style={{ width: "100%" }}
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

export default EditTransportationUsage;
