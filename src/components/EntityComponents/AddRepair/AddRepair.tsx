import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { useParams } from "react-router";
import { CREATE_REPAIR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./AddRepair.module.css";

const AddEntityRepairRequest = ({ isDeleted }: { isDeleted?: boolean }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const { id }: any = useParams();
  const [createRepair, { loading: loadingRepair }] = useMutation(
    CREATE_REPAIR,
    {
      onCompleted: () => {
        message.success("Successfully created repair.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating repair.");
      },
      refetchQueries: ["repairs", "getAllHistoryOfEntity"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name } = values;
    if (!name) {
      message.error("Please enter the detail.");
      return;
    }
    createRepair({
      variables: {
        createRepairInput: {
          entityId: parseInt(id),
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
        type="primary"
        onClick={() => setVisible(true)}
        loading={loadingRepair}
        className={classes["custom-btn-primary"]}
        disabled={isDeleted}
      >
        Add Repair
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Add Repair"}
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
          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Detail"
                name="name"
                required={false}
                rules={[
                  {
                    required: true,
                    message: "Please enter the detail.",
                  },
                ]}
              >
                <Input placeholder="Detail" />
              </Form.Item>
            </div>
          </div>

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
                  loading={loadingRepair}
                  className={classes["custom-btn-primary"]}
                  disabled={isDeleted}
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

export default AddEntityRepairRequest;
