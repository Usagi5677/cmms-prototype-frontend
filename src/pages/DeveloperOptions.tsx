import { Breadcrumb, Button, Result, Tabs } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ApiKeys } from "../components/DeveloperOptions/ApiKeys";
import UserContext from "../contexts/UserContext";
import { NO_AUTH_MESSAGE_THREE } from "../helpers/constants";
import { hasPermissions } from "../helpers/permissions";

export interface DeveloperOptionsProps {}

export const DeveloperOptions: React.FC<DeveloperOptionsProps> = ({}) => {
  const { user: self } = useContext(UserContext);

  return !hasPermissions(self, ["VIEW_KEYS", "MODIFY_KEYS"], "any") ? (
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
        <Breadcrumb.Item>Developer</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          width: "100%",
          backgroundColor: "var(--card-bg)",
          borderRadius: 10,
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
          padding: 10,
          paddingTop: 0,
          paddingLeft: 10,
          border: "var(--card-border)",
        }}
      >
        <Tabs defaultActiveKey="keys">
          {hasPermissions(self, ["VIEW_KEYS", "MODIFY_KEYS"], "any") && (
            <Tabs.TabPane tab="API Keys" key="keys">
              <ApiKeys />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </>
  );
};
