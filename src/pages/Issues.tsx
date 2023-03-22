import { Breadcrumb, message, Tabs } from "antd";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { ChecklistsWithIssue } from "../components/Issues/ChecklistsWithIssue";
import UserContext from "../contexts/UserContext";
import { hasPermissions } from "../helpers/permissions";

export interface IssuesProps {}

export const Issues: React.FC<IssuesProps> = ({}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      !hasPermissions(user, ["ENTITY_ENGINEER"]) &&
      !hasPermissions(user, ["ENTITY_ADMIN"])
    ) {
      navigate("/");
      message.error("You are not an engineer or admin.");
    }
  }, []);

  return (
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
