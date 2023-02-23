import { DocumentNode } from "@apollo/client";
import moment from "moment";
import React, { useContext } from "react";
import { FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import Comment from "../../../models/Comment";
import { RemoveComment } from "../RemoveComment";
import UserAvatar from "../UserAvatar";
import classes from "./CommentCard.module.css";

export interface CommentProps {
  comment: Comment;
  isRemark?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  isCopy?: boolean;
  mutation: DocumentNode;
  refetchQueries: string[];
}

export const CommentCard: React.FC<CommentProps> = ({
  comment,
  isRemark,
  isDeleted,
  isVerified,
  isCopy,
  mutation,
  refetchQueries,
}) => {
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
          user={comment?.createdBy}
          size={20}
          withTooltip={`${comment?.createdBy?.fullName} (${comment?.createdBy?.rcno})`}
        />
      </div>
      <div className={classes["second-block"]}>
        <div className={classes["top-wrapper"]}>
          <div className={classes["name-wrapper"]}>
            <div className={classes["name"]}>
              {comment?.createdBy?.fullName}
            </div>
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

          {comment?.createdBy?.id === user.id && (
            <RemoveComment
              comment={comment}
              isDeleted={isDeleted}
              isVerified={isVerified}
              isCopy={isCopy}
              mutation={mutation}
              refetchQueries={refetchQueries}
            />
          )}
        </div>

        {comment.description}
      </div>
    </div>
  );
};
