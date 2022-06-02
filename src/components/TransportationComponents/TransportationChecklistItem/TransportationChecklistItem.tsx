import { useMutation } from "@apollo/client";
import { Checkbox, Spin } from "antd";
import {
  DELETE_TRANSPORTATION_CHECKLIST_ITEM,
  TOGGLE_TRANSPORTATION_CHECKLIST_ITEM,
} from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import ChecklistItemModel from "../../../models/ChecklistItem";
import { CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import classes from "./TransportationChecklistItem.module.css";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";

const TransportationChecklistItem = ({
  item,
}: {
  item: ChecklistItemModel;
}) => {
  const { user: self } = useContext(UserContext);
  const [deleteTransportationChecklistItem, { loading: deleting }] =
    useMutation(DELETE_TRANSPORTATION_CHECKLIST_ITEM, {
      onCompleted: () => {},
      onError: (error) => {
        errorMessage(error, "Unexpected error while deleting checklist item.");
      },
      refetchQueries: [
        "getSingleTransportation",
        "getAllHistoryOfTransportation",
      ],
    });
  const [toggleTransportationChecklistItem, { loading: toggling }] =
    useMutation(TOGGLE_TRANSPORTATION_CHECKLIST_ITEM, {
      onCompleted: () => {},
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating checklist item.");
      },
      refetchQueries: [
        "getSingleTransportation",
        "getAllHistoryOfTransportation",
      ],
    });
  return (
    <div className={classes["container"]}>
      {self.assignedPermission.hasTransportationChecklistEdit ? (
        <Checkbox
          checked={item.completedAt !== null}
          onChange={(e) =>
            toggleTransportationChecklistItem({
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
      ) : (
        <div>
          {item.description}{" "}
          {item.completedAt && (
            <span
              className={classes["completedAt"]}
              title={moment(item.completedAt).format(DATETIME_FORMATS.FULL)}
            >
              {moment(item.completedAt).format(DATETIME_FORMATS.SHORT)}
            </span>
          )}
        </div>
      )}

      <div className={classes["deleteWrapper"]}>
        {(deleting || toggling) && (
          <Spin style={{ marginRight: 5 }} size="small" />
        )}
        {!deleting && (
          <div>
            {self.assignedPermission.hasTransportationChecklistDelete ? (
              <CloseCircleOutlined
                className={classes["delete"]}
                onClick={() => {
                  deleteTransportationChecklistItem({
                    variables: {
                      id: item.id,
                    },
                  });
                }}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportationChecklistItem;
