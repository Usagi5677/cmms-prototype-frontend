import { Tabs } from "antd";
import React from "react";
import { Types } from "../components/Config/Types";

export interface ConfigProps {}

export const Config: React.FC<ConfigProps> = ({}) => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: 20,
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        padding: 10,
        paddingTop: 5,
        paddingLeft: 15,
      }}
    >
      <Tabs defaultActiveKey="types">
        <Tabs.TabPane tab="Types" key="types">
          <Types />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
