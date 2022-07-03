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

const EditMachineUsage = ({
  machine,
  isDeleted,
}: {
  machine: Machine;
  isDeleted: boolean | undefined;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editMachineUsage, { loading: loadingMachine }] = useMutation(
    EDIT_MACHINE_USAGE,
    {
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
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { currentRunning, lastService } = values;

    if (!currentRunning) {
      message.error("Please enter the current running value.");
      return;
    }
    if (!lastService) {
      message.error("Please enter the last service value.");
      return;
    }
    editMachineUsage({
      variables: {
        id: machine?.id,
        currentRunning,
        lastService,
      },
    });
  };

  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit Usage">
        <FaRegEdit
          onClick={() => setVisible(true)}
          style={{
            pointerEvents: isDeleted ? "none" : "auto",
            color: isDeleted ? "grey" : "inherit"
          }}
        />
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
                label="Current running value"
                name="currentRunning"
                required={false}
                initialValue={machine?.currentRunning}
                rules={[
                  {
                    required: true,
                    message: "Please enter the current running value.",
                  },
                ]}
                style={{ paddingRight: 40 }}
              >
                <InputNumber
                  placeholder="Current running value"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
