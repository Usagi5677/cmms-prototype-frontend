import { useMutation } from "@apollo/client";
import { Button, Col, Form, InputNumber, message, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { PERIODIC_MAINTENANCE_UPDATE_READING } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import PeriodicMaintenance from "../../../models/PeriodicMaintenance/PeriodicMaintenance";
import classes from "./PeriodicMaintenanceUpdateReading.module.css";

const PeriodicMaintenanceUpdateReading = ({
  periodicMaintenance,
  isDeleted,
  isOlder,
}: {
  periodicMaintenance: PeriodicMaintenance;
  isDeleted?: boolean;
  isOlder?: boolean;
}) => {
  const [form] = useForm();
  const [updateReading, { loading: loadingEntity }] = useMutation(
    PERIODIC_MAINTENANCE_UPDATE_READING,
    {
      onCompleted: () => {
        message.success("Successfully updated reading.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating reading.");
      },
      refetchQueries: [
        "getAllHistoryOfEntity",
        "periodicMaintenances",
        "periodicMaintenanceSummary",
        "getSingleEntity",
        "getAllPMWithPagination",
      ],
    }
  );
  const onFinish = async (values: any) => {
    const { reading } = values;

    updateReading({
      variables: {
        id: periodicMaintenance.id,
        reading,
      },
    });
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      name="basic"
      onFinish={onFinish}
      id="myForm"
    >
      <div className={classes["row"]} style={{ marginTop: 10 }}>
        <div className={classes["col"]}>
          <Form.Item
            name="reading"
            required={false}
            style={{ marginBottom: 0 }}
            initialValue={periodicMaintenance?.currentMeterReading}
          >
            <InputNumber
              addonBefore={`Meter Reading`}
              placeholder={`Enter Meter Reading`}
              style={{ width: "100%" }}
              min={0}
            />
          </Form.Item>
        </div>
        <div className={classes["col"]}>
          <Form.Item style={{ marginBottom: 20 }}>
            <Button
              type="primary"
              htmlType="submit"
              className={classes["btn"]}
              loading={loadingEntity}
              disabled={isDeleted || isOlder}
            >
              Add
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default PeriodicMaintenanceUpdateReading;
