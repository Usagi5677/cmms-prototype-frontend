import { useMutation } from "@apollo/client";
import { Checkbox, Spin } from "antd";
import {
  DELETE_MACHINE_CHECKLIST_ITEM,
  TOGGLE_MACHINE_CHECKLIST_ITEM,
} from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import ChecklistItemModel from "../../models/ChecklistItem";
import { CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { DATETIME_FORMATS } from "../../helpers/constants";
import classes from "./ChecklistItem.module.css";

const ChecklistItem = ({
  item,
}: {
  item: ChecklistItemModel;
}) => {
  const [deleteMachineChecklistItem, { loading: deleting }] = useMutation(
    DELETE_MACHINE_CHECKLIST_ITEM,
    {
      onCompleted: () => {},
      onError: (error) => {
        errorMessage(error, "Unexpected error while deleting checklist item.");
      },
      refetchQueries: ["getSingleMachine"],
    }
  );
  const [toggleMachineChecklistItem, { loading: toggling }] = useMutation(
    TOGGLE_MACHINE_CHECKLIST_ITEM,
    {
      onCompleted: () => {},
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating checklist item.");
      },
      refetchQueries: ["getSingleMachine"],
    }
  );
  return (
    <div className={classes["container"]}>
      <Checkbox
        checked={item.completedAt !== null}
        onChange={(e) =>
          toggleMachineChecklistItem({
            variables: { id: item.id, complete: e.target.checked },
          })
        }
        className={classes["checkbox"]}
      >
        {item.description}{" "}
        {item.completedAt && (
          <span
            className={classes["completedAt"]}
            title={moment(item.completedAt).format(DATETIME_FORMATS.FULL)}
          >
            {moment(item.completedAt).format(DATETIME_FORMATS.SHORT)}
          </span>
        )}
      </Checkbox>
      <div className={classes["deleteWrapper"]}>
        {(deleting || toggling) && (
          <Spin style={{ marginRight: 5 }} size="small" />
        )}
        {!deleting && (
          <CloseCircleOutlined
            className={classes["delete"]}
            onClick={() => {
              deleteMachineChecklistItem({
                variables: {
                  id: item.id,
                },
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ChecklistItem;
