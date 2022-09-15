import { MessageOutlined, WarningOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { ADD_BREAKDOWN_COMMENT } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import BreakdownDetail from "../../models/BreakdownDetails";
import Breakdown from "../../models/Entity/Breakdown";

export interface AddBreakdownCommentProps {
  breakdown: Breakdown;
  detail: BreakdownDetail;
  type?: string;
  isDeleted?: boolean;
}

export const AddBreakdownComment: React.FC<AddBreakdownCommentProps> = ({
  breakdown,
  detail,
  type = "Remark",
  isDeleted
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [create, { loading }] = useMutation(ADD_BREAKDOWN_COMMENT, {
    onCompleted: () => {
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while adding remark.");
    },
    refetchQueries: ["repairs", "breakdowns", "getAllHistoryOfEntity"],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { comment } = values;
    create({
      variables: {
        createBreakdownCommentInput: {
          breakdownId: breakdown.id,
          detailId: detail.id,
          description: comment,
          type,
        },
      },
    });
  };
  return (
    <div>
      <Tooltip title="Add remark">
        <div
          style={{ marginLeft: ".5rem", cursor: "pointer", zIndex: 1 }}
          onClick={() => setVisible(true)}
        >
          <MessageOutlined disabled={isDeleted} />
        </div>
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Add remark to breakdown detail: ${detail.description}`}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
        >
          <Form.Item
            label="Remark"
            name="comment"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the remark.",
              },
            ]}
          >
            <Input placeholder="Enter remark" />
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
