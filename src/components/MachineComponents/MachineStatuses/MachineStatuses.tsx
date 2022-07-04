import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import {
  ADD_MACHINE_BREAKDOWN,
  SET_MACHINE_STATUS,
} from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { MachineStatus } from "../../../models/Enums";
import MachineStatusTag from "../../common/MachineStatusTag";
import classes from "./MachineStatuses.module.css";

const MachineStatuses = ({
  machineID,
  machineStatus,
  isDeleted,
}: {
  machineID: number;
  machineStatus: MachineStatus;
  isDeleted?: boolean | undefined;
}) => {
  const [setMachineStatus, { loading: settingStatus }] = useMutation(
    SET_MACHINE_STATUS,
    {
      onCompleted: () => {
        message.success("Successfully updated machine status.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error occured.");
      },
      refetchQueries: [
        "getSingleMachine",
        "getAllBreakdownOfMachine",
        "getAllRepairOfMachine",
        "getAllHistoryOfMachine",
        "breakdownMachineCount",
      ],
    }
  );

  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [addMachineBreakdown, { loading: loadingBreakdown }] = useMutation(
    ADD_MACHINE_BREAKDOWN,
    {
      onCompleted: () => {
        message.success("Successfully created breakdown.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating breakdown.");
      },
      refetchQueries: [
        "getAllBreakdownOfMachine",
        "getAllHistoryOfMachine",
        "getSingleMachine",
        "breakdownMachineCount",
      ],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { title, description } = values;

    if (!title) {
      message.error("Please enter the title.");
      return;
    }
    if (!description) {
      message.error("Please enter the description.");
      return;
    }

    addMachineBreakdown({
      variables: {
        machineId: machineID,
        title,
        description,
      },
    });
  };
  const onChangeClick = async (status: MachineStatus) => {
    if (status === "Breakdown") {
      setVisible(true);
    } else {
      setMachineStatus({
        variables: { machineId: machineID, status },
      });
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width="90vw"
        title={"Add Breakdown"}
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
                  loading={loadingBreakdown}
                  className={classes["custom-btn-primary"]}
                >
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      
        <Select
          showArrow
          loading={settingStatus}
          style={{ width: "100%" }}
          placeholder="Select status"
          value={machineStatus}
          onChange={(status) => onChangeClick(status)}
          disabled={isDeleted}
        >
          {(
            Object.keys(MachineStatus) as Array<keyof typeof MachineStatus>
          ).map((status: any) => (
            <Select.Option key={status} value={status}>
              <MachineStatusTag status={status} />
            </Select.Option>
          ))}
        </Select>
      
    </>
  );
};

export default MachineStatuses;
