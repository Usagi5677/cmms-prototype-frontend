import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { DELETE_ENTITY_REPAIR_REQUEST } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteEntityRepairRequest.module.css";

const DeleteEntityRepairRequest = ({ id }: { id: number }) => {
  const [removeEntityRepairRequest, { loading: deleting }] = useMutation(
    DELETE_ENTITY_REPAIR_REQUEST,
    {
      onCompleted: () => {
        message.success("Successfully removed repair request.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while removing repair request.");
      },
      refetchQueries: ["getAllRepairRequestOfEntity", "getAllHistoryOfEntity"],
    }
  );

  const remove = () => {
    removeEntityRepairRequest({
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

export default DeleteEntityRepairRequest;
