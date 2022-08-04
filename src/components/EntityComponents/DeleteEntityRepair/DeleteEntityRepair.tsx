import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { DELETE_ENTITY_REPAIR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteEntityRepair.module.css";

const DeleteEntityRepair = ({
  id,
}: {
  id: number;
}) => {
  const [removeEntityRepair, { loading: deleting }] = useMutation(
    DELETE_ENTITY_REPAIR,
    {
      onCompleted: () => {
        message.success("Successfully removed repair.");
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while removing repair."
        );
      },
      refetchQueries: ["getAllRepairOfEntity", "getAllHistoryOfEntity"],
    }
  );

  const remove = () => {
    removeEntityRepair({
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

export default DeleteEntityRepair;
