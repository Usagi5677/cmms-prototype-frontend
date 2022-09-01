import { WarningOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { ADD_CHECKLIST_ITEM_ISSUE } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import Checklist from "../../models/Checklist";
import ChecklistItemModel from "../../models/ChecklistItem";

export interface AddChecklistItemIssueProps {
  checklist: Checklist;
  item: ChecklistItemModel;
}

export const AddChecklistItemIssue: React.FC<AddChecklistItemIssueProps> = ({
  checklist,
  item,
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [create, { loading }] = useMutation(ADD_CHECKLIST_ITEM_ISSUE, {
    onCompleted: () => {
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while adding issue.");
    },
    refetchQueries: ["checklist", "checklistSummary"],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { issue } = values;
    create({
      variables: {
        checklistId: checklist.id,
        itemId: item.id,
        comment: issue,
      },
    });
  };
  return (
    <div>
      <Tooltip title="Add issue">
        <div
          className="deleteButton"
          style={{ marginLeft: ".5rem" }}
          onClick={() => setVisible(true)}
        >
          <WarningOutlined />
        </div>
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Add issue to checklist item: ${item.description}`}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
        >
          <Form.Item
            label="Issue"
            name="issue"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the issue.",
              },
            ]}
          >
            <Input placeholder="Enter issue" />
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
