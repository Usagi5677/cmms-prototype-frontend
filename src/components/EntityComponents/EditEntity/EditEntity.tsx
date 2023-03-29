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
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";

import { memo, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { EDIT_ENTITY } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { Entity } from "../../../models/Entity/Entity";
import { BrandSelector } from "../../Config/Brand/BrandSelector";
import { EngineSelector } from "../../common/EngineSelector";
import { DivisionSelector } from "../../Config/Division/DivisionSelector";
import { HullTypeSelector } from "../../Config/HullType/HullTypeSelector";
import { LocationSelector } from "../../Config/Location/LocationSelector";
import { TypeSelector } from "../../Config/Type/TypeSelector";
import classes from "./EditEntity.module.css";

const EditEntity = ({
  entity,
  isDeleted,
  fontSize,
  includeSubEntity,
}: {
  entity: Entity;
  isDeleted?: boolean | undefined;
  fontSize?: number;
  includeSubEntity?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [typeId, setTypeId] = useState<number | null>(null);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [divisionId, setDivisionId] = useState<number | null>(null);
  const [hullTypeId, setHullTypeId] = useState<number | null>(null);
  const [engineId, setEngineId] = useState<number | null>(null);

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
      "getAllEntity",
    ],
  });

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    const {
      machineNumber,
      model,
      measurement,
      engine,
      registeredDate,
      dimension,
      registryNumber,
    } = values;

    editEntity({
      variables: {
        input: {
          id: entity?.id,
          typeId,
          machineNumber,
          model,
          brandId,
          divisionId,
          locationId,
          registeredDate,
          measurement,
          engineId,
          hullTypeId,
          dimension,
          registryNumber,
        },
      },
    });
  };
  const formItemLayout = {
    labelCol: {
      span: 6,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      },
    },
    wrapperCol: { span: 24 },
  };
  return (
    <div className={classes["info-edit"]}>
      <Tooltip title="Edit">
        <FaRegEdit
          onClick={() => setVisible(true)}
          style={{
            pointerEvents: isDeleted ? "none" : "auto",
            color: isDeleted ? "grey" : "inherit",
            fontSize: fontSize ? fontSize : "inherit",
          }}
        />
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Edit ${includeSubEntity ? "Sub Entity" : "Entity"}`}
        width="90vw"
        style={{ maxWidth: 700 }}
      >
        <Form
          form={form}
          layout="horizontal"
          name="form_in_modal"
          onFinish={onFinish}
          id="myForm"
          {...formItemLayout}
        >
          <Form.Item
            label="Machine Number"
            name="machineNumber"
            required={false}
            initialValue={entity?.machineNumber}
          >
            <Input placeholder="Machine Number" />
          </Form.Item>
          <Form.Item
            label="Model"
            name="model"
            required={false}
            initialValue={entity?.model}
          >
            <Input placeholder="Model" />
          </Form.Item>
          <Form.Item label="Brand" name="brand" required={false}>
            <BrandSelector
              setBrandId={setBrandId}
              currentId={entity?.brand?.id}
            />
          </Form.Item>
          {!includeSubEntity && (
            <Form.Item label="Division" name="division" required={false}>
              <DivisionSelector
                setDivisionId={setDivisionId}
                currentId={entity?.division?.id}
              />
            </Form.Item>
          )}
          <Form.Item label="Type" required={false}>
            <TypeSelector
              setTypeId={setTypeId}
              entityType={entity?.type?.entityType}
              currentId={entity?.type?.id}
            />
          </Form.Item>
          {!includeSubEntity && (
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
          )}

          {!includeSubEntity && (
            <Form.Item label="Location" name="location" required={false}>
              <LocationSelector
                currentId={entity?.location?.id}
                currentName={entity?.location?.name}
                setLocationId={setLocationId}
              />
            </Form.Item>
          )}
          {entity?.type?.entityType !== "Sub Entity" &&
            entity?.type?.entityType !== "Vessel" && (
              <Form.Item label="Engine" required={false}>
                <EngineSelector
                  setEngineId={setEngineId}
                  currentId={entity?.engine?.id}
                />
              </Form.Item>
            )}
          {!includeSubEntity && entity?.type?.entityType === "Vessel" && (
            <Form.Item
              label="Registry Number"
              name="registryNumber"
              required={false}
              initialValue={entity?.registryNumber}
            >
              <Input placeholder="Registry Number" />
            </Form.Item>
          )}
          <Form.Item
            label="Measurement"
            name="measurement"
            initialValue={entity?.measurement}
          >
            <Radio.Group buttonStyle="solid" optionType="button">
              <Radio.Button value="km">KM</Radio.Button>
              <Radio.Button value="hr">HR</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {!includeSubEntity && entity?.type?.entityType === "Vessel" && (
            <Form.Item label="Hull Type" required={false}>
              <HullTypeSelector
                setHullTypeId={setHullTypeId}
                currentId={entity?.hullType?.id}
              />
            </Form.Item>
          )}
          {!includeSubEntity && entity?.type?.entityType === "Vessel" && (
            <Form.Item
              label="Dimension"
              name="dimension"
              required={false}
              initialValue={entity?.dimension}
            >
              <InputNumber placeholder="Dimension" style={{ width: "100%" }} />
            </Form.Item>
          )}
          <Form.Item
            label="Capacity"
            name="capacity"
            required={false}
            initialValue={entity?.capacity}
          >
            <Input placeholder="Capacity" />
          </Form.Item>

          <Form.Item
            label="VIN/SN"
            name="identificationNumber"
            required={false}
            initialValue={entity?.identificationNumber}
          >
            <Input placeholder="VIN/SN" />
          </Form.Item>

          <Form.Item
            label="FA Code"
            name="faCode"
            required={false}
            initialValue={entity?.faCode}
          >
            <Input placeholder="FA Code" />
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
                  loading={loadingEntity}
                  className="primaryButton"
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

export default memo(EditEntity);
