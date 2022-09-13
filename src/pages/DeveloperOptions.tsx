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
        borderRadius: 20,
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        padding: 10,
        paddingTop: 5,
        paddingLeft: 15,
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
