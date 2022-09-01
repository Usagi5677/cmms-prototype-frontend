import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Popconfirm, Spin } from "antd";
import React from "react";
import { DELETE_PERIODIC_MAINTENANCE_COMMENT } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import PeriodicMaintenanceCommentModel from "../../models/PeriodicMaintenance/PeriodicMaintenanceComment";

export interface RemovePeriodicMaintenanceCommentProps {
  comment: PeriodicMaintenanceCommentModel;
  isDeleted?: boolean;
  isOlder?: boolean;
}

export const RemovePeriodicMaintenanceComment: React.FC<
  RemovePeriodicMaintenanceCommentProps
> = ({ comment, isDeleted, isOlder }) => {
  const [removeComment, { loading }] = useMutation(
    DELETE_PERIODIC_MAINTENANCE_COMMENT,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while removing comment.");
      },
      refetchQueries: ["periodicMaintenances", "periodicMaintenanceSummary"],
    }
  );

  return loading ? (
    <Spin size="small" />
  ) : (
    <Popconfirm
      key="delete"
      disabled={loading || isDeleted || isOlder}
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
