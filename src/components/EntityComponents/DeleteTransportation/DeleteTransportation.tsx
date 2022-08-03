import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { DELETE_TRANSPORTATION } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteTransportation.module.css";

const DeleteTransportation = ({
  transportationID,
  isDeleted,
}: {
  transportationID: number;
  isDeleted?: boolean | undefined;
}) => {
  const navigate = useNavigate();

  const [removeTransportation, { loading: deleting }] = useMutation(
    DELETE_TRANSPORTATION,
    {
      onCompleted: () => {
        message.success("Successfully removed transportation.");
        navigate("/transportation/vessels");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while removing machine.");
      },
      refetchQueries: [
        "getAllTransportationVessels",
        "getAllTransportationVehicles",
      ],
    }
  );

  const remove = () => {
    removeTransportation({
      variables: {
        transportationId: transportationID,
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

export default DeleteTransportation;
