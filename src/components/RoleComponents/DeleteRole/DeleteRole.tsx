import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrashAlt } from "react-icons/fa";
import { DELETE_ROLE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteRole.module.css";

const DeleteRole = ({
  id,
}: {
  id: number;
}) => {
  const [removeRole, { loading: deleting }] = useMutation(
    DELETE_ROLE,
    {
      onCompleted: () => {
        message.success("Successfully removed role.");
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while removing role."
        );
      },
      refetchQueries: ["getAllRoles"],
    }
  );

  const remove = () => {
    removeRole({
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
          <FaTrashAlt />
        </div>
      </Tooltip>
    </Popconfirm>
  );
};

export default DeleteRole;
