import { Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import SparePR from "../../../models/Machine/MachineSparePR";
import DeleteMachineSparePR from "../DeleteMachineSparePR/DeleteMachineSparePR";
import EditMachineSparePR from "../EditMachineSparePR/EditMachineSparePR";
import MachineSparePRStatus from "../MachineSparePRStatus/MachineSparePRStatus";
import classes from "./MachineSparePRCard.module.css";

const MachineSparePRCard = ({
  sparePR,
  isDeleted,
}: {
  sparePR: SparePR;
  isDeleted?: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);
  return (
    <div className={classes["container"]}>
      <div className={classes["first-block"]}>
        <div>
          <div>{sparePR?.id}</div>
          <div className={classes["time-wrapper"]}>
            <Tooltip title="Created At">
              <FaRegClock />
            </Tooltip>
            <div className={classes["time"]}>
              {moment(sparePR?.createdAt).format(
                DATETIME_FORMATS.DAY_MONTH_YEAR
              )}
            </div>
          </div>
        </div>
        <div className={classes["col-wrapper"]}>
          {sparePR?.completedBy?.fullName && (
            <div className={classes["col"]}>
              <div className={classes["col-title"]}>Completed by:</div>
              <div className={classes["completedBy"]}>
                {sparePR?.completedBy?.fullName}
              </div>
            </div>
          )}

          <div className={classes["col"]}>
            <div className={classes["col-title"]}>Title:</div>
            <div>{sparePR?.title}</div>
          </div>
          <div className={classes["col"]}>
            <div className={classes["col-title"]}>Description:</div>
            <div>{sparePR?.description}</div>
          </div>
        </div>
      </div>
      <div className={classes["second-block"]}>
        <div className={classes["status"]}>
          {self.assignedPermission.hasMachineSparePREdit ? (
            <MachineSparePRStatus sparePR={sparePR} isDeleted={isDeleted} />
          ) : null}
        </div>
        <div className={classes["icon-wrapper"]}>
          {self.assignedPermission.hasMachineSparePREdit && !isDeleted ? (
            <EditMachineSparePR sparePR={sparePR} />
          ) : null}
          {self.assignedPermission.hasMachineSparePRDelete && !isDeleted ? (
            <DeleteMachineSparePR id={sparePR?.id} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MachineSparePRCard;
