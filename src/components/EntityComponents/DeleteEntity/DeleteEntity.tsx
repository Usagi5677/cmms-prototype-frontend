import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { DELETE_ENTITY } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteEntity.module.css";

const DeleteEntity = ({
  entityID,
  isDeleted,
}: {
  entityID: number;
  isDeleted?: boolean | undefined;
}) => {
  const navigate = useNavigate();

  const [removeEntity, { loading: deleting }] = useMutation(
    DELETE_ENTITY,
    {
      onCompleted: () => {
        message.success("Successfully disposed entity.");
        navigate("/entity");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while disposing machine.");
      },
      refetchQueries: [
        "getAllEntityVessels",
        "getAllEntityVehicles",
      ],
    }
  );

  const remove = () => {
    removeEntity({
      variables: {
        entityId: entityID,
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

export default DeleteEntity;
