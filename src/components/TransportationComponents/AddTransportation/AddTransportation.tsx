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
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useContext, useState } from "react";
import { CREATE_TRANSPORTATION } from "../../../api/mutations";
import UserContext from "../../../contexts/UserContext";
import { DEPARTMENTS, ISLANDS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import { TypeSelector } from "../../Type/TypeSelector";
import classes from "./AddTransportation.module.css";

export interface AddTransportationProps {
  transportationType: "Vessel" | "Vehicle";
}

export const AddTransportation: React.FC<AddTransportationProps> = ({
  transportationType,
}) => {
  const { user } = useContext(UserContext);

  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [typeId, setTypeId] = useState<number | null>(null);
  const [entityType, setEntityType] = useState(transportationType);

  const [createTransportation, { loading: loadingTransportation }] =
    useMutation(CREATE_TRANSPORTATION, {
      onCompleted: () => {
        message.success("Successfully created transportation.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating transportation.");
      },
      refetchQueries: [
        "getAllTransportationVessels",
        "getAllTransportationVehicles",
      ],
    });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const {
      machineNumber,
      model,
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
    createTransportation({
      variables: {
        machineNumber,
        model,
        typeId,
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

  let departmentOptions: any = [];
  DEPARTMENTS?.map((department: string) => {
    departmentOptions.push({
      value: department,
      label: department,
    });
  });

  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        loading={loadingTransportation}
        className={classes["custom-btn-primary"]}
      >
        Add Transportation
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Add Transportation"}
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
              <Form.Item
                label="Machine Number"
                name="machineNumber"
                required={false}
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
                label="Transportation Type"
                name="transportType"
                initialValue={transportationType}
              >
                <Radio.Group
                  buttonStyle="solid"
                  optionType="button"
                  onChange={(e) => setEntityType(e.target.value)}
                >
                  <Radio.Button value={"Vessel"}>Vessel</Radio.Button>
                  <Radio.Button value={"Vehicle"}>Vehicle</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item label="Type" required={false}>
                <TypeSelector entityType={entityType} setTypeId={setTypeId} />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Registered Date"
                name="registeredDate"
                required={false}
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
                rules={[
                  {
                    required: true,
                    message: "Please enter the department.",
                  },
                ]}
              >
                <Select
                  showArrow
                  style={{ width: "100%" }}
                  showSearch
                  options={departmentOptions}
                  placeholder={"Department"}
                />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Location"
                name="location"
                required={false}
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
                  options={options}
                  placeholder={"Location"}
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
              <Form.Item label="Measurement" name="measurement">
                <Radio.Group buttonStyle="solid" optionType="button">
                  <Radio.Button value="km">KM</Radio.Button>
                  <Radio.Button value="h">H</Radio.Button>
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
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default AddTransportation;
