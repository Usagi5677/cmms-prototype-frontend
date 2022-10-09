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
import { BrandSelector } from "../../common/BrandSelector";
import { DepartmentSelector } from "../../common/DepartmentSelector";
import { EngineSelector } from "../../common/EngineSelector";
import { LocationSelector } from "../../Config/Location/LocationSelector";
import { TypeSelector } from "../../Config/Type/TypeSelector";
import classes from "./AddEntity.module.css";

export interface AddEntityProps {
  entityType: "Machine" | "Vehicle" | "Vessel";
  includeSubEntity?: boolean;
}

const AddEntity: React.FC<AddEntityProps> = ({
  entityType,
  includeSubEntity,
}) => {
  const [typeId, setTypeId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
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
    const {
      machineNumber,
      model,
      brand,
      department,
      currentRunning,
      lastService,
      measurement,
      engine,
      registeredDate,
    } = values;

    createEntity({
      variables: {
        typeId,
        machineNumber,
        model,
        brand,
        department,
        locationId,
        currentRunning,
        lastService,
        registeredDate,
        measurement,
        engine,
        parentEntityId: parseInt(id),
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
                <BrandSelector />
              </Form.Item>
            </div>
          </div>

          <div className={classes["row"]}>
            {!includeSubEntity && (
              <div className={classes["col"]}>
                <Form.Item
                  label="Department"
                  name="department"
                  required={false}
                >
                  <DepartmentSelector />
                </Form.Item>
              </div>
            )}

            <div className={classes["col"]}>
              <Form.Item label="Type" required={false}>
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
            <div className={classes["col"]}>
              <Form.Item label="Engine" name="engine" required={false}>
                <EngineSelector />
              </Form.Item>
            </div>
            <div className={classes["col"]}>
              <Form.Item label="Measurement" name="measurement">
                <Radio.Group buttonStyle="solid" optionType="button">
                  <Radio.Button value="km">KM</Radio.Button>
                  <Radio.Button value="hr">H</Radio.Button>
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
