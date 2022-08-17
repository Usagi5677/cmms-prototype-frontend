import { message, Tabs } from "antd";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { Types } from "../components/Config/Types";
import UserContext from "../contexts/UserContext";
import { hasPermissions } from "../helpers/permissions";

export interface ConfigProps {}

export const Config: React.FC<ConfigProps> = ({}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasPermissions(user, ["MODIFY_TYPES"], "any")) {
      navigate("/");
      message.error("No permission to view config.");
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
      <Tabs defaultActiveKey="types">
        <Tabs.TabPane tab="Types" key="types">
          <Types />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
