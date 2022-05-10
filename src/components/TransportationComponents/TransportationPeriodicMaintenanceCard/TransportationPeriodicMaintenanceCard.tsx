import { Tooltip } from "antd";
import moment from "moment";
import { FaRegBell, FaRegClock } from "react-icons/fa";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import PeriodicMaintenance from "../../../models/Transportation/TransportationPeriodicMaintenance";
import DeleteTransportationPeriodicMaintenance from "../DeleteTransportationPeriodicMaintenance/DeleteTransportationPeriodicMaintenance";
import EditTransportationPeriodicMaintenance from "../EditTransportationPeriodicMaintenance/EditTransportationPeriodicMaintenance";
import TransportationPeriodicMaintenanceStatus from "../TransportationPeriodicMaintenanceStatus/TransportationPeriodicMaintenanceStatus";
import classes from "./TransportationPeriodicMaintenanceCard.module.css";

const TransportationPeriodicMaintenanceCard = ({
  periodicMaintenance,
}: {
  periodicMaintenance: PeriodicMaintenance;
}) => {
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
          <TransportationPeriodicMaintenanceStatus
            periodicMaintenance={periodicMaintenance}
          />
        </div>
      </div>

      <div className={classes["fourth-block"]}>
        <EditTransportationPeriodicMaintenance
          periodicMaintenance={periodicMaintenance}
        />
        <DeleteTransportationPeriodicMaintenance id={periodicMaintenance?.id} />
      </div>
    </div>
  );
};

export default TransportationPeriodicMaintenanceCard;
