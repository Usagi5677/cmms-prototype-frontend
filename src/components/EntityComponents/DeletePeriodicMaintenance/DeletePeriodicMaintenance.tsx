import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { DELETE_ENTITY_PERIODIC_MAINTENANCE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeletePeriodicMaintenance.module.css";

const DeletePeriodicMaintenance = ({
  id,
  isDeleted,
  isCopy,
}: {
  id: number;
  isDeleted?: boolean;
  isCopy?: boolean;
}) => {
  const [removeEntityPeriodicMaintenance, { loading: deleting }] = useMutation(
    DELETE_ENTITY_PERIODIC_MAINTENANCE,
    {
      onCompleted: () => {
        message.success("Successfully removed periodic maintenance.");
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while removing periodic maintenance."
        );
      },
      refetchQueries: [
        "getAllPeriodicMaintenanceOfEntity",
        "getAllHistoryOfEntity",
      ],
    }
  );

  const remove = () => {
    removeEntityPeriodicMaintenance({
      variables: {
        id,
      },
    });
  };
  return (
    <Popconfirm
      key="delete"
      disabled={deleting || isDeleted || isCopy}
      title={`Are you sure to remove this information?`}
      onConfirm={() => remove()}
      okText="Confirm"
      cancelText="No"
      placement="topRight"
    >
      <Tooltip title={"Delete"} placement="top">
        <div className={classes["btn-delete"]} style={{
            pointerEvents: isDeleted || isCopy ? "none" : "auto",
            color: isDeleted || isCopy ? "grey" : "var(--error)",
          }}>
          <FaTrash />
        </div>
      </Tooltip>
    </Popconfirm>
  );
};

export default DeletePeriodicMaintenance;
