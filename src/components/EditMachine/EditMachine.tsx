import { useMutation } from "@apollo/client";
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_MACHINE } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import Machine from "../../models/Machine";
import classes from "./EditMachine.module.css";

interface MachineEditData {
  id: number;
  machineNumber: string;
  model: string;
  type: string;
  zone: string;
  location: string;
  currentRunningHrs?: number;
  lastServiceHrs?: number;
  registeredDate?: Date;
}

const EditMachine = ({ machine }: { machine: MachineEditData }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  
  const [editMachine, { loading: loadingMachine }] =
    useMutation(EDIT_MACHINE, {
      onCompleted: () => {
        message.success("Successfully updated machine.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating machine.");
      },
      refetchQueries: ["getAllMachine", "getSingleMachine"],
    });
    
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
    editMachine({
      variables: {
        id: machine?.id,
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
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit">
        <FaEdit onClick={() => setVisible(true)}/>
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
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
          <Row>
            <Col span={12}>
              <Form.Item
                label="Machine Number"
                name="machineNumber"
                required={false}
                initialValue={machine?.machineNumber}
                rules={[
                  {
                    required: true,
                    message: "Please enter the machine number.",
                  },
                ]}
                style={{ paddingRight: 40 }}
              >
                <Input placeholder="Machine Number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Model"
                name="model"
                required={false}
                initialValue={machine?.model}
                rules={[
                  {
                    required: true,
                    message: "Please enter the model.",
                  },
                ]}
              >
                <Input placeholder="Model" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="Type"
                name="type"
                required={false}
                initialValue={machine?.type}
                rules={[
                  {
                    required: true,
                    message: "Please enter the type.",
                  },
                ]}
                style={{ paddingRight: 40 }}
              >
                <Input placeholder="Type" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Registered Date"
                name="registeredDate"
                required={false}
                initialValue={machine?.registeredDate}
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
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="Zone"
                name="zone"
                required={false}
                initialValue={machine?.zone}
                rules={[
                  {
                    required: true,
                    message: "Please enter the zone.",
                  },
                ]}
                style={{ paddingRight: 40 }}
              >
                <Input placeholder="Zone" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Location"
                name="location"
                required={false}
                initialValue={machine?.location}
                rules={[
                  {
                    required: true,
                    message: "Please enter the location.",
                  },
                ]}
              >
                <Input placeholder="Location" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="Current running hrs"
                name="currentRunningHrs"
                required={false}
                initialValue={machine?.currentRunningHrs}
                rules={[
                  {
                    required: true,
                    message: "Please enter the current running hrs.",
                  },
                ]}
                style={{ paddingRight: 40 }}
              >
                <InputNumber placeholder="Current running hrs" style={{width: '100%'}}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last service hrs"
                name="lastServiceHrs"
                required={false}
                initialValue={machine?.lastServiceHrs}
                rules={[
                  {
                    required: true,
                    message: "Please enter the last service hrs.",
                  },
                ]}
              >
                <InputNumber placeholder="Last service hrs" style={{width: '100%'}}/>
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
                  loading={loadingMachine}
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

export default EditMachine;
