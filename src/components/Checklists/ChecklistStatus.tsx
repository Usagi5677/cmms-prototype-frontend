import { CommentOutlined, WarningOutlined } from "@ant-design/icons";
import { Badge, Tooltip } from "antd";
import React from "react";
import ChecklistSummary from "../../models/ChecklistSummary";
import { Entity } from "../../models/Entity/Entity";
export interface ChecklistStatusProps {
  summary: ChecklistSummary;
  entity: Entity;
  size?: "small" | "default";
}

export const ChecklistStatus: React.FC<ChecklistStatusProps> = ({
  summary,
  entity,
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
  if (summary.currentMeterReading || summary.workingHour) {
    readingsColor = "#52c41a";
    readingsText = "Reading updated";
  } else {
    readingsColor = "#fa541c";
    readingsText = "Reading not updated";
  }

  let usageText = "";
  let usageColor = "none";
  if (summary.dailyUsageHours) {
    usageColor = "#52c41a";
    usageText = "Usage updated";
  } else {
    usageColor = "#fa541c";
    usageText = "Usage not updated";
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
            color="var(--dot-tooltip)"
            title={
              <div>
                {summary.type === "Daily" && (
                  <>
                    <div>
                      <Badge
                        color={readingsColor}
                        text={readingsText}
                        style={{ marginRight: ".5rem" }}
                      />
                    </div>
                    {entity?.measurement !== "hr" && (
                      <div>
                        <Badge
                          color={usageColor}
                          text={usageText}
                          style={{ marginRight: ".5rem" }}
                        />
                      </div>
                    )}
                  </>
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
                    <div style={{ color: "var(--text-primary)" }}>
                      Checklist has comments
                    </div>
                  </div>
                )}
                {summary.hasIssues && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Badge
                      count={
                        <WarningOutlined
                          style={{ color: "red", marginRight: ".25rem" }}
                        />
                      }
                    />
                    <div style={{ color: "var(--text-primary)" }}>
                      Checklist has issues
                    </div>
                  </div>
                )}
              </div>
            }
          >
            {summary.type === "Daily" && (
              <>
                <Badge color={readingsColor} />
                {entity?.measurement !== "hr" && <Badge color={usageColor} />}
              </>
            )}
            {summary.itemCompletion !== "empty" && <Badge color={itemColor} />}
            {summary.hasComments && (
              <span style={{ marginRight: 5 }}>
                <Badge count={<CommentOutlined style={{ color: "gray" }} />} />
              </span>
            )}
            {summary.hasIssues && (
              <Badge count={<WarningOutlined style={{ color: "red" }} />} />
            )}
          </Tooltip>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {summary.type === "Daily" && (
            <>
              <div
                style={{
                  ...smallStyle,
                  backgroundColor: readingsColor,
                }}
              ></div>
              {entity?.measurement !== "hr" && (
                <div
                  style={{
                    ...smallStyle,
                    backgroundColor: usageColor,
                  }}
                ></div>
              )}
            </>
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
          {summary.hasIssues && (
            <div
              style={{
                ...smallStyle,
                backgroundColor: "red",
              }}
            ></div>
          )}
        </div>
      )}
    </div>
  );
};
