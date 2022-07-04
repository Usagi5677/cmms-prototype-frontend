import { useMutation } from "@apollo/client";
import { message, Select } from "antd";
import { SET_TRANSPORTATION_REPAIR_STATUS } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { RepairStatus } from "../../../models/Enums";
import Repair from "../../../models/Transportation/TransportationRepair";
import RepairStatusTag from "../../common/RepairStatusTag";

const TransportationRepairStatus = ({
  repair,
  isDeleted,
}: {
  repair: Repair;
  isDeleted?: boolean | undefined;
}) => {
  const [setTransportationRepairStatus, { loading: settingStatus }] =
    useMutation(SET_TRANSPORTATION_REPAIR_STATUS, {
      onCompleted: () => {
        message.success("Successfully updated repair status.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error occured.");
      },
      refetchQueries: [
        "getAllRepairOfTransportation",
        "getAllHistoryOfTransportation",
      ],
    });

  return (
    <div
      style={{
        display: "flex",
        padding: "1px 5px 1px 5px",
        alignItems: "center",
        width: 150,
      }}
    >
      <Select
        showArrow
        loading={settingStatus}
        style={{ width: "100%" }}
        placeholder="Select status"
        value={repair?.status}
        onChange={(status) =>
          setTransportationRepairStatus({
            variables: { id: repair?.id, status },
          })
        }
        disabled={isDeleted}
      >
        {(Object.keys(RepairStatus) as Array<keyof typeof RepairStatus>).map(
          (status: any) => (
            <Select.Option key={status} value={status}>
              <RepairStatusTag status={status} />
            </Select.Option>
          )
        )}
      </Select>
    </div>
  );
};

export default TransportationRepairStatus;
