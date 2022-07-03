import { Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import Repair from "../../../models/Transportation/TransportationRepair";
import DeleteTransportationRepair from "../DeleteTransportationRepair/DeleteTransportationRepair";
import EditTransportationRepair from "../EditTransportationRepair/EditTransportationRepair";
import TransportationRepairStatus from "../TransportationRepairStatus/TransportationRepairStatus";
import classes from "./TransportationRepairCard.module.css";

const TransportationRepairCard = ({
  repair,
  isDeleted,
}: {
  repair: Repair;
  isDeleted: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);
  return (
    <div className={classes["container"]}>
    <div className={classes["first-block"]}>
      <div>
        <div>{repair?.id}</div>
        <div className={classes["time-wrapper"]}>
          <Tooltip title="Created At">
            <FaRegClock />
          </Tooltip>
          <div className={classes["time"]}>
            {moment(repair?.createdAt).format(
              DATETIME_FORMATS.DAY_MONTH_YEAR
            )}
          </div>
        </div>
      </div>
      <div className={classes["col-wrapper"]}>
        {repair?.completedBy?.fullName && (
          <div className={classes["col"]}>
            <div className={classes["col-title"]}>Completed by:</div>
            <div className={classes["completedBy"]}>
              {repair?.completedBy?.fullName}
            </div>
          </div>
        )}

        <div className={classes["col"]}>
          <div className={classes["col-title"]}>Title:</div>
          <div>{repair?.title}</div>
        </div>
        <div className={classes["col"]}>
          <div className={classes["col-title"]}>Description:</div>
          <div>{repair?.description}</div>
        </div>
      </div>
    </div>
    <div className={classes["second-block"]}>
      <div className={classes["status"]}>
        {self.assignedPermission.hasTransportationRepairEdit ? (
          <TransportationRepairStatus repair={repair} isDeleted={isDeleted}/>
        ) : null}
      </div>
      <div className={classes["icon-wrapper"]}>
        {self.assignedPermission.hasTransportationRepairEdit && !isDeleted ? (
          <EditTransportationRepair repair={repair} />
        ) : null}
        {self.assignedPermission.hasTransportationRepairDelete && !isDeleted ? (
          <DeleteTransportationRepair id={repair?.id} />
        ) : null}
      </div>
    </div>
  </div>
  );
};

export default TransportationRepairCard;
