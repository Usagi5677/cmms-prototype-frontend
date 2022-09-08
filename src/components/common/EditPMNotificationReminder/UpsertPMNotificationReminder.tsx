import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  InputNumber,
  message,
  Modal,
  Row,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaBell, FaEdit } from "react-icons/fa";
import { UPSERT_PM_NOTIFICATION_REMINDER } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import PeriodicMaintenance from "../../../models/PeriodicMaintenance/PeriodicMaintenance";

import classes from "./UpsertPMNotificationReminder.module.css";

const UpsertPMNotificationReminder = ({
  periodicMaintenance,
  isDeleted,
  isCopy,
  isTemplate,
}: {
  periodicMaintenance: PeriodicMaintenance;
  isDeleted?: boolean | undefined;
  isCopy?: boolean;
  isTemplate?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [upsertNotifReminder, { loading }] = useMutation(
    UPSERT_PM_NOTIFICATION_REMINDER,
    {
      onCompleted: () => {
        message.success("Successfully updated notification reminder.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while updating notification reminder."
        );
      },
      refetchQueries: ["periodicMaintenances"],
    }
  );

  const handleCancel = () => {
    //form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { hour, kilometer, day, week, month } = values;

    upsertNotifReminder({
      variables: {
        periodicMaintenanceId: periodicMaintenance.id,
        type: isTemplate ? "Template" : "Origin",
        hour,
        kilometer,
        day,
        week,
        month,
      },
    });
  };

  let hour;
  let kilometer;
  let day;
  let week;
  let month;

  if (periodicMaintenance.notificationReminder?.length! > 0) {
    periodicMaintenance?.notificationReminder?.map((notif) => {
      if (notif.measurement === "Hour") {
        hour = notif.value;
      } else if (notif.measurement === "Kilometer") {
        kilometer = notif.value;
      } else if (notif.measurement === "Day") {
        day = notif.value;
      } else if (notif.measurement === "Week") {
        week = notif.value;
      } else if (notif.measurement === "Month") {
        month = notif.value;
      }
    });
  }
  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Notification">
        <FaBell
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
        title={"Edit Notification Reminder"}
        width="90vw"
        style={{ maxWidth: 700 }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
        >
          <div className={classes["col"]}>
            <Form.Item
              label="Hour"
              name="hour"
              required={false}
              initialValue={hour}
            >
              <InputNumber placeholder="Hour" style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item
              label="Kilometer"
              name="kilometer"
              required={false}
              initialValue={kilometer}
            >
              <InputNumber placeholder="Kilometer" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Day"
              name="day"
              required={false}
              initialValue={day}
            >
              <InputNumber placeholder="Day" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Week"
              name="week"
              required={false}
              initialValue={week}
            >
              <InputNumber placeholder="Week" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Month"
              name="month"
              required={false}
              initialValue={month}
            >
              <InputNumber placeholder="Month" style={{ width: "100%" }} />
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
                  loading={loading}
                  className={classes["custom-btn-primary"]}
                  disabled={isCopy || isDeleted}
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

export default UpsertPMNotificationReminder;
