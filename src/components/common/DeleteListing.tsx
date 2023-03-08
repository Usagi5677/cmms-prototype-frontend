import React from "react";
import { DocumentNode, useMutation } from "@apollo/client";
import { message, Popconfirm, Spin, Tooltip } from "antd";
import { FaRegTrashAlt } from "react-icons/fa";
import { errorMessage } from "../../helpers/gql";

export interface DeleteListingProps {
  id: number;
  mutation: DocumentNode;
  refetchQueries: string[];
  tooltip?: string;
  title?: string;
  variables?: any;
}

export const DeleteListing: React.FC<DeleteListingProps> = ({
  id,
  mutation,
  refetchQueries,
  tooltip = "Delete",
  title = "Are you sure to remove?",
  variables,
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
      variables: variables ?? {
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
        <FaRegTrashAlt className="deleteButton" />
      </Tooltip>
    </Popconfirm>
  );
};
