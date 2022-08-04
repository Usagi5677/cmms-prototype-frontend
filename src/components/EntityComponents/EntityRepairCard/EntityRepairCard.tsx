import { Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import EntityRepair from "../../../models/Entity/EntityRepair";
import DeleteEntityRepair from "../DeleteEntityRepair/DeleteEntityRepair";
import EditEntityRepair from "../EditEntityRepair/EditEntityRepair";
import EntityRepairStatus from "../EntityRepairStatus/EntityRepairStatus";
import classes from "./EntityRepairCard.module.css";

const EntityRepairCard = ({
  repair,
  isDeleted,
}: {
  repair: EntityRepair;
  isDeleted?: boolean | undefined;
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
        {self.assignedPermission.hasEntityRepairEdit ? (
          <EntityRepairStatus repair={repair} isDeleted={isDeleted}/>
        ) : null}
      </div>
      <div className={classes["icon-wrapper"]}>
        {self.assignedPermission.hasEntityRepairEdit && !isDeleted ? (
          <EditEntityRepair repair={repair} />
        ) : null}
        {self.assignedPermission.hasEntityRepairDelete && !isDeleted ? (
          <DeleteEntityRepair id={repair?.id} />
        ) : null}
      </div>
    </div>
  </div>
  );
};

export default EntityRepairCard;
