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
import {
  ADD_MACHINE_PERIODIC_MAINTENANCE,
} from "../../../api/mutations";
import UserContext from "../../../contexts/UserContext";
import { errorMessage } from "../../../helpers/gql";
import classes from "./AddMachinePeriodicMaintenance.module.css";

const AddMachinePeriodicMaintenance = ({ machineID }: { machineID: number }) => {
  const { user } = useContext(UserContext);

  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [
    addMachinePeriodicMaintenance,
    { loading: loadingPeriodicMaintenace },
  ] = useMutation(ADD_MACHINE_PERIODIC_MAINTENANCE, {
    onCompleted: () => {
      message.success("Successfully created periodic maintenance.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(
        error,
        "Unexpected error while creating periodic maintenance."
      );
    },
    refetchQueries: ["getAllPeriodicMaintenanceOfMachine", "getAllHistoryOfMachine"],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { title, description, period, notificationReminder, fixedDate } = values;

    if (!title) {
      message.error("Please enter the title.");
      return;
    }
    if (!description) {
      message.error("Please enter the description.");
      return;
    }
    if (!period) {
      message.error("Please enter the period.");
      return;
    }
    if (!notificationReminder) {
      message.error("Please enter the notification reminder.");
      return;
    }
    if (!fixedDate) {
      message.error("Please enter select the fixed date.");
      return;
    }
    addMachinePeriodicMaintenance({
      variables: {
        machineId: machineID,
        title,
        description,
        period,
        notificationReminder,
        fixedDate
      },
    });
  };
  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        loading={loadingPeriodicMaintenace}
        className={classes["custom-btn-primary"]}
      >
        Add Periodic Maintenance
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Add Periodic Maintenance"}
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
          <Form.Item
            label="Title"
            name="title"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the title.",
              },
            ]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the description.",
              },
            ]}
          >
            <Input placeholder="Description" />
          </Form.Item>

          <Form.Item
            label="Period"
            name="period"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the period.",
              },
            ]}
          >
            <InputNumber placeholder="Period" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Notification Reminder"
            name="notificationReminder"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the notification reminder.",
              },
            ]}
          >
            <InputNumber
              placeholder="Notification Reminder"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Fixed Date"
            name="fixedDate"
            required={false}
          >
            <DatePicker
              placeholder="Select fixed date"
              style={{
                width: 200,
                marginRight: "1rem",
              }}
              allowClear={false}
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
                  loading={loadingPeriodicMaintenace}
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

export default AddMachinePeriodicMaintenance;
