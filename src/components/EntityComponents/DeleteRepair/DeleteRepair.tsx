import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { REMOVE_REPAIR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteRepair.module.css";

const DeleteRepair = ({
  id,
  isDeleted,
}: {
  id: number;
  isDeleted?: boolean;
}) => {
  const [removeRepair, { loading: deleting }] = useMutation(REMOVE_REPAIR, {
    onCompleted: () => {
      message.success("Successfully removed repair.");
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while removing repair.");
    },
    refetchQueries: ["repairs", "breakdowns", "getAllHistoryOfEntity"],
  });

  const remove = () => {
    removeRepair({
      variables: {
        id,
      },
    });
  };
  return (
    <Popconfirm
      key="delete"
      disabled={deleting || isDeleted}
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

export default DeleteRepair;
