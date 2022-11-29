import { useMutation } from "@apollo/client";
import { message, Button, Modal, Form, Input, Row, Col } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { CREATE_BRAND } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";


export interface CreateBrandProps {}

export const CreateBrand: React.FC<CreateBrandProps> = () => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [create, { loading }] = useMutation(CREATE_BRAND, {
    onCompleted: () => {
      message.success("Successfully created brand.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while creating brand.");
    },
    refetchQueries: ["brands"],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name } = values;
    create({
      variables: {
        input: {
          name,
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
        Add Brand
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Add Brand"
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
                message: "Please enter a name.",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
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
