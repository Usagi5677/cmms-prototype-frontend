import { message, Tabs } from "antd";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { ApiKeys } from "../components/DeveloperOptions/ApiKeys";
import UserContext from "../contexts/UserContext";
import { hasPermissions } from "../helpers/permissions";

export interface DeveloperOptionsProps {}

export const DeveloperOptions: React.FC<DeveloperOptionsProps> = ({}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasPermissions(user, ["VIEW_KEYS", "MODIFY_KEYS"], "any")) {
      navigate("/");
      message.error("No permission to view developer options.");
    }
  }, []);

  return (
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
      <Tabs defaultActiveKey="keys">
        {hasPermissions(user, ["VIEW_KEYS", "MODIFY_KEYS"], "any") && (
          <Tabs.TabPane tab="API Keys" key="keys">
            <ApiKeys />
          </Tabs.TabPane>
        )}
      </Tabs>
    </div>
  );
};
