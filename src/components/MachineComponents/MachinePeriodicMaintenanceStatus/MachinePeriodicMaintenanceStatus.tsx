import { useMutation } from "@apollo/client";
import { message, Select } from "antd";
import { SET_MACHINE_PERIODIC_MAINTENANCE_STATUS } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { PeriodicMaintenanceStatus } from "../../../models/Enums";
import PeriodicMaintenance from "../../../models/Machine/MachinePeriodicMaintenance";

import PeriodicMaintenanceStatusTag from "../../common/PeriodicMaintenanceStatusTag";

const MachinePeriodicMaintenanceStatus = ({
  periodicMaintenance,
  isDeleted,
}: {
  periodicMaintenance: PeriodicMaintenance;
  isDeleted: boolean | undefined;
}) => {
  const [setMachinePeriodicMaintenanceStatus, { loading: settingStatus }] =
    useMutation(SET_MACHINE_PERIODIC_MAINTENANCE_STATUS, {
      onCompleted: () => {
        message.success("Successfully updated periodic maintenance status.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error occured.");
      },
      refetchQueries: [
        "getAllPeriodicMaintenanceOfMachine",
        "getAllHistoryOfMachine",
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
        value={periodicMaintenance?.status}
        onChange={(status) =>
          setMachinePeriodicMaintenanceStatus({
            variables: { id: periodicMaintenance?.id, status },
          })
        }
        disabled={isDeleted}
      >
        {(
          Object.keys(PeriodicMaintenanceStatus) as Array<
            keyof typeof PeriodicMaintenanceStatus
          >
        ).map((status: any) => (
          <Select.Option key={status} value={status}>
            <PeriodicMaintenanceStatusTag status={status} />
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default MachinePeriodicMaintenanceStatus;
