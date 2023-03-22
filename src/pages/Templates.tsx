import { Breadcrumb, message, Tabs } from "antd";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { ChecklistTemplates } from "../components/Templates/ChecklistTemplates";
import { PeriodicMaintenanceTemplates } from "../components/Templates/PeriodicMaintenanceTemplates";
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
    <>
      <Breadcrumb style={{ marginBottom: 6 }}>
        <Breadcrumb.Item>
          <Link to={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Templates</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          width: "100%",
          backgroundColor: "var(--card-bg)",
          borderRadius: 10,
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 4px",
          padding: 10,
          paddingLeft: 10,
          paddingTop: 0,
          border: "var(--card-border)",
        }}
      >
        <Tabs defaultActiveKey="checklist">
          <Tabs.TabPane tab="Checklist" key="checklist">
            <ChecklistTemplates />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Periodic Maintenance" key="periodic-maintenance">
            <PeriodicMaintenanceTemplates />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};
