import { Divider } from "antd";
import React from "react";
import { useIsSmallDevice } from "../../helpers/useIsSmallDevice";
import { IncompleteChecklist } from "./IncompleteChecklist";

export interface IncompleteChecklistsProps {
  setFirstLoad?: any;
}

export const IncompleteChecklists: React.FC<IncompleteChecklistsProps> = ({
  setFirstLoad,
}) => {
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
          <IncompleteChecklist type={type} setFirstLoad={setFirstLoad} />
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
