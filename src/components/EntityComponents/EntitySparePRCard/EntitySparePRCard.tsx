import { Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import EntitySparePR from "../../../models/Entity/EntitySparePR";
import DeleteEntitySparePR from "../DeleteEntitySparePR/DeleteEntitySparePR";
import EditEntitySparePR from "../EditEntitySparePR/EditEntitySparePR";
import EntitySparePRStatus from "../EntitySparePRStatus/EntitySparePRStatus";
import classes from "./EntitySparePRCard.module.css";

const EntitySparePRCard = ({
  sparePR,
  isDeleted,
}: {
  sparePR: EntitySparePR;
  isDeleted: boolean | undefined;
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
          {self.assignedPermission?.hasEntitySparePREdit ? (
            <EntitySparePRStatus sparePR={sparePR} isDeleted={isDeleted} />
          ) : null}
        </div>
        <div className={classes["icon-wrapper"]}>
          {self.assignedPermission?.hasEntitySparePREdit && !isDeleted ? (
            <EditEntitySparePR sparePR={sparePR} />
          ) : null}
          {self.assignedPermission?.hasEntitySparePRDelete && !isDeleted ? (
            <DeleteEntitySparePR id={sparePR?.id} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EntitySparePRCard;
