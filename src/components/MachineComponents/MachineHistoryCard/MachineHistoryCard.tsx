import { Tooltip } from "antd";
import moment from "moment";
import { FaRegClock } from "react-icons/fa";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import History from "../../../models/History";
import classes from "./MachineHistoryCard.module.css";

const MachineHistoryCard = ({ history }: { history: History }) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["first-block"]}>
          <div className={classes["time-wrapper"]}>
            <Tooltip title="Created At">
              <FaRegClock />
            </Tooltip>
            <div className={classes["time"]}>
              {moment(history?.createdAt).format(
                DATETIME_FORMATS.FULL
              )}
            </div>
          </div>
          {history?.completedBy?.fullName && (
            <div className={classes["completedBy"]}>
              Done by {history?.completedBy?.fullName}
            </div>
          )}
        </div>
        <div className={classes["second-block"]}>
          <div>
            <span className={classes["type"]}>Type: </span>{" "}
            {history?.type}
          </div>
          <div>
            <span className={classes["description"]}>Description: </span>{" "}
            {history?.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineHistoryCard;
