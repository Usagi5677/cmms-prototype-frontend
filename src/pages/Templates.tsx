import { Tabs } from "antd";
import React from "react";
import { ChecklistTemplates } from "../components/Templates/ChecklistTemplates";

export interface TemplatesProps {}

export const Templates: React.FC<TemplatesProps> = ({}) => {
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
      <Tabs defaultActiveKey="checklist">
        <Tabs.TabPane tab="Checklist" key="checklist">
          <ChecklistTemplates />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab="Periodic Maintenance"
          key="periodic-maintenance"
        ></Tabs.TabPane>
      </Tabs>
    </div>
  );
};
