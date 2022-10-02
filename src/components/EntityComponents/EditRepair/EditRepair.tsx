import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { UPDATE_REPAIR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import Repair from "../../../models/Entity/Repair";
import classes from "./EditRepair.module.css";

const EditRepair = ({
  repair,
  isDeleted,
}: {
  repair: Repair;
  isDeleted?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [updateRepair, { loading: loadingRepair }] = useMutation(
    UPDATE_REPAIR,
    {
      onCompleted: () => {
        message.success("Successfully updated repair.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating repair.");
      },
      refetchQueries: ["repairs", "breakdowns", "getAllHistoryOfEntity"],
    }
  );

  const handleCancel = () => {
    //form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name } = values;

    updateRepair({
      variables: {
        updateRepairInput: {
          id: repair.id,
          name,
        },
      },
    });
  };

  return (
    <>
      <div className={classes["info-edit"]}>
        <Tooltip title="Edit">
          <FaEdit onClick={() => setVisible(true)} />
        </Tooltip>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          title={"Edit Repair"}
          width="90vw"
          style={{ maxWidth: 700 }}
          destroyOnClose
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
                  initialValue={repair?.name}
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
                    Edit
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default EditRepair;
