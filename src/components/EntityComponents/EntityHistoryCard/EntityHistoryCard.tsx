import { Tooltip } from "antd";
import moment from "moment";
import {
  FaMapMarker,
  FaMapMarkerAlt,
  FaRegClock,
  FaRegUser,
} from "react-icons/fa";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import EntityHistory from "../../../models/Entity/EntityHistory";
import classes from "./EntityHistoryCard.module.css";

const EntityHistoryCard = ({ history }: { history: EntityHistory }) => {
  const isSmallDevice = useIsSmallDevice();
  return (
    <div className={classes["container"]}>
      <div>{history?.description}</div>
      <div
        style={{
          display: "flex",
          fontSize: "80%",
          flexDirection: isSmallDevice ? "column" : "row",
          opacity: 0.5,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "1rem",
          }}
        >
          <Tooltip title="Created At">
            <FaRegClock />
          </Tooltip>
          <div className={classes["time"]}>
            {moment(history?.createdAt).format(DATETIME_FORMATS.TIME)}
          </div>
        </div>
        {history?.completedBy?.fullName && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "1rem",
            }}
          >
            <Tooltip title="Done by">
              <FaRegUser />
            </Tooltip>
            <div className={classes["doneBy"]}>
              {history?.completedBy?.fullName}{" "}
              {"(" + history?.completedBy?.rcno + ")"}
            </div>
          </div>
        )}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaMapMarkerAlt style={{ marginRight: 5 }} />
            <div>{history?.location}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityHistoryCard;
