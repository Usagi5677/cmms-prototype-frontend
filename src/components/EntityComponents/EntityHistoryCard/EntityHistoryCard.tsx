import { Tooltip } from "antd";
import moment from "moment";
import { FaRegClock, FaRegUser } from "react-icons/fa";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import EntityHistory from "../../../models/Entity/EntityHistory";
import classes from "./EntityHistoryCard.module.css";

const EntityHistoryCard = ({ history }: { history: EntityHistory }) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["first-block"]}>
        <div className={classes["time-wrapper"]}>
          <Tooltip title="Created At">
            <FaRegClock style={{ fontSize: 12 }} />
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

export default EntityHistoryCard;
