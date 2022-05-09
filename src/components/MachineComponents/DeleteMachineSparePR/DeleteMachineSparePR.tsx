import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { DELETE_MACHINE_SPARE_PR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteMachineSparePR.module.css";

const DeleteMachineSparePR = ({
  id,
}: {
  id: number;
}) => {
  const [removeMachineSparePR, { loading: deleting }] = useMutation(
    DELETE_MACHINE_SPARE_PR,
    {
      onCompleted: () => {
        message.success("Successfully removed spare PR.");
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while removing spare PR."
        );
      },
      refetchQueries: ["getAllSparePROfMachine", "getAllHistoryOfMachine"],
    }
  );

  const remove = () => {
    removeMachineSparePR({
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

export default DeleteMachineSparePR;
