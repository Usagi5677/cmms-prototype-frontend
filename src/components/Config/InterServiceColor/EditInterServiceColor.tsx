import { useMutation } from "@apollo/client";
import {
  message,
  Tooltip,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  InputNumber,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { EDIT_INTER_SERVICE_COLOR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import InterServiceColor from "../../../models/InterServiceColor";
import { BrandSelector } from "../Brand/BrandSelector";
import { TypeSelector } from "../Type/TypeSelector";

export interface EditInterServiceColorProps {
  interServiceColor: InterServiceColor;
}

export const EditInterServiceColor: React.FC<EditInterServiceColorProps> = ({
  interServiceColor,
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [brandIds, setBrandIds] = useState<number>(
    interServiceColor?.brand?.id!
  );
  const [typeIds, setTypeIds] = useState<number>(interServiceColor?.type?.id!);
  const [update, { loading }] = useMutation(EDIT_INTER_SERVICE_COLOR, {
    onCompleted: () => {
      message.success("Successfully updated inter service color.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, error.graphQLErrors[0].message);
    },
    refetchQueries: ["interServiceColors"],
  });

  const handleCancel = () => {
    //form.resetFields();
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
    update({
      variables: {
        input: {
          id: interServiceColor.id,
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
      <Tooltip title="Edit" placement="top">
        <FaRegEdit
          className="editButton"
          onClick={() => setVisible(true)}
          style={{ marginRight: ".5rem" }}
          // size="20px"
        />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Edit Inter service color"
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
              currentId={interServiceColor?.brand?.id}
              currentName={interServiceColor?.brand?.name}
              width="100%"
              rounded={false}
            />
          </Form.Item>

          <Form.Item label="Type">
            <TypeSelector
              setTypeId={setTypeIds}
              currentId={interServiceColor?.type?.id}
              currentName={interServiceColor?.type?.name}
              width="100%"
            />
          </Form.Item>

          <Form.Item
            label="Measurement"
            name="measurement"
            required={false}
            initialValue={interServiceColor?.measurement}
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
            initialValue={interServiceColor?.greaterThan}
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
            initialValue={interServiceColor?.lessThan}
            rules={[
              {
                required: true,
                message: "Please enter the field.",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <div style={{ opacity: 0.5 }}>
            {`If inter service >= 'greater than' value, it will
            give red.`}
          </div>
          <div style={{ opacity: 0.5 }}>
            {`If inter service >= 'less than' and inter service is <= 'greater than', it will give orange`}
          </div>
          <div style={{ opacity: 0.5, marginBottom: 10 }}>
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
                  Edit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
