import { Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegBell, FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import PeriodicMaintenance from "../../../models/Machine/MachinePeriodicMaintenance";
import DeleteMachinePeriodicMaintenance from "../DeleteMachinePeriodicMaintenance/DeleteMachinePeriodicMaintenance";
import EditMachinePeriodicMaintenance from "../EditMachinePeriodicMaintenance/EditMachinePeriodicMaintenance";
import MachinePeriodicMaintenanceStatus from "../MachinePeriodicMaintenanceStatus/MachinePeriodicMaintenanceStatus";
import classes from "./MachinePeriodicMaintenanceCard.module.css";

const MachinePeriodicMaintenanceCard = ({
  periodicMaintenance,
}: {
  periodicMaintenance: PeriodicMaintenance;
}) => {
  const { user: self } = useContext(UserContext);
  return (
    <div className={classes["container"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["first-block"]}>
          <div>{periodicMaintenance?.id}</div>
          <div className={classes["time-wrapper"]}>
            <Tooltip title="Created At">
              <FaRegClock />
            </Tooltip>
            <div className={classes["time"]}>
              {moment(periodicMaintenance?.createdAt).format(
                DATETIME_FORMATS.DAY_MONTH_YEAR
              )}
            </div>
          </div>
          <div className={classes["time-wrapper"]}>
            <Tooltip title="Fixed Date">
              <FaRegClock />
            </Tooltip>
            <div className={classes["time"]}>
              {moment(periodicMaintenance?.fixedDate).format(
                DATETIME_FORMATS.FULL
              )}
            </div>
          </div>
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
          {self.assignedPermission.hasMachinePeriodicMaintenanceEdit ? (
            <MachinePeriodicMaintenanceStatus
              periodicMaintenance={periodicMaintenance}
            />
          ) : null}
        </div>
      </div>

      <div className={classes["fourth-block"]}>
        {self.assignedPermission.hasMachinePeriodicMaintenanceEdit ? (
          <EditMachinePeriodicMaintenance
            periodicMaintenance={periodicMaintenance}
          />
        ) : null}
        {self.assignedPermission.hasMachinePeriodicMaintenanceDelete ? (
          <DeleteMachinePeriodicMaintenance id={periodicMaintenance?.id} />
        ) : null}
      </div>
    </div>
  );
};

export default MachinePeriodicMaintenanceCard;
