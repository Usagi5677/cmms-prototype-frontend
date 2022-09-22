import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { CREATE_BREAKDOWN } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./AddBreakdown.module.css";

const AddBreakdown = ({
  entityID,
  isDeleted,
}: {
  entityID: number;
  isDeleted?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [detail, setDetail] = useState("");
  const [details, setDetails] = useState<string[]>([]);
  const [createBreakdown, { loading: loadingBreakdown }] = useMutation(
    CREATE_BREAKDOWN,
    {
      onCompleted: () => {
        message.success("Successfully created breakdown.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating breakdown.");
      },
      refetchQueries: [
        "breakdowns",
        "getSingleEntity",
        "getAllHistoryOfEntity",
        "allEntityBreakdownCount",
      ],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name, type } = values;

    if (!name) {
      message.error("Please enter the name.");
      return;
    }
    if (!type) {
      message.error("Please select the type.");
      return;
    }

    createBreakdown({
      variables: {
        createBreakdownInput: {
          entityId: entityID,
          name,
          type,
          details,
        },
      },
    });
  };

  const submit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") setDetail("");
    else if (event.key === "Enter") {
      event.preventDefault();
      if (detail.trim() === "") return;
      setDetail("");
      setDetails([...details, detail]);
    }
  };
  const removeItem = (index: number) => {
    setDetails([
      ...details.slice(0, index),
      ...details.slice(index + 1, details.length),
    ]);
  };

  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        type="primary"
        onClick={() => setVisible(true)}
        loading={loadingBreakdown}
        className={classes["custom-btn-primary"]}
        disabled={isDeleted}
      >
        Add Breakdown
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Add Breakdown"}
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
            label="Name"
            name="name"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the name.",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            required={false}
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
          <div style={{ marginBottom: 6 }}>Details</div>
          <div style={{ marginBottom: 20 }}>
            {details.map((d: string, index: number) => (
              <div key={index} className={classes["detail"]}>
                {d}
                <CloseCircleOutlined
                  style={{ color: "red" }}
                  onClick={() => {
                    removeItem(index);
                  }}
                />
              </div>
            ))}
          </div>

          <input
            type="text"
            placeholder={"Add detail"}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            onKeyDown={submit}
            style={{
              border: "solid 1px var(--border-2)",
              borderRadius: 5,
              padding: ".5rem",
              width: "100%",
              marginBottom: 20,
            }}
          />
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

export default AddBreakdown;
