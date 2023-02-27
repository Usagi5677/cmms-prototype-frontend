import { useMutation } from "@apollo/client";
import { message, Popconfirm, Tooltip } from "antd";
import { FaRegTrashAlt } from "react-icons/fa";
import { DELETE_SPARE_PR } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import classes from "./DeleteSparePR.module.css";

const DeleteSparePR = ({
  id,
  isDeleted,
}: {
  id: number;
  isDeleted?: boolean;
}) => {
  const [removeSparePR, { loading: deleting }] = useMutation(
    DELETE_SPARE_PR,
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
      refetchQueries: ["sparePRs", "getAllHistoryOfEntity"],
    }
  );

  const remove = () => {
    removeSparePR({
      variables: {
        id,
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
    >
      <Tooltip title={"Delete"} placement="top">
        <div className={classes["btn-delete"]}>
          <FaRegTrashAlt />
        </div>
      </Tooltip>
    </Popconfirm>
  );
};

export default DeleteSparePR;
