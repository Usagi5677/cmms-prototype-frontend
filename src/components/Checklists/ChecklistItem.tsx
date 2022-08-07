import { useMutation } from "@apollo/client";
import { Checkbox, Spin } from "antd";
import React, { useState } from "react";
import { TOGGLE_CHECKLIST_ITEM } from "../../api/mutations";
import ChecklistItemModel from "../../models/ChecklistItem";
import moment from "moment";
import { DATETIME_FORMATS } from "../../helpers/constants";
import Checklist from "../../models/Checklist";
import { AddChecklistItemIssue } from "./AddChecklistItemIssue";
import { ChecklistComment } from "./ChecklistComment";

export interface ChecklistItemProps {
  checklist: Checklist;
  item: ChecklistItemModel;
  disabled: boolean;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  checklist,
  item,
  disabled,
}) => {
  const [hover, setHover] = useState(false);

  const [toggle, { loading }] = useMutation(TOGGLE_CHECKLIST_ITEM, {
    refetchQueries: ["checklist", "checklistSummary"],
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: hover ? "#f5f5f5" : undefined,
        paddingTop: ".25rem",
        paddingBottom: ".25rem",
        paddingLeft: ".5rem",
        borderRadius: 5,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
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
          disabled={disabled}
        />
      )}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex" }}>
          {item.description}{" "}
          {hover && <AddChecklistItemIssue checklist={checklist} item={item} />}
        </div>
        {item.completedAt && (
          <div
            style={{ opacity: 0.5, fontSize: "80%", width: "100%" }}
            title={`${moment(item.completedAt).format(DATETIME_FORMATS.FULL)}`}
          >
            {item.completedBy?.fullName} ({item.completedBy?.rcno}) on{" "}
            {moment(item.completedAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
          </div>
        )}
        {item.issues.length > 0 && (
          <div style={{ marginRight: ".5rem" }}>
            {item.issues.map((issue) => (
              <ChecklistComment key={issue.id} comment={issue} isIssue={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
