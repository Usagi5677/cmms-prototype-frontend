import { WarningOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../helpers/constants";
import ChecklistCommentModel from "../../models/ChecklistComment";
import { RemoveChecklistComment } from "./RemoveChecklistComment";

export interface ChecklistCommentProps {
  comment: ChecklistCommentModel;
  isIssue?: boolean;
}

export const ChecklistComment: React.FC<ChecklistCommentProps> = ({
  comment,
  isIssue = false,
}) => {
  const { user } = useContext(UserContext);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: isIssue ? "var(--card-bg)" : "var(--comment-bg)",
        borderRadius: 10,
        padding: 3,
        paddingLeft: 10,
        marginTop: ".5rem",
        border: isIssue ? "1px solid rgb(255,0,0,0.5)" : undefined,
      }}
    >
      <div style={{ marginRight: ".5rem" }}>
        <div style={{ fontSize: isIssue ? "90%" : undefined }}>
          {isIssue && <WarningOutlined style={{ marginRight: ".25rem" }} />}
          {comment.description}
        </div>
        <div
          style={{ opacity: 0.5, fontSize: "80%" }}
          title={`${moment(comment.createdAt).format(DATETIME_FORMATS.FULL)}`}
        >
          {comment.user.fullName} ({comment.user.rcno}){" "}
          {moment(comment.createdAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
        </div>
      </div>
      {comment.user.id === user.id && (
        <RemoveChecklistComment comment={comment} />
      )}
    </div>
  );
};
