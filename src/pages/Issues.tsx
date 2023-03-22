import { Breadcrumb, Button, Result, Tabs } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ChecklistsWithIssue } from "../components/Issues/ChecklistsWithIssue";
import UserContext from "../contexts/UserContext";
import { NO_AUTH_MESSAGE_ONE } from "../helpers/constants";
import { hasPermissions } from "../helpers/permissions";

export interface IssuesProps {}

export const Issues: React.FC<IssuesProps> = ({}) => {
  const { user: self } = useContext(UserContext);
  return !hasPermissions(self, ["ENTITY_ENGINEER"]) &&
    !hasPermissions(self, ["ENTITY_ADMIN"]) ? (
    <Result
      status="403"
      title="403"
      subTitle={NO_AUTH_MESSAGE_ONE}
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
        <Breadcrumb.Item>Issues</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          width: "100%",
          backgroundColor: "var(--card-bg)",
          borderRadius: 10,
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 4px",
          padding: 10,
          paddingTop: 0,
          paddingLeft: 10,
          border: "var(--card-border)",
        }}
      >
        <Tabs defaultActiveKey="checklist">
          <Tabs.TabPane tab="Checklist" key="checklist">
            <ChecklistsWithIssue />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};
