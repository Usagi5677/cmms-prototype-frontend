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
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_SPARE_PR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import SparePR from "../../../models/Entity/SparePR";

import classes from "./EditSparePR.module.css";

const EditSparePR = ({
  sparePR,
  isDeleted,
}: {
  sparePR: SparePR;
  isDeleted?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [updateSparePR, { loading: loadingSparePR }] = useMutation(
    EDIT_SPARE_PR,
    {
      onCompleted: () => {
        message.success("Successfully updated spare PR.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating spare PR.");
      },
      refetchQueries: ["sparePRs", "getAllHistoryOfEntity"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const { name, requestedDate } = values;

    if (!name) {
      message.error("Please enter the name.");
      return;
    }
    if (!requestedDate) {
      message.error("Please enter the requested date.");
      return;
    }

    updateSparePR({
      variables: {
        updateSparePrInput: {
          id: sparePR.id,
          name,
          requestedDate,
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
          title={"Edit Spare PR"}
          width="90vw"
          style={{ maxWidth: 700 }}
          destroyOnClose={true}
        >
          <Form
            form={form}
            layout="vertical"
            name="basic"
            onFinish={onFinish}
            id="myForm"
            preserve={false}
          >
            <Form.Item
              label="Name"
              name="name"
              required={false}
              initialValue={sparePR?.name}
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
              initialValue={moment(sparePR?.requestedDate)}
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

export default EditSparePR;
