import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import { ADD_ENTITY_REPAIR_REQUEST } from "../../../api/mutations";
import { GET_USERS_WITH_PERMISSION } from "../../../api/queries";
import { ISLANDS, REPAIR_LOCATION } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import User from "../../../models/User";
import SearchAPSUser from "../../common/SearchAPS";
import classes from "./AddEntityRepairRequest.module.css";

const AddEntityRepairRequest = ({
  entityID,
  userData,
}: {
  entityID: number;
  userData: User[];
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [addEntityRepairRequest, { loading: loadingRepair }] = useMutation(
    ADD_ENTITY_REPAIR_REQUEST,
    {
      onCompleted: () => {
        message.success("Successfully created repair request.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating repair request.");
      },
      refetchQueries: ["getAllRepairRequestOfEntity", "getAllHistoryOfEntity"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const {
      internal,
      projectName,
      location,
      reason,
      additionalInfo,
      attendInfo,
      operatorId,
      supervisorId,
      projectManagerId,
    } = values;

    addEntityRepairRequest({
      variables: {
        entityId: entityID,
        internal,
        projectName,
        location,
        reason,
        additionalInfo,
        attendInfo,
        operatorId,
        supervisorId,
        projectManagerId,
      },
    });
  };

  let options: any = [];
  REPAIR_LOCATION?.map((loc: string) => {
    options.push({
      value: loc,
      label: loc,
    });
  });

  let userOptions: any = [];
  userData?.map((user: User) => {
    userOptions.push({
      value: user.id,
      label: user.fullName + " " + "(" + user.rcno + ")",
    });
  });

  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        type="primary"
        onClick={() => setVisible(true)}
        loading={loadingRepair}
        className={classes["custom-btn-primary"]}
      >
        Repair Request
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Repair Request"}
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
              <Form.Item name="internal" initialValue={true}>
                <Radio.Group buttonStyle="solid" optionType="button">
                  <Radio.Button value={true}>Internal</Radio.Button>
                  <Radio.Button value={false}>External</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item label="Operator" name="operatorId">
                <Select
                  showArrow
                  style={{ width: "100%" }}
                  options={userOptions}
                />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item label="Supervisor" name="supervisorId">
                <Select
                  showArrow
                  style={{ width: "100%" }}
                  options={userOptions}
                />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item label="Project Manager" name="projectManagerId">
                <Select
                  showArrow
                  style={{ width: "100%" }}
                  options={userOptions}
                />
              </Form.Item>
            </div>
          </div>
          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Project Name"
                name="projectName"
                required={false}
              >
                <Input placeholder="Project Name" />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item label="Location" name="location" required={false}>
                <Select
                  showArrow
                  style={{ width: "100%" }}
                  showSearch
                  options={options}
                  placeholder={"Location"}
                />
              </Form.Item>
            </div>
          </div>

          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item label="Reason" name="reason" required={false}>
                <TextArea rows={4} placeholder="Reason" />
              </Form.Item>
            </div>
          </div>
          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Additional Information"
                name="additionalInfo"
                required={false}
              >
                <TextArea rows={4} placeholder="Additional Information" />
              </Form.Item>
            </div>
          </div>
          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="How it's attended?"
                name="attendInfo"
                required={false}
              >
                <TextArea rows={4} placeholder="Attend Information" />
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
