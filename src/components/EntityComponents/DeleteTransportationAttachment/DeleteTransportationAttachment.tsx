import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { DELETE_TRANSPORTATION_ATTACHMENT } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteTransportationAttachment.module.css";

const DeleteTransportationAttachment = ({
  id,
}: {
  id: number;
}) => {
  const [removeTransportationAttachment, { loading: deleting }] = useMutation(
    DELETE_TRANSPORTATION_ATTACHMENT,
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
      refetchQueries: ["transportationAttachments", "getAllHistoryOfTransportation"],
    }
  );

  const remove = () => {
    removeTransportationAttachment({
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

export default DeleteTransportationAttachment;
