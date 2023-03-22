import { Breadcrumb, Button, Result, Tabs } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ChecklistTemplates } from "../components/Templates/ChecklistTemplates";
import { PeriodicMaintenanceTemplates } from "../components/Templates/PeriodicMaintenanceTemplates";
import UserContext from "../contexts/UserContext";
import { NO_AUTH_MESSAGE_THREE } from "../helpers/constants";
import { hasPermissions } from "../helpers/permissions";

export interface TemplatesProps {}

export const Templates: React.FC<TemplatesProps> = ({}) => {
  const { user: self } = useContext(UserContext);

  return !hasPermissions(
    self,
    ["VIEW_TEMPLATES", "MODIFY_TEMPLATES"],
    "any"
  ) ? (
    <Result
      status="403"
      title="403"
      subTitle={NO_AUTH_MESSAGE_THREE}
      extra={
        <Button
          type="primary"
          onClick={() => `${window.open("https://helpdesk.mtcc.com.mv/")}`}
          style={{ borderRadius: 2 }}
        >
          Get Help
        </Button>
      }
    />
  ) : (
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
