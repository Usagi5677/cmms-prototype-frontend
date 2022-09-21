import { Divider } from "antd";
import React from "react";
import { useIsSmallDevice } from "../../helpers/useIsSmallDevice";
import { ChecklistWithIssue } from "./ChecklistWithIssue";

export interface ChecklistsWithIssueProps {}

export const ChecklistsWithIssue: React.FC<
ChecklistsWithIssueProps
> = ({}) => {
  const isSmallDevice = useIsSmallDevice();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isSmallDevice ? "column" : "row",
      }}
    >
      {["Daily", "Weekly"].map((type, i) => (
        <React.Fragment key={type}>
          <ChecklistWithIssue type={type} />
          {i === 0 && (
            <Divider
              style={{
                height: "auto",
              }}
              type={isSmallDevice ? "horizontal" : "vertical"}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
