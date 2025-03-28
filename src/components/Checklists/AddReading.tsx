import { useMutation } from "@apollo/client";
import { Button, Col, Form, InputNumber, message, Modal, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { UPDATE_READING, UPDATE_WORKING_HOURS } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import Checklist from "../../models/Checklist";
import { Entity } from "../../models/Entity/Entity";

export interface AddReadingProps {
  entity: Entity;
  checklist: Checklist;
}

export const AddReading: React.FC<AddReadingProps> = ({
  entity,
  checklist,
}) => {
  const [visible, setVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const [meterAvailable, setMeterAvailable] = useState(true);
  const [form] = useForm();

  const [updateReading, { loading: updatingReading }] = useMutation(
    UPDATE_READING,
    {
      onCompleted: () => {
        handleCancel();
      },
      onError: (err) => {
        errorMessage(err, "Error adding reading.");
      },
      refetchQueries: [
        "checklist",
        "getSingleEntity",
        "checklistSummary",
        "periodicMaintenances",
      ],
    }
  );

  const [updateToday, { loading: updatingToday }] = useMutation(
    UPDATE_WORKING_HOURS,
    {
      onCompleted: () => {
        handleCancel();
      },
      onError: (err) => {
        errorMessage(err, "Error adding reading.");
      },
      refetchQueries: [
        "checklist",
        "getSingleEntity",
        "checklistSummary",
        "periodicMaintenances",
      ],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    setMeterAvailable(true);
    setCurrentValue(0);
  };

  const onFinish = async (values: any) => {
    const { meter, today } = values;
    if (meter < 0 && today < 0) {
      console.log(meter);
      message.error("Please enter the values.");
    }
    if (meter >= 0) {
      updateReading({
        variables: {
          id: checklist.id,
          reading: meter,
        },
      });
    } else if (today >= 0) {
      updateToday({
        variables: {
          id: checklist.id,
          newHrs: today,
        },
      });
    }
  };

  return (
    <div>
      <Button className="primaryButton" onClick={() => setVisible(true)}>
        Add Reading
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Add Reading`}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
        >
          {meterAvailable ? (
            <>
              <Form.Item label="Meter reading" name="meter" required={false}>
                <InputNumber
                  addonAfter={`${entity.measurement}`}
                  placeholder={`Enter ${entity.measurement}`}
                  style={{ width: "100%", marginBottom: ".5rem" }}
                  min={0}
                  onChange={(e) => setCurrentValue(e)}
                  //@ts-ignore
                  // value={reading}
                  // onChange={(val: number) => {
                  //   setReading(val);
                  // }}
                />
              </Form.Item>
              {currentValue !== 0 && (
                <div>
                  Difference between previous meter reading is{" "}
                  {currentValue - entity?.currentRunning!}
                </div>
              )}

              <span style={{ opacity: 0.7 }}>
                <a
                  style={{ textDecoration: "underline" }}
                  onClick={() => setMeterAvailable(false)}
                >
                  Meter not available or broken
                </a>
              </span>
            </>
          ) : (
            <>
              <Form.Item label={`Daily reading`} name="today" required={false}>
                <InputNumber
                  addonAfter={`${entity.measurement}`}
                  placeholder={`Enter ${entity.measurement}`}
                  style={{ width: "100%", marginBottom: ".5rem" }}
                  max={entity.measurement === "hr" ? 24 : undefined}
                  min={0}
                />
              </Form.Item>
            </>
          )}
          <Row justify="end" gutter={16}>
            <Col>
              <Button
                type="ghost"
                onClick={handleCancel}
                className="secondaryButton"
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updatingReading || updatingToday}
                  className="primaryButton"
                >
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
