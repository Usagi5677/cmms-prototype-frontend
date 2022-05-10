import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { DELETE_TRANSPORTATION_SPARE_PR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteTransportationSparePR.module.css";

const DeleteTransportationSparePR = ({
  id,
}: {
  id: number;
}) => {
  const [removeTransportationSparePR, { loading: deleting }] = useMutation(
    DELETE_TRANSPORTATION_SPARE_PR,
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
      refetchQueries: ["getAllSparePROfTransportation", "getAllHistoryOfTransportation"],
    }
  );

  const remove = () => {
    removeTransportationSparePR({
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

export default DeleteTransportationSparePR;
