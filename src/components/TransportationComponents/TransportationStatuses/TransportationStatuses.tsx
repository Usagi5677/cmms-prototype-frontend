import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import {
  ADD_MACHINE_BREAKDOWN,
  ADD_TRANSPORTATION_BREAKDOWN,
  SET_MACHINE_STATUS,
  SET_TRANSPORTATION_STATUS,
} from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { MachineStatus, TransportationStatus } from "../../../models/Enums";
import MachineStatusTag from "../../common/MachineStatusTag";
import TransportationStatusTag from "../../common/TransportationStatusTag";
import classes from "./TransportationStatuses.module.css";

const TransportationStatuses = ({
  transportationID,
  transportationStatus,
}: {
  transportationID: number;
  transportationStatus: TransportationStatus;
}) => {
  const [setTransportationStatus, { loading: settingStatus }] = useMutation(
    SET_TRANSPORTATION_STATUS,
    {
      onCompleted: () => {
        message.success("Successfully updated transportation status.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error occured.");
      },
      refetchQueries: [
        "getSingleTransportation",
        "getAllBreakdownOfTransportation",
        "getAllRepairOfTransportation",
        "getAllHistoryOfTransportation",
      ],
    }
  );

  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [addTransportationBreakdown, { loading: loadingBreakdown }] =
    useMutation(ADD_TRANSPORTATION_BREAKDOWN, {
      onCompleted: () => {
        message.success("Successfully created breakdown.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating breakdown.");
      },
      refetchQueries: [
        "getAllBreakdownOfTransportation",
        "getSingleTransportation",
      ],
    });

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

    addTransportationBreakdown({
      variables: {
        transportationId: transportationID,
        title,
        description,
      },
    });
  };
  const onChangeClick = async (status: TransportationStatus) => {
    if (status === "Breakdown") {
      setVisible(true);
    } else {
      setTransportationStatus({
        variables: { transportationId: transportationID, status },
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
      <div
        style={{
          display: "flex",
          border: "1px solid #ccc",
          borderRadius: 20,
          padding: "1px 5px 1px 5px",
          alignItems: "center",
          width: 150,
        }}
      >
        <Select
          showArrow
          loading={settingStatus}
          style={{ width: "100%" }}
          bordered={false}
          placeholder="Select status"
          value={transportationStatus}
          onChange={(status) => onChangeClick(status)}
        >
          {(
            Object.keys(TransportationStatus) as Array<keyof typeof TransportationStatus>
          ).map((status: any) => (
            <Select.Option key={status} value={status}>
              <TransportationStatusTag status={status} />
            </Select.Option>
          ))}
        </Select>
      </div>
    </>
  );
};

export default TransportationStatuses;
