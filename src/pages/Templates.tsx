import { message, Tabs } from "antd";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChecklistTemplates } from "../components/Templates/ChecklistTemplates";
import UserContext from "../contexts/UserContext";
import { hasPermissions } from "../helpers/permissions";

export interface TemplatesProps {}

export const Templates: React.FC<TemplatesProps> = ({}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasPermissions(user, ["VIEW_TEMPLATES", "MODIFY_TEMPLATES"], "any")) {
      navigate("/");
      message.error("No permission to view templates.");
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "var(--card-bg)",
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
