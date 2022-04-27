import { Tooltip } from "antd";
import { FaRegBell, FaRegClock } from "react-icons/fa";
import PeriodicMaintenance from "../../../models/PeriodicMaintenance";
import DeleteMachinePeriodicMaintenance from "../DeleteMachinePeriodicMaintenance/DeleteMachinePeriodicMaintenance";
import EditMachinePeriodicMaintenance from "../EditMachinePeriodicMaintenance/EditMachinePeriodicMaintenance";
import MachinePeriodicMaintenanceStatus from "../MachinePeriodicMaintenanceStatus/MachinePeriodicMaintenanceStatus";
import classes from "./MachinePeriodicMaintenanceCard.module.css";

const MachinePeriodicMaintenanceCard = ({
  periodicMaintenance,
}: {
  periodicMaintenance: PeriodicMaintenance;
}) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["first-block"]}>
          <div>{periodicMaintenance?.title}</div>
          <div>{periodicMaintenance?.description}</div>
          {periodicMaintenance?.completedBy?.fullName && (
            <div className={classes["completedBy"]}>
              Completed by {periodicMaintenance?.completedBy?.fullName}
            </div>
          )}
        </div>
        <div className={classes["second-block"]}>
          <div className={classes["second-block-wrapper"]}>
            <Tooltip title="Period">
              <FaRegClock />
            </Tooltip>
            <div className={classes["second-block-title"]}>
              {periodicMaintenance?.period} hrs
            </div>
          </div>
          <div className={classes["second-block-wrapper"]}>
            <Tooltip title="Notification reminder">
              <FaRegBell />
            </Tooltip>
            <div className={classes["second-block-title"]}>
              {periodicMaintenance?.notificationReminder} hrs
            </div>
          </div>
        </div>
        <div className={classes["third-block"]}>
          <MachinePeriodicMaintenanceStatus
            periodicMaintenance={periodicMaintenance}
          />
        </div>
      </div>

      <div className={classes["fourth-block"]}>
        <EditMachinePeriodicMaintenance
          periodicMaintenance={periodicMaintenance}
        />
        <DeleteMachinePeriodicMaintenance id={periodicMaintenance?.id} />
      </div>
    </div>
  );
};

export default MachinePeriodicMaintenanceCard;
