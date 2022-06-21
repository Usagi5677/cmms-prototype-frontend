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
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { useContext, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_MACHINE_PERIODIC_MAINTENANCE } from "../../../api/mutations";
import UserContext from "../../../contexts/UserContext";
import { errorMessage } from "../../../helpers/gql";
import PeriodicMaintenance from "../../../models/Machine/MachinePeriodicMaintenance";
import classes from "./EditMachinePeriodicMaintenance.module.css";

const EditMachinePeriodicMaintenance = ({
  periodicMaintenance,
}: {
  periodicMaintenance: PeriodicMaintenance;
}) => {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState("");
  const [tasks, setTasks] = useState<any>([]);
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [
    editMachinePeriodicMaintenance,
    { loading: loadingPeriodicMaintenace },
  ] = useMutation(EDIT_MACHINE_PERIODIC_MAINTENANCE, {
    onCompleted: () => {
      message.success("Successfully updated periodic maintenance.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(
        error,
        "Unexpected error while updating periodic maintenance."
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
    const { title, description, period, notificationReminder, fixedDate } =
      values;

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
    editMachinePeriodicMaintenance({
      variables: {
        id: periodicMaintenance.id,
        title,
        description,
        period,
        notificationReminder,
        fixedDate,
        tasks,
      },
    });
  };

  const removeTask = (e: any, task: any) => {
    var array = [...tasks];
    var index = array.indexOf(task);
    if (index !== -1) {
      array.splice(index, 1);
      setTasks(array);
    }
  };

  return (
    <>
      <div className={classes["info-edit"]}>
        <Tooltip title="Edit">
          <FaEdit onClick={() => setVisible(true)} />
        </Tooltip>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          title={"Edit Periodic Maintenance"}
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
            <Form.Item
              label="Title"
              name="title"
              required={false}
              initialValue={periodicMaintenance?.title}
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
              initialValue={periodicMaintenance?.description}
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
              initialValue={periodicMaintenance?.period}
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
              initialValue={periodicMaintenance?.notificationReminder}
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
              initialValue={moment(periodicMaintenance?.fixedDate)}
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
                    Edit
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default EditMachinePeriodicMaintenance;
