import { ToolOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { useParams } from "react-router";
import { CREATE_REPAIR } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import BreakdownDetail from "../../models/BreakdownDetails";

export interface HoverAddRepairDetailProps {
  detail: BreakdownDetail;
  breakdownId?: number;
  isDeleted?: boolean;
}

export const HoverAddRepairDetail: React.FC<HoverAddRepairDetailProps> = ({
  detail,
  breakdownId,
  isDeleted,
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const { id }: any = useParams();
  const [createRepair, { loading }] = useMutation(CREATE_REPAIR, {
    onCompleted: () => {
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while adding repair detail.");
    },
    refetchQueries: [
      "breakdowns",
      "repairs",
      "getAllHistoryOfEntity",
      "getAllEntityChecklistAndPMSummary",
      "periodicMaintenances",
    ],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { description } = values;
    createRepair({
      variables: {
        createRepairInput: {
          entityId: parseInt(id),
          breakdownDetailId: detail.id,
          breakdownId,
          name: description,
        },
      },
    });
  };
  return (
    <div>
      <Tooltip title="Add Repair">
        <div
          style={{ cursor: "pointer", zIndex: 1 }}
          onClick={() => setVisible(true)}
        >
          <ToolOutlined disabled={isDeleted} />
        </div>
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Add Repair to detail: ${detail.description}`}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
        >
          <Form.Item
            label="Repair"
            name="description"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the repair.",
              },
            ]}
          >
            <Input placeholder="Enter repair" />
          </Form.Item>
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
                  loading={loading}
                  className="primaryButton"
                  disabled={isDeleted}
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
