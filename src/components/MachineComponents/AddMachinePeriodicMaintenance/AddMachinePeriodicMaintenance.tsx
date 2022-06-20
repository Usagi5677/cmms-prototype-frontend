import { CloseCircleOutlined } from "@ant-design/icons";
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
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useContext, useState } from "react";
import { FaCrosshairs } from "react-icons/fa";
import { ADD_MACHINE_PERIODIC_MAINTENANCE } from "../../../api/mutations";
import UserContext from "../../../contexts/UserContext";
import { errorMessage } from "../../../helpers/gql";
import classes from "./AddMachinePeriodicMaintenance.module.css";

const AddMachinePeriodicMaintenance = ({
  machineID,
}: {
  machineID: number;
}) => {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState("");
  const [tasks, setTasks] = useState<any>([]);
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
    refetchQueries: [
      "getAllPeriodicMaintenanceOfMachine",
      "getAllHistoryOfMachine",
    ],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const submit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") setDetails("");
    else if (event.key === "Enter") {
      event.preventDefault();
      if (details.trim() === "") return;
      setTasks((prev: any) => [...prev, details]);
      setDetails("");
    }
  };

  const onFinish = async (values: any) => {
    const {
      title,
      description,
      period,
      notificationReminder,
      fixedDate,
    } = values;

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
        fixedDate,
        tasks,
      },
    });
  };

  const removeTask = (e: any, task:any) => {
    var array = [...tasks];
    var index = array.indexOf(task);
    if (index !== -1) {
      array.splice(index, 1);
      setTasks(array);
    }
    //setTasks((prev: any) => prev.filter((val: any, i: number) => i !== task));
  };

  const onClickSetVisible = () => {
    setVisible(true);
    setTasks([]);
  }
  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={onClickSetVisible}
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
          <Form.Item label="Fixed Date" name="fixedDate" required={false}>
            <DatePicker
              placeholder="Select fixed date"
              style={{
                width: 200,
                marginRight: "1rem",
              }}
              allowClear={false}
            />
          </Form.Item>
          <div className={classes["title"]}>Add Task</div>
          <div className={classes["input-wrapper"]}>
            <input
              type="text"
              id="AddTask"
              placeholder="Add task"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              onKeyDown={submit}
              style={{ width: 120 }}
            />
          </div>

          {tasks?.map((task: string, index: number) => (
            <div className={classes["task"]} key={index}>
              {task}
              <CloseCircleOutlined
                className={classes["task-delete"]}
                onClick={(e) => removeTask(e, task)}
              />
            </div>
          ))}
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
