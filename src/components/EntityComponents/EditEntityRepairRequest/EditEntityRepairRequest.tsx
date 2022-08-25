import { useMutation } from "@apollo/client";
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
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_ENTITY_REPAIR_REQUEST } from "../../../api/mutations";
import { REPAIR_LOCATION } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import EntityRepairRequest from "../../../models/Entity/EntityRepairRequest";
import User from "../../../models/User";
import { RepairRequestUserData } from "../../../pages/Entity/ViewEntity/ViewRepair/ViewRepair";
import SearchAPSUser from "../../common/SearchAPS";

import classes from "./EditEntityRepairRequest.module.css";

const EditEntityRepairRequest = ({
  repair,
  userData,
  isDeleted
}: {
  repair: EntityRepairRequest;
  userData?: RepairRequestUserData;
  isDeleted?: boolean
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const [editEntityRepairRequest, { loading: loadingRepair }] = useMutation(
    EDIT_ENTITY_REPAIR_REQUEST,
    {
      onCompleted: () => {
        message.success("Successfully updated repair.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating repair.");
      },
      refetchQueries: ["getAllRepairRequestOfEntity", "getAllHistoryOfEntity"],
    }
  );

  const handleCancel = () => {
    //form.resetFields();
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

    editEntityRepairRequest({
      variables: {
        id: repair.id,
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

  let admin = userData?.admin;
  let user = userData?.user;

  let locationOptions: any = [];
  let adminOptions: any = [];
  let userOptions: any = [];

  REPAIR_LOCATION?.map((loc: string) => {
    locationOptions.push({
      value: loc,
      label: loc,
    });
  });
  admin?.map((user: User) => {
    adminOptions.push({
      value: user.id,
      label: user.fullName + " " + "(" + user.rcno + ")",
    });
  });
  user?.map((user: User) => {
    userOptions.push({
      value: user.id,
      label: user.fullName + " " + "(" + user.rcno + ")",
    });
  });

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
          title={"Edit Repair Request"}
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
                  label="Internal"
                  name="internal"
                  initialValue={repair?.internal}
                >
                  <Radio.Group buttonStyle="solid" optionType="button">
                    <Radio.Button value={true}>Internal</Radio.Button>
                    <Radio.Button value={false}>External</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>

            <div className={classes["row"]}>
              <div className={classes["col"]}>
                <Form.Item
                  label="Project Name"
                  name="projectName"
                  required={false}
                  initialValue={repair?.projectName}
                >
                  <Input placeholder="Project Name" />
                </Form.Item>
              </div>
              <div className={classes["col"]}>
                <Form.Item
                  label="Location"
                  name="location"
                  required={false}
                  initialValue={repair?.location}
                >
                  <Select
                    showArrow
                    style={{ width: "100%" }}
                    showSearch
                    options={locationOptions}
                    placeholder={"Location"}
                  />
                </Form.Item>
              </div>
            </div>
            <div className={classes["row"]}>
              <div className={classes["col"]}>
                <Form.Item
                  label="Operator"
                  name="operatorId"
                  initialValue={repair?.operatorId}
                >
                  <Select
                    showArrow
                    style={{ width: "100%" }}
                    options={userOptions}
                    placeholder={"Operator"}
                  />
                </Form.Item>
              </div>
              <div className={classes["col"]}>
                <Form.Item
                  label="Supervisor"
                  name="supervisorId"
                  initialValue={repair?.supervisorId}
                >
                  <Select
                    showArrow
                    style={{ width: "100%" }}
                    options={adminOptions}
                    placeholder={"Supervisor"}
                  />
                </Form.Item>
              </div>
              <div className={classes["col"]}>
                <Form.Item
                  label="Project Manager"
                  name="projectManagerId"
                  initialValue={repair?.projectManagerId}
                >
                  <Select
                    showArrow
                    style={{ width: "100%" }}
                    options={adminOptions}
                    placeholder={"Project Manager"}
                  />
                </Form.Item>
              </div>
            </div>
            <div className={classes["row"]}>
              <div className={classes["col"]}>
                <Form.Item
                  label="Reason"
                  name="reason"
                  required={false}
                  initialValue={repair?.reason}
                >
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
                  initialValue={repair?.additionalInfo}
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
                  initialValue={repair?.attendInfo}
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

export default EditEntityRepairRequest;
