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
  Radio,
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
    const {
      title,
      description,
      measurement,
      value,
      startDate,
    } = values;

    if (!title) {
      message.error("Please enter the title.");
      return;
    }
    if (!description) {
      message.error("Please enter the description.");
      return;
    }
    if (!measurement) {
      message.error("Please select the measurement.");
      return;
    }
    if (!value) {
      message.error("Please enter the period.");
      return;
    }
    if (!startDate) {
      message.error("Please enter select the fixed date.");
      return;
    }
    editMachinePeriodicMaintenance({
      variables: {
        id: periodicMaintenance.id,
        title,
        description,
        measurement,
        value,
        startDate,
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
              label="Measurement"
              name="measurement"
              initialValue={periodicMaintenance?.measurement}
            >
              <Radio.Group buttonStyle="solid" optionType="button">
                <Radio.Button value="km">Km</Radio.Button>
                <Radio.Button value="hour">Hr</Radio.Button>
                <Radio.Button value="day">Day</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Value"
              name="value"
              required={false}
              initialValue={periodicMaintenance?.value}
              rules={[
                {
                  required: true,
                  message: "Please enter the value.",
                },
              ]}
            >
              <InputNumber placeholder="Value" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Start Date"
              name="startDate"
              required={false}
              initialValue={moment(periodicMaintenance?.startDate)}
            >
              <DatePicker
                placeholder="Select start date"
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
