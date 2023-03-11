import { useMutation } from "@apollo/client";
import { message, Tooltip, Modal, Form, Input, Row, Col, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { EDIT_BRAND } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import Brand from "../../../models/Brand";


export interface EditBrandsProps {
  brand: Brand;
}

export const EditBrand: React.FC<EditBrandsProps> = ({ brand }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [update, { loading }] = useMutation(EDIT_BRAND, {
    onCompleted: () => {
      message.success("Successfully updated brand.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating brand.");
    },
    refetchQueries: ["brands"],
  });

  const handleCancel = () => {
    //form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name } = values;
    update({
      variables: {
        input: {
          id: brand.id,
          name,
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
        title="Edit Brand"
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
          initialValues={{ name: brand.name}}
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
                  Update
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
