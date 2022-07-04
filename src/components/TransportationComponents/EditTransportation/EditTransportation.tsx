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
  Select,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_TRANSPORTATION } from "../../../api/mutations";
import { ISLANDS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import Transportation from "../../../models/Transportation";
import classes from "./EditTransportation.module.css";

const EditTransportation = ({
  transportation,
  isDeleted,
}: {
  transportation: Transportation;
  isDeleted?: boolean | undefined;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editTransportation, { loading: loadingTransportation }] = useMutation(
    EDIT_TRANSPORTATION,
    {
      onCompleted: () => {
        message.success("Successfully updated transportation.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating transportation.");
      },
      refetchQueries: [
        "getSingleTransportation",
        "getAllHistoryOfTransportation",
        "singleTransportationUsageHistory",
      ],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const {
      machineNumber,
      model,
      type,
      department,
      location,
      currentMileage,
      lastServiceMileage,
      measurement,
      transportType,
      engine,
      registeredDate,
    } = values;

    if (!machineNumber) {
      message.error("Please enter the machine number.");
      return;
    }
    if (!model) {
      message.error("Please enter the model.");
      return;
    }
    if (!type) {
      message.error("Please enter the type.");
      return;
    }
    if (!department) {
      message.error("Please enter the department.");
      return;
    }
    if (!location) {
      message.error("Please enter the location.");
      return;
    }
    if (!currentMileage) {
      message.error("Please enter the current mileage.");
      return;
    }
    if (!lastServiceMileage) {
      message.error("Please enter the last service mileage.");
      return;
    }
    if (!measurement) {
      message.error("Please select the measurement.");
      return;
    }
    if (!transportType) {
      message.error("Please select the vessel/vehicle.");
      return;
    }
    if (!engine) {
      message.error("Please enter the engine.");
      return;
    }
    editTransportation({
      variables: {
        id: transportation?.id,
        machineNumber,
        model,
        type,
        department,
        location,
        currentMileage,
        lastServiceMileage,
        registeredDate,
        measurement,
        transportType,
        engine,
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
      <Tooltip title="Edit">
        <FaEdit
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
        title={"Edit Transportation"}
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
                label="Machine Number"
                name="machineNumber"
                required={false}
                initialValue={transportation?.machineNumber}
                rules={[
                  {
                    required: true,
                    message: "Please enter the machine number.",
                  },
                ]}
              >
                <Input placeholder="Machine Number" />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Model"
                name="model"
                required={false}
                initialValue={transportation?.model}
                rules={[
                  {
                    required: true,
                    message: "Please enter the model.",
                  },
                ]}
              >
                <Input placeholder="Model" />
              </Form.Item>
            </div>
          </div>

          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Type"
                name="type"
                required={false}
                initialValue={transportation?.type}
                rules={[
                  {
                    required: true,
                    message: "Please enter the type.",
                  },
                ]}
              >
                <Input placeholder="Type" />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Registered Date"
                name="registeredDate"
                required={false}
                initialValue={moment(transportation?.registeredDate)}
              >
                <DatePicker
                  placeholder="Select registered date"
                  style={{
                    width: 200,
                    marginRight: "1rem",
                  }}
                  allowClear={false}
                />
              </Form.Item>
            </div>
          </div>

          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Department"
                name="department"
                required={false}
                initialValue={transportation?.department}
                rules={[
                  {
                    required: true,
                    message: "Please enter the department.",
                  },
                ]}
              >
                <Input placeholder="Department" />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
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
            </div>
          </div>

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

          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Engine"
                name="engine"
                required={false}
                initialValue={transportation?.engine}
                rules={[
                  {
                    required: true,
                    message: "Please enter the engine.",
                  },
                ]}
              >
                <Input placeholder="Engine" />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Measurement"
                name="measurement"
                initialValue={transportation?.measurement}
              >
                <Radio.Group buttonStyle="solid" optionType="button">
                  <Radio.Button value="km">KM</Radio.Button>
                  <Radio.Button value="h">H</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Transportation Type"
                name="transportType"
                initialValue={transportation?.transportType}
              >
                <Radio.Group buttonStyle="solid" optionType="button">
                  <Radio.Button value={"Vessel"}>Vessel</Radio.Button>
                  <Radio.Button value={"Vehicle"}>Vehicle</Radio.Button>
                </Radio.Group>
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

export default EditTransportation;
