import { Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import Repair from "../../../models/Machine/MachineRepair";
import DeleteMachineRepair from "../DeleteMachineRepair/DeleteMachineRepair";
import EditMachineRepair from "../EditMachineRepair/EditMachineRepair";
import MachineRepairStatus from "../MachineRepairStatus/MachineRepairStatus";
import classes from "./MachineRepairCard.module.css";

const MachineRepairCard = ({ repair }: { repair: Repair }) => {
  const { user: self } = useContext(UserContext);
  return (
    <div className={classes["container"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["first-block"]}>
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
          <div>{repair?.title}</div>
          <div>{repair?.description}</div>
          {repair?.completedBy?.fullName && (
            <div className={classes["completedBy"]}>
              Completed by {repair?.completedBy?.fullName}
            </div>
          )}
        </div>
        <div className={classes["icon-wrapper"]}>
          {self.assignedPermission.hasMachineRepairEdit ? (
            <EditMachineRepair repair={repair} />
          ) : null}
          {self.assignedPermission.hasMachineRepairDelete ? (
            <DeleteMachineRepair id={repair?.id} />
          ) : null}
        </div>
        <div className={classes["status"]}>
          {self.assignedPermission.hasMachineRepairEdit ? (
            <MachineRepairStatus repair={repair} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MachineRepairCard;
