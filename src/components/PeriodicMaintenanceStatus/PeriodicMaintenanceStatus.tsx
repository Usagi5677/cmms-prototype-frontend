import {
  CheckOutlined,
  CommentOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Badge, Tooltip } from "antd";
import React from "react";
import PeriodicMaintenance from "../../models/PeriodicMaintenance/PeriodicMaintenance";

export interface PeriodicMaintenanceSummary extends PeriodicMaintenance {
  taskCompletion: "all" | "some" | "none" | "empty";
  hasObservations: boolean;
  hasRemarks: boolean;
  hasVerify: boolean;
}

export interface PeriodicMaintenanceStatusProps {
  summary: PeriodicMaintenanceSummary;
  size?: "small" | "default";
}

export interface PeriodicMaintenancesSummaryStatusProps {
  allTaskCompletion: number;
  someTaskCompletion: number;
  readings: number;
  verified: number;
  observations: number;
  remarks: number;
}

export interface PeriodicMaintenanceSummaryStatus {
  summary: PeriodicMaintenancesSummaryStatusProps;
  calendarView?: boolean;
}

export const PeriodicMaintenanceStatus: React.FC<
  PeriodicMaintenanceStatusProps
> = ({ summary, size = "default" }) => {
  let itemText = "";
  let itemColor = "none";
  if (summary.taskCompletion === "all") {
    itemColor = "#52c41a";
    itemText = "All tasks completed";
  } else if (summary.taskCompletion === "some") {
    itemColor = "#faad13";
    itemText = "Some tasks completed";
  } else {
    itemColor = "#fa541c";
    itemText = "No tasks completed";
  }

  let readingsText = "";
  let readingsColor = "none";
  if (summary.currentMeterReading) {
    readingsColor = "#52c41a";
    readingsText = "Reading updated";
  } else {
    readingsColor = "#fa541c";
    readingsText = "Reading not updated";
  }

  let verifyText = "";
  let verifyColor = "none";
  if (summary.hasVerify) {
    verifyColor = "#52c41a";
    verifyText = "Verified";
  } else {
    verifyColor = "#fa541c";
    verifyText = "Not verified";
  }

  return (
    <div>
      {size === "default" ? (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            color="var(--dot-tooltip)"
            title={
              <div>
                <div>
                  <Badge
                    color={readingsColor}
                    text={readingsText}
                    style={{ marginRight: ".5rem" }}
                  />
                </div>
                {summary.taskCompletion !== "empty" && (
                  <div>
                    <Badge
                      color={itemColor}
                      text={itemText}
                      style={{ marginRight: ".5rem" }}
                    />
                  </div>
                )}
                {summary.hasObservations && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Badge
                      count={
                        <CommentOutlined
                          style={{ color: "gray", marginRight: ".25rem" }}
                        />
                      }
                    />
                    <div style={{ color: "var(--text-primary)" }}>
                      Maintenance has observation
                    </div>
                  </div>
                )}
                {summary.hasRemarks && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Badge
                      count={
                        <MessageOutlined style={{ marginRight: ".25rem" }} />
                      }
                    />
                    <div style={{ color: "var(--text-primary)" }}>
                      Task has remark
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Badge
                    count={
                      <CheckOutlined
                        style={{ marginRight: ".25rem", color: verifyColor }}
                      />
                    }
                  />
                  <div style={{ color: "var(--text-primary)" }}>
                    {verifyText}
                  </div>
                </div>
              </div>
            }
          >
            {<Badge color={readingsColor} />}
            {summary.taskCompletion !== "empty" && <Badge color={itemColor} />}
            {summary.hasObservations && (
              <span style={{ marginRight: 5 }}>
                <Badge
                  count={
                    <CommentOutlined
                      style={{ color: "gray", marginBottom: 4 }}
                    />
                  }
                />
              </span>
            )}
            {summary.hasRemarks && (
              <span style={{ marginRight: 5 }}>
                <Badge
                  count={<MessageOutlined style={{ marginBottom: 4 }} />}
                />
              </span>
            )}
            {summary.hasVerify && (
              <span>
                <Badge
                  count={
                    <CheckOutlined
                      style={{ color: "#52c41a", marginBottom: 4 }}
                    />
                  }
                />
              </span>
            )}
          </Tooltip>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: 8,
                width: 8,
                borderRadius: 8,
                backgroundColor: readingsColor,
              }}
            ></div>
            {summary.taskCompletion !== "empty" && (
              <div
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 8,
                  marginLeft: 4,
                  backgroundColor: itemColor,
                }}
              ></div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {summary.hasObservations && (
              <div>
                <CommentOutlined
                  style={{
                    fontSize: 10,
                    marginLeft: 4,
                  }}
                />
              </div>
            )}
            {summary.hasRemarks && (
              <div>
                <MessageOutlined
                  style={{
                    fontSize: 10,
                    marginLeft: 4,
                  }}
                />
              </div>
            )}
            {summary.hasVerify && (
              <div>
                <CheckOutlined
                  style={{
                    fontSize: 10,
                    marginLeft: 4,
                    color: "#52c41a",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const PeriodicMaintenancesStatus: React.FC<
  PeriodicMaintenanceSummaryStatus
> = ({ summary, calendarView }) => {
  let itemColor = "none";
  let readingsColor = "none";
  let readingsText = "";
  let itemText = "";
  let verifiedColor = "none";
  let verifiedText = "";
  const fontSize = 10;

  if (summary?.allTaskCompletion === 0) {
    itemColor = "#52c41a";
    itemText = "All tasks completed";
  } else if (summary?.someTaskCompletion < 1) {
    itemColor = "#faad13";
    itemText = "Some tasks completed";
  } else {
    itemColor = "#fa541c";
    itemText = "No tasks completed";
  }

  if (summary?.readings === 0) {
    readingsColor = "#52c41a";
    readingsText = "Reading updated";
  } else {
    readingsColor = "#fa541c";
    readingsText = "Reading not updated";
  }

  if (summary.verified) {
    verifiedColor = "#52c41a";
    verifiedText = "Verified";
  } else {
    verifiedColor = "#fa541c";
    verifiedText = "Not verified";
  }

  if (calendarView) {
    return (
      <div style={{ fontSize }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Badge color={readingsColor} />
          <div style={{ color: "var(--text-primary)" }}>{readingsText}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Badge color={itemColor} />
          <div style={{ color: "var(--text-primary)" }}>{itemText}</div>
        </div>

        {summary?.observations < 1 && (
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
          >
            <Badge
              count={
                <CommentOutlined
                  style={{ color: "gray", marginRight: ".25rem", fontSize }}
                />
              }
            />
            <div style={{ color: "var(--text-primary)" }}>Has observation</div>
          </div>
        )}

        {summary?.remarks < 1 && (
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
          >
            <Badge
              count={
                <MessageOutlined style={{ marginRight: ".25rem", fontSize }} />
              }
            />
            <div style={{ color: "var(--text-primary)" }}>Has remark</div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <Badge
            count={
              <CheckOutlined
                style={{
                  marginRight: ".25rem",
                  color: verifiedColor,
                  fontSize,
                }}
              />
            }
          />
          <div style={{ color: "var(--text-primary)" }}>{verifiedText}</div>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 4,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: 8,
            width: 8,
            borderRadius: 8,
            backgroundColor: readingsColor,
          }}
        ></div>
        <div
          style={{
            height: 8,
            width: 8,
            borderRadius: 8,
            marginLeft: 4,
            backgroundColor: itemColor,
          }}
        ></div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {summary?.observations < 1 && (
          <div>
            <CommentOutlined
              style={{
                fontSize: 10,
                marginLeft: 4,
              }}
            />
          </div>
        )}
        {summary?.remarks < 1 && (
          <div>
            <MessageOutlined
              style={{
                fontSize: 10,
                marginLeft: 4,
              }}
            />
          </div>
        )}
        {summary?.verified < 1 && (
          <div>
            <CheckOutlined
              style={{
                fontSize: 10,
                marginLeft: 4,
                color: "#52c41a",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
