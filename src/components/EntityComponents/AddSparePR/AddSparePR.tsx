import { CloseCircleOutlined } from "@ant-design/icons";
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
import { CREATE_SPARE_PR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./AddSparePR.module.css";

const AddSparePR = ({ entityID }: { entityID: number }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [detail, setDetail] = useState("");
  const [details, setDetails] = useState<string[]>([]);
  const [createSparePR, { loading: loadingSparePR }] = useMutation(
    CREATE_SPARE_PR,
    {
      onCompleted: () => {
        message.success("Successfully created spare PR.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating spare PR.");
      },
      refetchQueries: ["sparePRs", "getAllHistoryOfEntity"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    setDetail("");
    setDetails([]);
  };

  const onFinish = async (values: any) => {
    const { name, requestedDate } = values;

    if (!name) {
      message.error("Please enter the name.");
      return;
    }

    createSparePR({
      variables: {
        createSparePrInput: {
          entityId: entityID,
          name,
          requestedDate,
          details,
        },
      },
    });

    setDetail("");
    setDetails([]);
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
          <div style={{ marginBottom: 6 }}>Details</div>
          <div style={{ marginBottom: 20 }}>
            {details.map((d: string, index: number) => (
              <div key={index} className={classes["spare-pr-detail"]}>
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
              marginBottom: 20
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

export default AddSparePR;
