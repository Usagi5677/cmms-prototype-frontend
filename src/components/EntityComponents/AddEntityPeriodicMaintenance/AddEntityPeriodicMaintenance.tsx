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
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useContext, useState } from "react";
import { ADD_ENTITY_PERIODIC_MAINTENANCE } from "../../../api/mutations";
import UserContext from "../../../contexts/UserContext";
import { errorMessage } from "../../../helpers/gql";
import classes from "./AddEntityPeriodicMaintenance.module.css";

const AddEntityPeriodicMaintenance = ({
  entityID,
  value,
  measurement,
}: {
  entityID: number;
  value?: number;
  measurement?: string;
}) => {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState("");
  const [tasks, setTasks] = useState<any>([]);
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [
    addEntityPeriodicMaintenance,
    { loading: loadingPeriodicMaintenace },
  ] = useMutation(ADD_ENTITY_PERIODIC_MAINTENANCE, {
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
      "getAllPeriodicMaintenanceOfEntity",
      "getAllHistoryOfEntity",
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
    const { title, measurement, value, startDate } = values;

    if (!title) {
      message.error("Please enter the title.");
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
    addEntityPeriodicMaintenance({
      variables: {
        entityId: entityID,
        title,
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
    //setTasks((prev: any) => prev.filter((val: any, i: number) => i !== task));
  };

  const onClickSetVisible = () => {
    setVisible(true);
    setTasks([]);
  };
  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        type="primary"
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
        title={
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Add Periodic Maintenance</div>
              <div style={{ paddingRight: 50 }}>
                {value} {measurement == "km" ?  "Current mileage" : "Current running" } {measurement}
              </div>
            </div>
          </>
        }
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
          <Form.Item label="Measurement" name="measurement">
            <Radio.Group buttonStyle="solid" optionType="button">
              <Radio.Button value="km">Km</Radio.Button>
              <Radio.Button value="hour">Hr</Radio.Button>
              <Radio.Button value="day">Day</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Measurement Value"
            name="value"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the value.",
              },
            ]}
          >
            <InputNumber placeholder="Value" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Start Date" name="startDate" required={false}>
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

export default AddEntityPeriodicMaintenance;
