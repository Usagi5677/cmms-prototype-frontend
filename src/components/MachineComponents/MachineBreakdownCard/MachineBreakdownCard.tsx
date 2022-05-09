import { Tooltip } from "antd";
import moment from "moment";
import { FaRegClock } from "react-icons/fa";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import Breakdown from "../../../models/Breakdown";
import DeleteMachineBreakdown from "../DeleteMachineBreakdown/DeleteMachineBreakdown";
import EditMachineBreakdown from "../EditMachineBreakdown/EditMachineBreakdown";
import MachineBreakdownStatus from "../MachineBreakdownStatus/MachineBreakdownStatus";
import classes from "./MachineBreakdownCard.module.css";

const MachineBreakdownCard = ({ breakdown }: { breakdown: Breakdown }) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["first-block"]}>
          <div>{breakdown?.id}</div>
          <div className={classes["time-wrapper"]}>
            <Tooltip title="Created At">
              <FaRegClock />
            </Tooltip>
            <div className={classes["time"]}>
              {moment(breakdown?.createdAt).format(
                DATETIME_FORMATS.DAY_MONTH_YEAR
              )}
            </div>
          </div>
          <div>{breakdown?.title}</div>
          <div>{breakdown?.description}</div>
          {breakdown?.completedBy?.fullName && (
            <div className={classes["completedBy"]}>
              Completed by {breakdown?.completedBy?.fullName}
            </div>
          )}
        </div>
        <div className={classes["icon-wrapper"]}>
          <EditMachineBreakdown breakdown={breakdown} />
          <DeleteMachineBreakdown id={breakdown?.id} />
        </div>
        <div className={classes["status"]}>
          <MachineBreakdownStatus breakdown={breakdown} />
        </div>
      </div>
    </div>
  );
};

export default MachineBreakdownCard;
