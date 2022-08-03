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
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_MACHINE } from "../../../api/mutations";
import { ISLANDS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import Machine from "../../../models/Machine";
import { TypeSelector } from "../../Type/TypeSelector";
import classes from "./EditMachine.module.css";

const EditMachine = ({
  machine,
  isDeleted,
}: {
  machine: Machine;
  isDeleted: boolean | undefined;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [typeId, setTypeId] = useState<number | null>(null);

  const [editMachine, { loading: loadingMachine }] = useMutation(EDIT_MACHINE, {
    onCompleted: () => {
      message.success("Successfully updated machine.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating machine.");
    },
    refetchQueries: [
      "getSingleMachine",
      "getAllHistoryOfMachine",
      "singleMachineUsageHistory",
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
      zone,
      location,
      lastService,
      registeredDate,
      measurement,
    } = values;

    if (!machineNumber) {
      message.error("Please enter the machine number.");
      return;
    }
    if (!model) {
      message.error("Please enter the model.");
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
    if (!lastService) {
      message.error("Please enter the last service value.");
      return;
    }
    if (!measurement) {
      message.error("Please select the measurement.");
      return;
    }
    editMachine({
      variables: {
        id: machine?.id,
        machineNumber,
        model,
        typeId,
        zone,
        location,
        // currentRunning,
        lastService,
        registeredDate,
        measurement,
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

  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit">
        <FaEdit
          onClick={() => setVisible(true)}
          style={{
            pointerEvents: isDeleted ? "none" : "auto",
            color: isDeleted ? "grey" : "inherit",
          }}
        />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Edit Machine"}
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
          <div className={classes["row"]}>
            <div className={classes["col"]}>
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
            </div>
            <div className={classes["col"]}>
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
            </div>
          </div>

          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item label="Type" required={false}>
                <TypeSelector
                  entityType="Machine"
                  setTypeId={setTypeId}
                  currentId={machine?.type?.id}
                />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Registered Date"
                name="registeredDate"
                required={false}
                initialValue={moment(machine?.registeredDate)}
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
            </div>
            <div className={classes["col"]}>
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
                <Select
                  showArrow
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={"Location"}
                  options={options}
                />
              </Form.Item>
            </div>
          </div>

          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Last service value"
                name="lastService"
                required={false}
                initialValue={machine?.lastService}
                rules={[
                  {
                    required: true,
                    message: "Please enter the last service value.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Last service value"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
          </div>
          <div className={classes["col"]}>
            <Form.Item
              label="Measurement"
              name="measurement"
              initialValue={machine?.measurement}
            >
              <Radio.Group buttonStyle="solid" optionType="button">
                <Radio.Button value="km">KM</Radio.Button>
                <Radio.Button value="hr">Hr</Radio.Button>
              </Radio.Group>
            </Form.Item>
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
