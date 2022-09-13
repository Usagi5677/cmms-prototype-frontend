import { CloseCircleOutlined } from "@ant-design/icons";
import { DocumentNode, useMutation } from "@apollo/client";
import { Popconfirm, Spin } from "antd";
import React from "react";
import { DELETE_PERIODIC_MAINTENANCE_COMMENT } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import Comment from "../../models/Comment";

export interface RemoveCommentProps {
  comment: Comment;
  isDeleted?: boolean;
  isOlder?: boolean;
  isCopy?: boolean;
  mutation: DocumentNode;
  refetchQueries: string[];
}

export const RemoveComment: React.FC<RemoveCommentProps> = ({
  comment,
  isDeleted,
  isOlder,
  isCopy,
  mutation,
  refetchQueries
}) => {
  const [removeComment, { loading }] = useMutation(mutation, {
    onError: (error) => {
      errorMessage(error, "Unexpected error while removing comment.");
    },
    refetchQueries,
  });

  return loading ? (
    <Spin size="small" />
  ) : (
    <Popconfirm
      key="delete"
      disabled={loading || isDeleted || isOlder || isCopy}
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
