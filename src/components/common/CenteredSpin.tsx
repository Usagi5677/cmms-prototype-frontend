import { Spin } from "antd";
import React from "react";

export interface CenteredSpinProps {
  marginTop?: string;
}

export const CenteredSpin: React.FC<CenteredSpinProps> = ({
  marginTop = "1rem",
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop,
      }}
    >
      <Spin />
    </div>
  );
};
