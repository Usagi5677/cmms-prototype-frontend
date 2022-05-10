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
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useContext, useState } from "react";
import { CREATE_MACHINE } from "../../../api/mutations";
import UserContext from "../../../contexts/UserContext";
import { errorMessage } from "../../../helpers/gql";
import classes from "./AddMachine.module.css";

const AddMachine = () => {
  const { user } = useContext(UserContext);

  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [createMachine, { loading: loadingMachine }] = useMutation(
    CREATE_MACHINE,
    {
      onCompleted: () => {
        message.success("Successfully created machine.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating machine.");
      },
      refetchQueries: ["getAllMachine"],
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
      zone,
      location,
      currentRunningHrs,
      lastServiceHrs,
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
    if (!zone) {
      message.error("Please enter the zone.");
      return;
    }
    if (!location) {
      message.error("Please enter the location.");
      return;
    }
    if (!currentRunningHrs) {
      message.error("Please enter the current running hrs.");
      return;
    }
    if (!lastServiceHrs) {
      message.error("Please enter the last service hrs.");
      return;
    }
    createMachine({
      variables: {
        machineNumber,
        model,
        type,
        zone,
        location,
        currentRunningHrs,
        lastServiceHrs,
        registeredDate,
      },
    });
  };
  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        loading={loadingMachine}
        className={classes["custom-btn-primary"]}
      >
        Add Machine
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Add Machine"}
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
                label="Type"
                name="type"
                required={false}
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
                label="Zone"
                name="zone"
                required={false}
                rules={[
                  {
                    required: true,
                    message: "Please enter the zone.",
                  },
                ]}
              >
                <Input placeholder="Zone" />
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
                <Input placeholder="Location" />
              </Form.Item>
            </div>
          </div>

          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Current running hrs"
                name="currentRunningHrs"
                required={false}
                rules={[
                  {
                    required: true,
                    message: "Please enter the current running hrs.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Current running hrs"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Last service hrs"
                name="lastServiceHrs"
                required={false}
                rules={[
                  {
                    required: true,
                    message: "Please enter the last service hrs.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Last service hrs"
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
                  loading={loadingMachine}
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

export default AddMachine;
