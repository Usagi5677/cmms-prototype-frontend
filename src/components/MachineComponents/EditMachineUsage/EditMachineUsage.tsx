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

import { useState } from "react";
import { FaEdit, FaRegEdit } from "react-icons/fa";
import { EDIT_MACHINE_USAGE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import Machine from "../../../models/Machine";
import classes from "./EditMachineUsage.module.css";

const EditMachineUsage = ({ machine }: { machine: Machine }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editMachineUsage, { loading: loadingMachine }] = useMutation(EDIT_MACHINE_USAGE, {
    onCompleted: () => {
      message.success("Successfully updated machine usage.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating machine usage.");
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
    const { currentRunningHrs, lastServiceHrs } = values;

    if (!currentRunningHrs) {
      message.error("Please enter the current running hrs.");
      return;
    }
    if (!lastServiceHrs) {
      message.error("Please enter the last service hrs.");
      return;
    }
    editMachineUsage({
      variables: {
        id: machine?.id,
        currentRunningHrs,
        lastServiceHrs,
      },
    });
  };

  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit Usage">
        <FaRegEdit onClick={() => setVisible(true)} />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Edit Usage"}
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
                <InputNumber
                  placeholder="Current running hrs"
                  style={{ width: "100%" }}
                />
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
                <InputNumber
                  placeholder="Last service hrs"
                  style={{ width: "100%" }}
                />
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

export default EditMachineUsage;
