import { Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { hasPermissions } from "../../../helpers/permissions";
import EntityBreakdown from "../../../models/Entity/EntityBreakdown";
import DeleteEntityBreakdown from "../DeleteEntityBreakdown/DeleteEntityBreakdown";
import EditEntityBreakdown from "../EditEntityBreakdown/EditEntityBreakdown";
import EntityBreakdownStatus from "../EntityBreakdownStatus/EntityBreakdownStatus";

import classes from "./EntityBreakdownCard.module.css";

const EntityBreakdownCard = ({
  breakdown,
  isDeleted,
}: {
  breakdown: EntityBreakdown;
  isDeleted?: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);
  return (
    <div className={classes["container"]}>
      <div className={classes["first-block"]}>
        <div>
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
        </div>
        <div className={classes["col-wrapper"]}>
          {breakdown?.completedBy?.fullName && (
            <div className={classes["col"]}>
              <div className={classes["col-title"]}>Completed by:</div>
              <div className={classes["completedBy"]}>
                {breakdown?.completedBy?.fullName}
              </div>
            </div>
          )}

          <div className={classes["col"]}>
            <div className={classes["col-title"]}>Title:</div>
            <div>{breakdown?.title}</div>
          </div>
          <div className={classes["col"]}>
            <div className={classes["col-title"]}>Description:</div>
            <div>{breakdown?.description}</div>
          </div>
        </div>
      </div>
      <div className={classes["second-block"]}>
        <div>
          {breakdown?.estimatedDateOfRepair && (
            <div className={classes["time-wrapper"]}>
              <Tooltip title="Estimated date of repair">
                <FaRegClock />
              </Tooltip>
              <div className={classes["time"]}>
                {moment(breakdown?.estimatedDateOfRepair).format(
                  DATETIME_FORMATS.DAY_MONTH_YEAR
                )}
              </div>
            </div>
          )}
          <div className={classes["time-wrapper"]}>
            <Tooltip title="Duration">
              <FaRegClock />
            </Tooltip>
            {breakdown?.completedAt ? (
              <div className={classes["time"]}>
                {moment(breakdown?.completedAt).format(DATETIME_FORMATS.FULL)}
              </div>
            ) : (
              <div className={classes["time"]}>
                {moment(breakdown?.createdAt).fromNow()}
              </div>
            )}
          </div>
        </div>

        <div className={classes["status"]}>
          {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ? (
            <EntityBreakdownStatus
              breakdown={breakdown}
              isDeleted={isDeleted}
            />
          ) : null}
        </div>
        <div className={classes["icon-wrapper"]}>
          {self.assignedPermission?.hasEntityBreakdownEdit && !isDeleted ? (
            <EditEntityBreakdown breakdown={breakdown} isDeleted={isDeleted} />
          ) : null}
          {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ? (
            <EditEntityBreakdown breakdown={breakdown} isDeleted={isDeleted} />
          ) : null}
          {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ? (
            <DeleteEntityBreakdown id={breakdown?.id} isDeleted={isDeleted} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EntityBreakdownCard;
