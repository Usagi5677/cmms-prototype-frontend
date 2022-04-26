import { CloseCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { FaEdit, FaRegBell, FaRegClock } from "react-icons/fa";
import PeriodicMaintenance from "../../models/PeriodicMaintenance";
import SelectMachinePeriodicMaintenance from "../SelectMachinePeriodicMaintenance/SelectMachinePeriodicMaintenance";
import classes from "./PeriodicMaintenanceCard.module.css";

const PeriodicMaintenanceCard = ({
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
          <div className={classes["completedBy"]}>
            Completed by {periodicMaintenance?.completedBy?.fullName}
          </div>
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
          <SelectMachinePeriodicMaintenance
            periodicMaintenance={periodicMaintenance}
          />
        </div>
      </div>

      <div className={classes["fourth-block"]}>
        <FaEdit className={classes["edit-icon"]} />
        <CloseCircleOutlined className={classes["delete-icon"]} />
      </div>
    </div>
  );
};

export default PeriodicMaintenanceCard;
