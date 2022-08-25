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

export interface PeriodicMaintenancesStatusProps {
  summaries: PeriodicMaintenanceSummary[];
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
                {summary.hasVerify ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Badge
                      count={
                        <CheckOutlined
                          style={{ marginRight: ".25rem", color: "#52c41a" }}
                        />
                      }
                    />
                    <div style={{ color: "var(--text-primary)" }}>Verified</div>
                  </div>
                ) : (
                  <div>
                    <Badge
                      color={verifyColor}
                      text={verifyText}
                      style={{ marginRight: ".5rem" }}
                    />
                  </div>
                )}
              </div>
            }
          >
            {<Badge color={readingsColor} />}
            {summary.taskCompletion !== "empty" && <Badge color={itemColor} />}
            {summary.hasObservations && (
              <span>
                <Badge count={<CommentOutlined style={{ color: "gray" }} />} />
              </span>
            )}
            {summary.hasRemarks && (
              <span style={{ marginLeft: 5 }}>
                <Badge count={<MessageOutlined />} />
              </span>
            )}
            {summary.hasVerify && (
              <span style={{ marginLeft: 5 }}>
                <Badge count={<CheckOutlined style={{ color: "#52c41a" }} />} />
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
  PeriodicMaintenancesStatusProps
> = ({ summaries }) => {
  let allTaskCompletion = summaries.length;
  let someTaskCompletion = summaries.length;
  let readings = summaries.length;
  let verified = summaries.length;
  let observations = summaries.length;
  let remarks = summaries.length;

  for (const smry of summaries) {
    if (smry.taskCompletion === "all") {
      allTaskCompletion = allTaskCompletion - 1;
    } else if (smry.taskCompletion === "some") {
      someTaskCompletion = someTaskCompletion - 1;
    }
    if (smry.currentMeterReading) {
      readings = readings - 1;
    }
    if (smry.hasVerify) {
      verified = verified - 1;
    }
    if (smry.hasObservations) {
      observations = observations - 1;
    }
    if (smry.hasRemarks) {
      remarks = remarks - 1;
    }
  }

  let itemColor = "none";
  let readingsColor = "none";

  if (allTaskCompletion === 0) {
    itemColor = "#52c41a";
  } else if (someTaskCompletion === 1) {
    itemColor = "#faad13";
  } else {
    itemColor = "#fa541c";
  }

  if (readings === 0) {
    readingsColor = "#52c41a";
  } else {
    readingsColor = "#fa541c";
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
        {observations <= 1 && (
          <div>
            <CommentOutlined
              style={{
                fontSize: 10,
                marginLeft: 4,
              }}
            />
          </div>
        )}
        {remarks <= 1 && (
          <div>
            <MessageOutlined
              style={{
                fontSize: 10,
                marginLeft: 4,
              }}
            />
          </div>
        )}
        {verified <= 1 && (
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
