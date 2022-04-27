import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import SparePR from "../../../models/SparePR";
import DeleteMachineSparePR from "../DeleteMachineSparePR/DeleteMachineSparePR";
import EditMachineSparePR from "../EditMachineSparePR/EditMachineSparePR";
import MachineSparePRStatus from "../MachineSparePRStatus/MachineSparePRStatus";
import classes from "./MachineSparePRCard.module.css";

const MachineSparePRCard = ({ sparePR }: { sparePR: SparePR }) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["first-block"]}>
          <div>
            {moment(sparePR?.requestedDate).format(
              DATETIME_FORMATS.DAY_MONTH_YEAR
            )}
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
