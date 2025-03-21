import { useMutation } from "@apollo/client";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
} from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { EDIT_PERIODIC_MAINTENANCE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import PeriodicMaintenance from "../../../models/PeriodicMaintenance/PeriodicMaintenance";
import classes from "./EditPeriodicMaintenance.module.css";

const EditPeriodicMaintenance = ({
  periodicMaintenance,
  isDeleted,
  isCopy,
}: {
  periodicMaintenance: PeriodicMaintenance;
  isDeleted?: boolean | undefined;
  isCopy?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const [checkbox, setCheckbox] = useState(periodicMaintenance.recur);
  const [form] = useForm();

  const [editPeriodicMaintenance, { loading }] = useMutation(
    EDIT_PERIODIC_MAINTENANCE,
    {
      onCompleted: () => {
        message.success("Successfully updated periodic maintenance template.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while updating periodic maintenance template."
        );
      },
      refetchQueries: ["periodicMaintenances", "getAllTemplatesOfOriginPM"],
    }
  );

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name, measurement, value } = values;

    editPeriodicMaintenance({
      variables: {
        id: periodicMaintenance.id,
        name,
        measurement,
        value,
        recur: checkbox,
      },
    });
  };
  const onchange = (e: CheckboxChangeEvent) => {
    setCheckbox(e.target.checked);
  };
  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit">
        <FaRegEdit
          onClick={() => setVisible(true)}
          style={{
            pointerEvents: isDeleted || isCopy ? "none" : "auto",
            color: isDeleted || isCopy ? "grey" : "inherit",
          }}
        />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Edit Periodic Maintenance"}
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
            label={"Name"}
            name="name"
            required={false}
            initialValue={periodicMaintenance.name}
            rules={[
              {
                required: true,
                message: "Please enter the name.",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Measurement"
            name="measurement"
            required={false}
            initialValue={periodicMaintenance.measurement}
            rules={[
              {
                required: true,
                message: "Please select the measurement.",
              },
            ]}
          >
            <Select
              className="notRounded"
              showArrow
              placeholder="Select measurement"
              allowClear={true}
            >
              {["Hour", "Kilometer", "Day", "Week", "Month"].map(
                (measurement: string) => (
                  <Select.Option key={measurement} value={measurement}>
                    {measurement}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="recur"
            required={false}
            initialValue={checkbox}
            valuePropName="checked"
          >
            <Checkbox onChange={(e) => onchange(e)}>Recur</Checkbox>
          </Form.Item>
          {checkbox && (
            <Form.Item
              label={
                <>
                  Value
                  <span style={{ paddingLeft: 10, opacity: 0.5 }}>
                    For example, value = 3 will be every hour 3 / km 3
                  </span>
                </>
              }
              name="value"
              required={false}
              initialValue={periodicMaintenance.value}
              rules={[
                {
                  required: true,
                  message: "Please enter the value.",
                },
              ]}
            >
              <InputNumber placeholder="Value" style={{ width: "100%" }} min={0} />
            </Form.Item>
          )}
          <Row justify="end" gutter={16}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="primaryButton"
                disabled={isDeleted || isCopy}
              >
                Save
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EditPeriodicMaintenance;
