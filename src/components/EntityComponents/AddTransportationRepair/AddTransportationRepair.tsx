import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { ADD_TRANSPORTATION_REPAIR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./AddTransportationRepair.module.css";

const AddTransportationRepair = ({ transportationID }: { transportationID: number }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [addTransportationRepair, { loading: loadingRepair }] = useMutation(
    ADD_TRANSPORTATION_REPAIR,
    {
      onCompleted: () => {
        message.success("Successfully created repair.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating repair.");
      },
      refetchQueries: [
        "getAllRepairOfTransportation",
        "getAllHistoryOfTransportation",
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

    addTransportationRepair({
      variables: {
        transportationId: transportationID,
        title,
        description,
      },
    });
  };
  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        loading={loadingRepair}
        className={classes["custom-btn-primary"]}
      >
        Add Repair
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Add Repair"}
        width="90vw"
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
                  loading={loadingRepair}
                  className={classes["custom-btn-primary"]}
                >
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default AddTransportationRepair;
