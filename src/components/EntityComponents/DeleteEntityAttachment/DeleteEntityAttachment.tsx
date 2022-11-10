import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { DELETE_ENTITY_ATTACHMENT } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteEntityAttachment.module.css";

const DeleteEntityAttachment = ({ id }: { id: number }) => {
  const [removeEntityAttachment, { loading: deleting }] = useMutation(
    DELETE_ENTITY_ATTACHMENT,
    {
      onCompleted: () => {
        message.success("Successfully removed attachment.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while removing attachment.");
      },
      refetchQueries: [
        "entityAttachments",
        "getAllHistoryOfEntity",
        "checklist",
      ],
    }
  );

  const remove = () => {
    removeEntityAttachment({
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

export default DeleteEntityAttachment;
