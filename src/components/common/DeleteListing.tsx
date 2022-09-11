import React from "react";
import { DocumentNode, useMutation } from "@apollo/client";
import { message, Popconfirm, Spin, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { errorMessage } from "../../helpers/gql";

export interface DeleteListingProps {
  id: number;
  mutation: DocumentNode;
  refetchQueries: string[];
  tooltip?: string;
  title?: string;
}

export const DeleteListing: React.FC<DeleteListingProps> = ({
  id,
  mutation,
  refetchQueries,
  tooltip = "Delete",
  title = "Are you sure to remove?",
}) => {
  const [removeListing, { loading }] = useMutation(mutation, {
    onCompleted: () => {
      message.success("Successfully removed.");
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while removing.");
    },
    refetchQueries,
  });

  const remove = () => {
    removeListing({
      variables: {
        id,
      },
    });
  };
  return loading ? (
    <Spin />
  ) : (
    <Popconfirm
      key="delete"
      disabled={loading}
      title={title}
      onConfirm={() => remove()}
      okText="Confirm"
      cancelText="No"
      placement="left"
    >
      <Tooltip title={tooltip} placement="top">
        <FaTrash className="deleteButton" />
      </Tooltip>
    </Popconfirm>
  );
};
