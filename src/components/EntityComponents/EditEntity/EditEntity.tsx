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
import moment from "moment";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { EDIT_ENTITY } from "../../../api/mutations";
import { DEPARTMENTS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import { Entity } from "../../../models/Entity/Entity";
import { LocationSelector } from "../../Config/Location/LocationSelector";
import { TypeSelector } from "../../Config/Type/TypeSelector";
import classes from "./EditEntity.module.css";

const EditEntity = ({
  entity,
  isDeleted,
}: {
  entity: Entity;
  isDeleted?: boolean | undefined;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [typeId, setTypeId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);

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
        locationId,
        currentMileage,
        lastServiceMileage,
        registeredDate,
        measurement,
        engine,
      },
    });
  };

  let departmentOptions: any = [];
  DEPARTMENTS?.map((department: string) => {
    departmentOptions.push({
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
                  className="notRounded"
                  showArrow
                  style={{ width: "100%" }}
                  showSearch
                  options={departmentOptions}
                  placeholder={"Department"}
                />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item label="Type" required={false}>
                <TypeSelector
                  entityType={entity?.type?.entityType}
                  setTypeId={setTypeId}
                  currentId={entity?.type?.id}
                />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item
                label="Registered Date"
                name="registeredDate"
                required={false}
                initialValue={
                  moment(entity?.registeredDate).isValid()
                    ? moment(entity?.registeredDate)
                    : undefined
                }
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
              <Form.Item label="Location" name="location" required={false}>
                <LocationSelector
                  currentId={entity?.location?.id}
                  currentName={entity?.location?.name}
                  setLocationId={setLocationId}
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
