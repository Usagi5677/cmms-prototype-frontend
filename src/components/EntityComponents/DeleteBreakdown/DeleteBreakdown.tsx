import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaRegTrashAlt } from "react-icons/fa";
import { REMOVE_BREAKDOWN } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteBreakdown.module.css";

const DeleteBreakdown = ({ id, isDeleted }: { id: number, isDeleted?: boolean }) => {
  const [removeBreakdown, { loading: deleting }] = useMutation(
    REMOVE_BREAKDOWN,
    {
      onCompleted: () => {
        message.success("Successfully removed breakdown.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while removing breakdown.");
      },
      refetchQueries: [
        "breakdowns",
        "getAllHistoryOfEntity",
      ],
    }
  );

  const remove = () => {
    removeBreakdown({
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
          <FaRegTrashAlt />
        </div>
      </Tooltip>
    </Popconfirm>
  );
};

export default DeleteBreakdown;
