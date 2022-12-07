import { PlusCircleOutlined } from "@ant-design/icons";
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
import { useState } from "react";
import { useParams } from "react-router";
import { CREATE_ENTITY } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { BrandSelector } from "../../Config/Brand/BrandSelector";
import { EngineSelector } from "../../common/EngineSelector";
import { DivisionSelector } from "../../Config/Division/DivisionSelector";
import { HullTypeSelector } from "../../Config/HullType/HullTypeSelector";
import { LocationSelector } from "../../Config/Location/LocationSelector";
import { TypeSelector } from "../../Config/Type/TypeSelector";
import classes from "./AddEntity.module.css";

export interface AddEntityProps {
  entityType: "Machine" | "Vehicle" | "Vessel" | "Sub Entity";
  includeSubEntity?: boolean;
}

const AddEntity: React.FC<AddEntityProps> = ({
  entityType,
  includeSubEntity,
}) => {
  const [typeId, setTypeId] = useState<number | null>(null);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [divisionId, setDivisionId] = useState<number | null>(null);
  const [hullTypeId, setHullTypeId] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const { id }: any = useParams();
  const [createEntity, { loading: loadingEntity }] = useMutation(
    CREATE_ENTITY,
    {
      onCompleted: () => {
        message.success("Successfully created entity.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while creating entity.");
      },
      refetchQueries: ["getAllEntity", "getSingleEntity"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    if (!typeId) {
      message.error("Please select the type.");
      return;
    }
    const {
      machineNumber,
      model,
      currentRunning,
      lastService,
      measurement,
      engine,
      registeredDate,
      dimension,
      registryNumber,
    } = values;

    createEntity({
      variables: {
        typeId,
        machineNumber,
        model,
        brandId,
        divisionId,
        locationId,
        currentRunning,
        lastService,
        registeredDate,
        measurement,
        engine,
        parentEntityId: parseInt(id),
        hullTypeId,
        dimension,
        registryNumber,
      },
    });
  };

  return (
    <>
      {includeSubEntity ? (
        <div className={classes["info-edit"]}>
          <Tooltip title={`Add Sub Entity`}>
            <PlusCircleOutlined
              onClick={() => setVisible(true)}
              style={{ fontSize: 16 }}
            />
          </Tooltip>
        </div>
      ) : (
        <Button
          htmlType="button"
          size="middle"
          type="primary"
          onClick={() => setVisible(true)}
          loading={loadingEntity}
          className={classes["custom-btn-primary"]}
        >
          Add {includeSubEntity ? "Sub Entity" : entityType}
        </Button>
      )}

      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Add ${includeSubEntity ? "Sub Entity" : entityType}`}
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
              >
                <Input placeholder="Machine Number" />
              </Form.Item>
            </div>

            <div className={classes["col"]}>
              <Form.Item label="Model" name="model" required={false}>
                <Input placeholder="Model" />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item label="Brand" name="brand" required={false}>
                <BrandSelector setBrandId={setBrandId} />
              </Form.Item>
            </div>
          </div>

          <div className={classes["row"]}>
            {!includeSubEntity && (
              <div className={classes["col"]}>
                <Form.Item label="Division" name="division" required={false}>
                  <DivisionSelector setDivisionId={setDivisionId} />
                </Form.Item>
              </div>
            )}

            <div className={classes["col"]}>
              <Form.Item label="Type" required={true}>
                <TypeSelector setTypeId={setTypeId} />
              </Form.Item>
            </div>
            {!includeSubEntity && (
              <div className={classes["col"]}>
                <Form.Item
                  label="Registered Date"
                  name="registeredDate"
                  required={false}
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
            )}
          </div>

          {!includeSubEntity && (
            <div className={classes["row"]}>
              <div className={classes["col"]}>
                <Form.Item label="Location" name="location" required={false}>
                  <LocationSelector setLocationId={setLocationId} />
                </Form.Item>
              </div>
            </div>
          )}

          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item
                label="Current running"
                name="currentRunning"
                required={false}
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
              >
                <InputNumber
                  placeholder="Last service"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
          </div>

          <div className={classes["row"]}>
            {!includeSubEntity && entityType !== "Vessel" && (
              <div className={classes["col"]}>
                <Form.Item label="Engine" name="engine" required={false}>
                  <EngineSelector />
                </Form.Item>
              </div>
            )}
            {!includeSubEntity && entityType === "Vessel" && (
              <div className={classes["col"]}>
                <Form.Item
                  label="Registry Number"
                  name="registryNumber"
                  required={false}
                >
                  <Input placeholder="Registry Number" />
                </Form.Item>
              </div>
            )}
            <div className={classes["col"]}>
              <Form.Item label="Measurement" name="measurement">
                <Radio.Group buttonStyle="solid" optionType="button">
                  <Radio.Button value="km">KM</Radio.Button>
                  <Radio.Button value="hr">HR</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>

          {!includeSubEntity && entityType === "Vessel" && (
            <div className={classes["row"]}>
              <div className={classes["col"]}>
                <Form.Item label="Hull Type" required={false}>
                  <HullTypeSelector setHullTypeId={setHullTypeId} />
                </Form.Item>
              </div>
              <div className={classes["col"]}>
                <Form.Item label="Dimension" name="dimension" required={false}>
                  <InputNumber
                    placeholder="Dimension"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
            </div>
          )}

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

export default AddEntity;
