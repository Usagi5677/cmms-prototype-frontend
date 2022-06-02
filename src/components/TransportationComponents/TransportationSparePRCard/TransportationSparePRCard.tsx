import { Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import SparePR from "../../../models/Transportation/TransportationSparePR";
import DeleteTransportationSparePR from "../DeleteTransportationSparePR/DeleteTransportationSparePR";
import EditTransportationSparePR from "../EditTransportationSparePR/EditTransportationSparePR";
import TransportationSparePRStatus from "../TransportationSparePRStatus/TransportationSparePRStatus";

import classes from "./TransportationSparePRCard.module.css";

const TransportationSparePRCard = ({ sparePR }: { sparePR: SparePR }) => {
  const { user: self } = useContext(UserContext);
  return (
    <div className={classes["container"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["first-block"]}>
          <div>{sparePR?.id}</div>
          <div className={classes["time-wrapper"]}>
            <Tooltip title="Requested Date">
              <FaRegClock />
            </Tooltip>
            <div className={classes["time"]}>
              {moment(sparePR?.requestedDate).format(
                DATETIME_FORMATS.DAY_MONTH_YEAR
              )}
            </div>
          </div>
          <div>{sparePR?.title}</div>
          <div>{sparePR?.description}</div>
          {sparePR?.completedBy?.fullName && (
            <div className={classes["completedBy"]}>
              Completed by {sparePR?.completedBy?.fullName}
            </div>
          )}
        </div>
        <div className={classes["icon-wrapper"]}>
          {self.assignedPermission.hasTransportationSparePREdit ? (
            <EditTransportationSparePR sparePR={sparePR} />
          ) : null}
          {self.assignedPermission.hasTransportationSparePRDelete ? (
            <DeleteTransportationSparePR id={sparePR?.id} />
          ) : null}
        </div>
        <div className={classes["status"]}>
          {self.assignedPermission.hasTransportationSparePREdit ? (
            <TransportationSparePRStatus sparePR={sparePR} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TransportationSparePRCard;
