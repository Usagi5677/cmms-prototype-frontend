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
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";

import { useState } from "react";
import { FaEdit, FaMapMarkerAlt, FaRegEdit } from "react-icons/fa";
import {
  EDIT_MACHINE_LOCATION,
  EDIT_MACHINE_USAGE,
} from "../../../api/mutations";
import { ISLANDS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import Machine from "../../../models/Machine";
import classes from "./EditMachineLocation.module.css";

const EditMachineLocation = ({
  machine,
  isDeleted,
}: {
  machine: Machine;
  isDeleted: boolean | undefined;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editMachineLocation, { loading: loadingMachine }] = useMutation(
    EDIT_MACHINE_LOCATION,
    {
      onCompleted: () => {
        message.success("Successfully updated location.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating location.");
      },
      refetchQueries: [
        "getSingleMachine",
        "getAllHistoryOfMachine",
      ],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { location } = values;

    if (!location) {
      message.error("Please enter select the location.");
      return;
    }
    editMachineLocation({
      variables: {
        id: machine?.id,
        location,
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
      <Tooltip title="Edit Location">
        <FaMapMarkerAlt
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
        title={"Edit Location"}
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

export default EditMachineLocation;
