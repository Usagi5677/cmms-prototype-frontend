import moment from "moment";
import React from "react";
import { DATETIME_FORMATS } from "../../helpers/constants";
import ChecklistCommentModel from "../../models/ChecklistComment";
import { RemoveChecklistComment } from "./RemoveChecklistComment";

export interface ChecklistCommentProps {
  comment: ChecklistCommentModel;
}

export const ChecklistComment: React.FC<ChecklistCommentProps> = ({
  comment,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "#efefef",
        borderRadius: 10,
        padding: 3,
        paddingLeft: 10,
        marginTop: ".5rem",
      }}
    >
      <div style={{ marginRight: ".5rem" }}>
        <div>{comment.description}</div>
        <div style={{ opacity: 0.5, fontSize: "80%" }}>
          {comment.user.fullName} ({comment.user.rcno}) on{" "}
          {moment(comment.createdAt).format(DATETIME_FORMATS.FULL)}
        </div>
      </div>
      <RemoveChecklistComment comment={comment} />
    </div>
  );
};
