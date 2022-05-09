import { Tooltip } from "antd";
import moment from "moment";
import { FaRegClock } from "react-icons/fa";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import Repair from "../../../models/Repair";
import DeleteMachineRepair from "../DeleteMachineRepair/DeleteMachineRepair";
import EditMachineRepair from "../EditMachineRepair/EditMachineRepair";
import MachineRepairStatus from "../MachineRepairStatus/MachineRepairStatus";
import classes from "./MachineRepairCard.module.css";

const MachineRepairCard = ({ repair }: { repair: Repair }) => {
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
          <EditMachineRepair repair={repair} />
          <DeleteMachineRepair id={repair?.id} />
        </div>
        <div className={classes["status"]}>
          <MachineRepairStatus repair={repair} />
        </div>
      </div>
    </div>
  );
};

export default MachineRepairCard;
