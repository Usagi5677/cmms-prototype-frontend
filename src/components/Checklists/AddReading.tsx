import { useMutation } from "@apollo/client";
import { Button, Col, Form, InputNumber, message, Modal, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { UPDATE_READING, UPDATE_WORKING_HOURS } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import Checklist from "../../models/Checklist";
import { Entity } from "../../models/Entity/Entity";
import Machine from "../../models/Machine";
import Transportation from "../../models/Transportation";

export interface AddReadingProps {
  entity: Machine | Transportation | Entity;
  checklist: Checklist;
}

export const AddReading: React.FC<AddReadingProps> = ({
  entity,
  checklist,
}) => {
  const [visible, setVisible] = useState(false);
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
      refetchQueries: ["checklist", "getSingleEntity", "checklistSummary"],
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
      refetchQueries: ["checklist", "getSingleEntity", "checklistSummary"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    setMeterAvailable(true);
  };

  const onFinish = async (values: any) => {
    const { meter, today } = values;
    if (!meter && !today) {
      message.error("Please enter the values.");
    }
    if (meter) {
      updateReading({
        variables: {
          id: checklist.id,
          reading: meter,
        },
      });
    } else if (today) {
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
                  //@ts-ignore
                  // value={reading}
                  // onChange={(val: number) => {
                  //   setReading(val);
                  // }}
                />
              </Form.Item>
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
