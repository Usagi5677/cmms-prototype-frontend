import { useMutation } from "@apollo/client";
import {
  message,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Select,
  InputNumber,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { CREATE_INTER_SERVICE_COLOR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { BrandSelector } from "../Brand/BrandSelector";
import { TypeSelector } from "../Type/TypeSelector";

export interface CreateInterServiceColorProps {}

export const CreateInterServiceColor: React.FC<
  CreateInterServiceColorProps
> = () => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [brandIds, setBrandIds] = useState<number[]>([]);
  const [typeIds, setTypeIds] = useState<number[]>([]);
  const [create, { loading }] = useMutation(CREATE_INTER_SERVICE_COLOR, {
    onCompleted: () => {
      message.success("Successfully created inter service color.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(
        error,
        "Unexpected error while creating inter service color."
      );
    },
    refetchQueries: ["interServiceColors"],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { measurement, greaterThan, lessThan } = values;
    if (!measurement) {
      message.error("Please select the measurement.");
      return;
    }
    if (!greaterThan) {
      message.error("Please enter the greater than field.");
      return;
    }
    if (!lessThan) {
      message.error("Please select the less than field.");
      return;
    }
    create({
      variables: {
        input: {
          typeId: typeIds,
          brandId: brandIds,
          measurement,
          greaterThan,
          lessThan,
        },
      },
    });
  };

  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        loading={loading}
        className="primaryButton"
      >
        Add Inter Service Color
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Add Inter Service Color"
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
        >
          <Form.Item label="Brand">
            <BrandSelector
              setBrandId={setBrandIds}
              currentId={brandIds}
              width="100%"
              rounded={false}
            />
          </Form.Item>

          <Form.Item label="Type">
            <TypeSelector
              setTypeId={setTypeIds}
              currentId={typeIds}
              width="100%"
            />
          </Form.Item>

          <Form.Item
            label="Measurement"
            name="measurement"
            required={false}
            rules={[
              {
                required: true,
                message: "Please select the measurement.",
              },
            ]}
          >
            <Select
              className="notRounded"
              showArrow
              placeholder="Select measurement"
              allowClear={true}
            >
              {["hr", "km", "days"].map((measurement: string) => (
                <Select.Option key={measurement} value={measurement}>
                  {measurement}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Greater Than"
            name="greaterThan"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the field.",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Less Than"
            name="lessThan"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the field.",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <div style={{ opacity: 0.5, fontStyle:"italic" }}>
            {`If Interservice >= "Greater Than" value, it will
            give red color.`}
          </div>
          <div style={{ opacity: 0.5, fontStyle:"italic" }}>
            {`If Interservice >= "Less Than" and interservice is <= "Greater Than", then it will give orange color.`}
          </div>
          <div style={{ opacity: 0.5, marginBottom: 10, fontStyle:"italic" }}>
            Default is green.
          </div>
          <Row justify="end" gutter={16}>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="ghost"
                  onClick={handleCancel}
                  className="secondaryButton"
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
    </>
  );
};
