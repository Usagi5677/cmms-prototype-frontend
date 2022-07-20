import { useMutation } from "@apollo/client";
import { Checkbox, Spin } from "antd";
import React from "react";
import { TOGGLE_CHECKLIST_ITEM } from "../../api/mutations";
import ChecklistItemModel from "../../models/ChecklistItem";
import moment from "moment";
import { DATETIME_FORMATS } from "../../helpers/constants";

export interface ChecklistItemProps {
  item: ChecklistItemModel;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ item }) => {
  const [toggle, { loading }] = useMutation(TOGGLE_CHECKLIST_ITEM, {
    refetchQueries: ["checklist"],
  });

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {loading ? (
        <Spin size="small" style={{ marginRight: ".25rem" }} />
      ) : (
        <Checkbox
          style={{ marginRight: ".25rem" }}
          onChange={(e) =>
            toggle({
              variables: { id: item.id, complete: e.target.checked },
            })
          }
          checked={item.completedAt ? true : false}
        />
      )}
      <div>
        <div>{item.description}</div>
        {item.completedAt && (
          <div style={{ opacity: 0.5, fontSize: "80%" }}>
            {item.completedBy?.fullName} ({item.completedBy?.rcno}) on{" "}
            {moment(item.completedAt).format(DATETIME_FORMATS.FULL)}
          </div>
        )}
      </div>
    </div>
  );
};
