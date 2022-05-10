import { Tooltip } from "antd";
import moment from "moment";
import { FaRegClock } from "react-icons/fa";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import SparePR from "../../../models/Machine/MachineSparePR";
import DeleteMachineSparePR from "../DeleteMachineSparePR/DeleteMachineSparePR";
import EditMachineSparePR from "../EditMachineSparePR/EditMachineSparePR";
import MachineSparePRStatus from "../MachineSparePRStatus/MachineSparePRStatus";
import classes from "./MachineSparePRCard.module.css";

const MachineSparePRCard = ({ sparePR }: { sparePR: SparePR }) => {
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
          <EditMachineSparePR sparePR={sparePR} />
          <DeleteMachineSparePR id={sparePR?.id} />
        </div>
        <div className={classes["status"]}>
          <MachineSparePRStatus sparePR={sparePR} />
        </div>
      </div>
    </div>
  );
};

export default MachineSparePRCard;
