import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { ADD_TRANSPORTATION_SPARE_PR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./AddTransportationSparePR.module.css";

const AddTransportationSparePR = ({ transportationID }: { transportationID: number }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [addTransportationSparePR, { loading: loadingSparePR }] = useMutation(
    ADD_TRANSPORTATION_SPARE_PR,
    {
      onCompleted: () => {
        message.success("Successfully created spare PR.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating spare PR.");
      },
      refetchQueries: ["getAllSparePROfTransportation", "getAllHistoryOfTransportation"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { title, description, requestedDate } = values;

    if (!title) {
      message.error("Please enter the title.");
      return;
    }
    if (!description) {
      message.error("Please enter the description.");
      return;
    }
    if (!requestedDate) {
      message.error("Please enter the requested date.");
      return;
    }

    addTransportationSparePR({
      variables: {
        transportationId: transportationID,
        title,
        description,
        requestedDate,
      },
    });
  };
  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        loading={loadingSparePR}
        className={classes["custom-btn-primary"]}
      >
        Add Spare PR
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Add Spare PR"}
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

          <Form.Item
            label="Requested Date"
            name="requestedDate"
            required={false}
          >
            <DatePicker
              placeholder="Select requested date"
              style={{
                width: 200,
                marginRight: "1rem",
              }}
              allowClear={false}
            />
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
                  loading={loadingSparePR}
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

export default AddTransportationSparePR;
