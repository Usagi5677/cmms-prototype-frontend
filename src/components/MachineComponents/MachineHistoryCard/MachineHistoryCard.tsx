import { Tooltip } from "antd";
import moment from "moment";
import { FaRegClock, FaRegUser, FaUserAlt } from "react-icons/fa";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import History from "../../../models/Machine/MachineHistory";
import classes from "./MachineHistoryCard.module.css";

const MachineHistoryCard = ({ history }: { history: History }) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["first-block"]}>
        <div className={classes["time-wrapper"]}>
          <Tooltip title="Created At">
            <FaRegClock style={{fontSize: 12}}/>
          </Tooltip>
          <div className={classes["time"]}>
            {moment(history?.createdAt).format(DATETIME_FORMATS.FULL)}
          </div>
        </div>

        {history?.completedBy?.fullName && (
          <div className={classes["doneBy-wrapper"]}>
          <Tooltip title="Done by">
            <FaRegUser />
          </Tooltip>
          <div className={classes["doneBy"]}>
          {history?.completedBy?.fullName}{" "}
            {"(" + history?.completedBy?.rcno + ")"}
          </div>
        </div>
        )}
      </div>
      <div className={classes["second-block"]}>
        <div>
          <span className={classes["type"]}>Type: </span> {history?.type}
        </div>
        <div>
          <span className={classes["description"]}>Description: </span>{" "}
          {history?.description}
        </div>
        <div>
          <span className={classes["description"]}>Location: </span>{" "}
          {history?.location}
        </div>
      </div>
    </div>
  );
};

export default MachineHistoryCard;
