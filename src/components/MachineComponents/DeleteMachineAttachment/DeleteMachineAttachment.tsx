import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { DELETE_MACHINE_ATTACHMENT } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteMachineAttachment.module.css";

const DeleteMachineAttachment = ({
  id,
}: {
  id: number;
}) => {
  const [removeMachineAttachment, { loading: deleting }] = useMutation(
    DELETE_MACHINE_ATTACHMENT,
    {
      onCompleted: () => {
        message.success("Successfully removed attachment.");
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while removing attachment."
        );
      },
      refetchQueries: ["machineAttachments", "getAllHistoryOfMachine"],
    }
  );

  const remove = () => {
    removeMachineAttachment({
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

export default DeleteMachineAttachment;
