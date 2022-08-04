import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { DELETE_ENTITY_PERIODIC_MAINTENANCE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteEntityPeriodicMaintenance.module.css";

const DeleteEntityPeriodicMaintenance = ({
  id,
}: {
  id: number;
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
      refetchQueries: ["getAllPeriodicMaintenanceOfEntity", "getAllHistoryOfEntity"],
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
      disabled={deleting}
      title={`Are you sure to remove this information?`}
      onConfirm={() => remove()}
      okText="Confirm"
      cancelText="No"
      placement="topRight"
    >
      <Tooltip title={"Delete"} placement="top">
        <div className={classes["btn-delete"]}>
          <FaTrash />
        </div>
      </Tooltip>
    </Popconfirm>
  );
};

export default DeleteEntityPeriodicMaintenance;
