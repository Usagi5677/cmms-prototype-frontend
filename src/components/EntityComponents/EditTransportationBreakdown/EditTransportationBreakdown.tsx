import { useMutation } from "@apollo/client";
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_TRANSPORTATION_BREAKDOWN } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import Breakdown from "../../../models/Transportation/TransportationBreakdown";
import classes from "./EditTransportationBreakdown.module.css";

const EditTransportationBreakdown = ({ breakdown }: { breakdown: Breakdown }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editTransportationBreakdown, { loading: loadingBreakdown }] =
    useMutation(EDIT_TRANSPORTATION_BREAKDOWN, {
      onCompleted: () => {
        message.success("Successfully updated breakdown.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating breakdown.");
      },
      refetchQueries: [
        "getAllBreakdownOfTransportation",
        "getAllHistoryOfTransportation",
      ],
    });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { title, description, estimatedDateOfRepair } = values;

    if (!title) {
      message.error("Please enter the title.");
      return;
    }
    if (!description) {
      message.error("Please enter the description.");
      return;
    }
    if (!estimatedDateOfRepair) {
      message.error("Please select the estimated date of repair.");
      return;
    }
    editTransportationBreakdown({
      variables: {
        id: breakdown.id,
        title,
        description,
        estimatedDateOfRepair,
      },
    });
  };
  return (
    <>
      <div className={classes["info-edit"]}>
        <Tooltip title="Edit">
          <FaEdit onClick={() => setVisible(true)} />
        </Tooltip>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          title={"Edit Breakdown"}
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
            <Form.Item
              label="Title"
              name="title"
              required={false}
              initialValue={breakdown?.title}
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
              initialValue={breakdown?.description}
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
              label="Estimated Date of Repair"
              name="estimatedDateOfRepair"
              required={false}
              initialValue={
                breakdown?.estimatedDateOfRepair
                  ? moment(breakdown?.estimatedDateOfRepair)
                  : moment()
              }
            >
              <DatePicker
                placeholder="Select Estimated Date of Repair"
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
                    loading={loadingBreakdown}
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
    </>
  );
};

export default EditTransportationBreakdown;
