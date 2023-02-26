import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  DatePicker,
  Form,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";

import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useParams } from "react-router";
import { UPDATE_BREAKDOWN } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import EntityBreakdown from "../../../models/Entity/Breakdown";
import classes from "./EditBreakdown.module.css";

const EditBreakdown = ({
  breakdown,
  isDeleted,
}: {
  breakdown: EntityBreakdown;
  isDeleted?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const { id }: any = useParams();
  const [updateBreakdown, { loading: loadingBreakdown }] = useMutation(
    UPDATE_BREAKDOWN,
    {
      onCompleted: () => {
        message.success("Successfully updated breakdown.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating breakdown.");
      },
      refetchQueries: ["breakdowns", "repairs", "getAllHistoryOfEntity"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { type, estimatedDateOfRepair } = values;
    if (!type) {
      message.error("Please select the type.");
      return;
    }
    if (!estimatedDateOfRepair) {
      message.error("Please select the estimated date of repair.");
      return;
    }
    updateBreakdown({
      variables: {
        updateBreakdownInput: {
          id: breakdown.id,
          entityId: parseInt(id),
          type,
          estimatedDateOfRepair,
        },
      },
    });
  };
  return (
    <>
      <div className={classes["info-edit"]}>
        <Tooltip title="Edit">
          <FaRegEdit onClick={() => setVisible(true)} />
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
              label="Type"
              name="type"
              required={false}
              initialValue={breakdown?.type}
              rules={[
                {
                  required: true,
                  message: "Please select the type.",
                },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                getPopupContainer={(trigger) => trigger.parentNode}
                placeholder={"Type"}
                className={"notRounded"}
              >
                {["Breakdown", "Critical"].map((type: string) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
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
                    disabled={isDeleted}
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

export default EditBreakdown;
