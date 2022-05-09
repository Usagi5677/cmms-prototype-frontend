import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { DELETE_MACHINE_REPAIR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteMachineRepair.module.css";

const DeleteMachineRepair = ({
  id,
}: {
  id: number;
}) => {
  const [removeMachineRepair, { loading: deleting }] = useMutation(
    DELETE_MACHINE_REPAIR,
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
      refetchQueries: ["getAllRepairOfMachine", "getAllHistoryOfMachine"],
    }
  );

  const remove = () => {
    removeMachineRepair({
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

export default DeleteMachineRepair;
