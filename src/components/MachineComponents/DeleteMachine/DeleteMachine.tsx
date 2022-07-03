import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { DELETE_MACHINE } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteMachine.module.css";

const DeleteMachine = ({
  machineID,
  isDeleted,
}: {
  machineID: number;
  isDeleted: boolean | undefined;
}) => {
  const navigate = useNavigate();

  const [removeMachine, { loading: deleting }] = useMutation(DELETE_MACHINE, {
    onCompleted: () => {
      message.success("Successfully removed machine.");
      navigate("/machinery");
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while removing machine.");
    },
    refetchQueries: ["getAllMachine"],
  });

  const remove = () => {
    removeMachine({
      variables: {
        machineId: machineID,
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
      style={{
        pointerEvents: isDeleted ? "none" : "auto",
        color: isDeleted ? "grey" : "inherit",
      }}
    >
      {isDeleted ? (
        <div className={classes["btn-delete"]}>
          <FaTrash
            style={{
              pointerEvents: isDeleted ? "none" : "auto",
              color: isDeleted ? "grey" : "inherit",
            }}
          />
        </div>
      ) : (
        <Tooltip title={"Delete"} placement="top">
          <div className={classes["btn-delete"]}>
            <FaTrash
              style={{
                pointerEvents: isDeleted ? "none" : "auto",
                color: isDeleted ? "grey" : "inherit",
              }}
            />
          </div>
        </Tooltip>
      )}
    </Popconfirm>
  );
};

export default DeleteMachine;
