import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { DELETE_MACHINE_BREAKDOWN } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteMachineBreakdown.module.css";

const DeleteMachineBreakdown = ({
  id,
}: {
  id: number;
}) => {
  const [removeMachineBreakdown, { loading: deleting }] = useMutation(
    DELETE_MACHINE_BREAKDOWN,
    {
      onCompleted: () => {
        message.success("Successfully removed breakdown.");
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while removing breakdown."
        );
      },
      refetchQueries: ["getAllBreakdownOfMachine"],
    }
  );

  const remove = () => {
    removeMachineBreakdown({
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

export default DeleteMachineBreakdown;
