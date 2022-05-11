import { Tooltip } from "antd";
import moment from "moment";
import { FaRegClock } from "react-icons/fa";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import Breakdown from "../../../models/Transportation/TransportationBreakdown";
import DeleteTransportationBreakdown from "../DeleteTransportationBreakdown/DeleteMachineBreakdown";
import EditTransportationBreakdown from "../EditTransportationBreakdown/EditTransportationBreakdown";
import TransportationBreakdownStatus from "../TransportationBreakdownStatus/TransportationBreakdownStatus";

import classes from "./TransportationBreakdownCard.module.css";

const TransportationBreakdownCard = ({ breakdown }: { breakdown: Breakdown }) => {
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
          <EditTransportationBreakdown breakdown={breakdown} />
          <DeleteTransportationBreakdown id={breakdown?.id} />
        </div>
        <div className={classes["status"]}>
          <TransportationBreakdownStatus breakdown={breakdown} />
        </div>
      </div>
    </div>
  );
};

export default TransportationBreakdownCard;
