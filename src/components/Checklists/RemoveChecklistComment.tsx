import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Popconfirm, Spin } from "antd";
import React from "react";
import { REMOVE_CHECKLIST_COMMENT } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import ChecklistComment from "../../models/ChecklistComment";

export interface RemoveChecklistCommentProps {
  comment: ChecklistComment;
}

export const RemoveChecklistComment: React.FC<RemoveChecklistCommentProps> = ({
  comment,
}) => {
  const [removeComment, { loading }] = useMutation(REMOVE_CHECKLIST_COMMENT, {
    onError: (error) => {
      errorMessage(error, "Unexpected error while removing comment.");
    },
    refetchQueries: [
      "checklist",
      "checklistSummary",
      "checklistsWithIssue",
      "checklistWithIssueSummary",
      "checklistsWithIssuePastTwoDays",
    ],
  });

  return loading ? (
    <Spin size="small" />
  ) : (
    <Popconfirm
      key="delete"
      disabled={loading}
      title={`Are you sure to remove?`}
      onConfirm={() => {
        removeComment({
          variables: {
            id: comment.id,
          },
        });
      }}
      okText="Confirm"
      cancelText="No"
    >
      <CloseCircleOutlined style={{ color: "grey" }} />
    </Popconfirm>
  );
};
