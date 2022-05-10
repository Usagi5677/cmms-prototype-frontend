import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Radio, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useContext, useState } from "react";
import { ADD_TRANSPORTATION_CHECKLIST_ITEM } from "../../../api/mutations";
import UserContext from "../../../contexts/UserContext";
import { errorMessage } from "../../../helpers/gql";
import classes from "./AddTransportationChecklist.module.css";

const AddTransportationChecklist = ({ transportationID }: { transportationID: number }) => {
  const { user } = useContext(UserContext);

  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [addTransportationChecklistItem, { loading: loadingChecklist }] = useMutation(
    ADD_TRANSPORTATION_CHECKLIST_ITEM,
    {
      onCompleted: () => {
        message.success("Successfully created checklist.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating checklist.");
      },
      refetchQueries: ["getSingleTransportation"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { description, type } = values;

    if (!description) {
      message.error("Please enter the description.");
      return;
    }
    if (!type) {
      message.error("Please select a type.");
      return;
    }
    addTransportationChecklistItem({
      variables: {
        transportationId: transportationID,
        description,
        type,
      },
    });
  };
  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        loading={loadingChecklist}
        className={classes["custom-btn-primary"]}
      >
        Add Checklist
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Add Checklist"}
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
            label="Description"
            name="description"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the description.",
              },
            ]}
            style={{ paddingRight: 40 }}
          >
            <Input placeholder="Description" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Radio.Group buttonStyle="solid" optionType="button">
              <Radio.Button value="Daily">Daily</Radio.Button>
              <Radio.Button value="Weekly">Weekly</Radio.Button>
            </Radio.Group>
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
                  loading={loadingChecklist}
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

export default AddTransportationChecklist;
