import { MessageOutlined, WarningOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import moment from "moment";
import React, { useContext } from "react";
import { FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import PeriodicMaintenanceCommentModel from "../../../models/PeriodicMaintenance/PeriodicMaintenanceComment";
import { RemovePeriodicMaintenanceComment } from "../RemovePeriodicMaintenanceComment";
import UserAvatar from "../UserAvatar";
import classes from "./PeriodicMaintenanceComment.module.css";

export interface PeriodicMaintenanceCommentProps {
  comment: PeriodicMaintenanceCommentModel;
  isRemark?: boolean;
  isDeleted?: boolean;
  isOlder?: boolean;
  isCopy?: boolean;
}

export const PeriodicMaintenanceComment: React.FC<
  PeriodicMaintenanceCommentProps
> = ({ comment, isRemark, isDeleted, isOlder, isCopy }) => {
  const { user } = useContext(UserContext);
  return (
    <div
      className={classes["container"]}
      style={{
        backgroundColor: isRemark ? "var(--card-bg)" : "var(--comment-bg)",
        border: isRemark ? "1px solid rgb(255,0,0,0.5)" : undefined,
      }}
    >
      <div className={classes["first-block"]}>
        <UserAvatar
          user={comment?.user}
          size={20}
          withTooltip={`${comment?.user?.fullName} (${comment?.user?.rcno})`}
        />
      </div>
      <div className={classes["second-block"]}>
        <div className={classes["top-wrapper"]}>
          <div className={classes["name-wrapper"]}>
            <div className={classes["name"]}>{comment?.user?.fullName}</div>
            <div
              className={classes["time"]}
              title={`${moment(comment.createdAt).format(
                DATETIME_FORMATS.FULL
              )}`}
            >
              <FaRegClock style={{ marginRight: 2 }} />
              {moment(comment.createdAt).format(
                DATETIME_FORMATS.DAY_MONTH_YEAR
              )}
            </div>
          </div>

          {comment?.user?.id === user.id && (
            <RemovePeriodicMaintenanceComment
              comment={comment}
              isDeleted={isDeleted}
              isOlder={isOlder}
              isCopy={isCopy}
            />
          )}
        </div>

        {comment.description}
      </div>
    </div>
  );
};
