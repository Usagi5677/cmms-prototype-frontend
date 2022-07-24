import { CommentOutlined } from "@ant-design/icons";
import { Badge, Tooltip } from "antd";
import React from "react";
import Checklist from "../../models/Checklist";

export interface ChecklistSummary extends Checklist {
  itemCompletion: "all" | "some" | "none" | "empty";
  hasComments: boolean;
}

export interface ChecklistStatusProps {
  summary: ChecklistSummary;
  size?: "small" | "default";
}

export const ChecklistStatus: React.FC<ChecklistStatusProps> = ({
  summary,
  size = "default",
}) => {
  let itemText = "";
  let itemColor = "none";
  if (summary.itemCompletion === "all") {
    itemColor = "#52c41a";
    itemText = "All checklist items completed";
  } else if (summary.itemCompletion === "some") {
    itemColor = "#faad13";
    itemText = "Some checklist items completed";
  } else {
    itemColor = "#fa541c";
    itemText = "No checklist items completed";
  }

  let readingsText = "";
  let readingsColor = "none";
  if (summary.currentMeterReading && summary.workingHour) {
    readingsColor = "#52c41a";
    readingsText = "Reading and working hours updated";
  } else if (!summary.currentMeterReading != !summary.workingHour) {
    readingsColor = "#faad13";
    if (!summary.currentMeterReading) {
      readingsText = "Reading not updated";
    } else {
      readingsText = "Working hours not updated";
    }
  } else {
    readingsColor = "#fa541c";
    readingsText = "Reading and working hours not updated";
  }

  const smallStyle = {
    height: 5,
    width: 5,
    borderRadius: 5,
    marginLeft: 1,
  };

  return (
    <div>
      {size === "default" ? (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            color="#efefef"
            title={
              <div>
                {summary.type === "Daily" && (
                  <div>
                    <Badge
                      color={readingsColor}
                      text={readingsText}
                      style={{ marginRight: ".5rem" }}
                    />
                  </div>
                )}
                {summary.itemCompletion !== "empty" && (
                  <div>
                    <Badge
                      color={itemColor}
                      text={itemText}
                      style={{ marginRight: ".5rem" }}
                    />
                  </div>
                )}
                {summary.hasComments && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Badge
                      count={
                        <CommentOutlined
                          style={{ color: "gray", marginRight: ".25rem" }}
                        />
                      }
                    />
                    <div style={{ color: "black" }}>Checklist has comments</div>
                  </div>
                )}
              </div>
            }
          >
            {summary.type === "Daily" && <Badge color={readingsColor} />}
            {summary.itemCompletion !== "empty" && <Badge color={itemColor} />}
            {summary.hasComments && (
              <Badge count={<CommentOutlined style={{ color: "gray" }} />} />
            )}
          </Tooltip>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {summary.type === "Daily" && (
            <div
              style={{
                ...smallStyle,
                backgroundColor: readingsColor,
              }}
            ></div>
          )}
          {summary.itemCompletion !== "empty" && (
            <div
              style={{
                ...smallStyle,
                backgroundColor: itemColor,
              }}
            ></div>
          )}
          {summary.hasComments && (
            <div
              style={{
                ...smallStyle,
                backgroundColor: "grey",
              }}
            ></div>
          )}
        </div>
      )}
    </div>
  );
};
