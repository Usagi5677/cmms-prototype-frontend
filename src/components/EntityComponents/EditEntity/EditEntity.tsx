import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_ENTITY } from "../../../api/mutations";
import { DEPARTMENTS, ISLANDS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import EntityModel from "../../../models/Entity/EntityModel";
import { TypeSelector } from "../../Type/TypeSelector";
import classes from "./EditEntity.module.css";

const EditEntity = ({
  entity,
  isDeleted,
}: {
  entity: EntityModel;
  isDeleted?: boolean | undefined;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [typeId, setTypeId] = useState<number | null>(null);

  const [editEntity, { loading: loadingEntity }] = useMutation(EDIT_ENTITY, {
    onCompleted: () => {
      message.success("Successfully updated entity.");
      handleCancel();
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating entity.");
    },
    refetchQueries: [
      "getSingleEntity",
      "getAllHistoryOfEntity",
      "singleEntityUsageHistory",
    ],
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const {
      machineNumber,
      model,
      department,
      zone,
      location,
      currentRunning,
      lastService,
      currentMileage,
      lastServiceMileage,
      measurement,
      engine,
      registeredDate,
    } = values;

    editEntity({
      variables: {
        id: entity?.id,
        typeId,
        machineNumber,
        model,
        department,
        zone,
        location,
        currentRunning,
        lastService,
        currentMileage,
        lastServiceMileage,
        registeredDate,
        measurement,
        engine,
      },
    });
  };

  let options: any = [];
  ISLANDS?.map((island: string) => {
    options.push({
      value: island,
      label: island,
    });
  });

  let departmentOptions: any = [];
  DEPARTMENTS?.map((department: string) => {
    options.push({
      value: department,
      label: department,
    });
  });
  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit">
        <FaEdit
          onClick={() => setVisible(true)}
          style={{
            pointerEvents: isDeleted ? "none" : "auto",
            color: isDeleted ? "grey" : "inherit",
          }}
        />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Edit Entity"}
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
                label="Machine Number"
                name="machineNumber"
                required={false}
                initialValue={entity?.machineNumber}
              >
                <Input placeholder="Machine Number" />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Model"
                name="model"
                required={false}
                initialValue={entity?.model}
              >
                <Input placeholder="Model" />
              </Form.Item>
            </div>
          </div>

          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Department"
                name="department"
                required={false}
                initialValue={entity?.department}
              >
                <Select
                  showArrow
                  style={{ width: "100%" }}
                  showSearch
                  options={departmentOptions}
                  placeholder={"Department"}
                />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Type"
                required={false}
                initialValue={entity?.type?.id}
              >
                <TypeSelector entityType={""} setTypeId={setTypeId} />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Registered Date"
                name="registeredDate"
                required={false}
                initialValue={moment(entity?.registeredDate)}
              >
                <DatePicker
                  placeholder="Select registered date"
                  style={{
                    width: 200,
                    marginRight: "1rem",
                  }}
                  allowClear={false}
                />
              </Form.Item>
            </div>
          </div>

          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Zone"
                name="zone"
                required={false}
                initialValue={entity?.zone}
              >
                <Input placeholder="Zone" />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Location"
                name="location"
                required={false}
                initialValue={entity?.location}
              >
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
              <Form.Item
                label="Current running"
                name="currentRunning"
                required={false}
                initialValue={entity?.currentRunning}
              >
                <InputNumber
                  placeholder="Current running"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Last service"
                name="lastService"
                required={false}
                initialValue={entity?.lastService}
              >
                <InputNumber
                  placeholder="Last service"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
          </div>
          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Current mileage"
                name="currentMileage"
                required={false}
                initialValue={entity?.currentMileage}
              >
                <InputNumber
                  placeholder="Current mileage"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Last service mileage"
                name="lastServiceMileage"
                required={false}
                initialValue={entity?.lastServiceMileage}
              >
                <InputNumber
                  placeholder="Last service mileage"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
          </div>

          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Engine"
                name="engine"
                required={false}
                initialValue={entity?.engine}
              >
                <Input placeholder="Engine" />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Measurement"
                name="measurement"
                initialValue={entity?.measurement}
              >
                <Radio.Group buttonStyle="solid" optionType="button">
                  <Radio.Button value="km">KM</Radio.Button>
                  <Radio.Button value="h">H</Radio.Button>
                </Radio.Group>
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
                  loading={loadingEntity}
                  className={classes["custom-btn-primary"]}
                >
                  Edit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EditEntity;
