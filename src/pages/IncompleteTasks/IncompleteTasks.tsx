import { Breadcrumb, Button, Result, Tabs } from "antd";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { IncompleteChecklists } from "../../components/IncompleteTasks/IncompleteChecklists";
import UserContext from "../../contexts/UserContext";
import { NO_AUTH_MESSAGE_ONE } from "../../helpers/constants";
import { hasPermissions, isAssignedTypeToAny } from "../../helpers/permissions";
import GroupedLocationIncompleteTask from "./GroupedLocationIncompleteTask";

export interface IncompleteTasksProps {}

export const IncompleteTasks: React.FC<IncompleteTasksProps> = ({}) => {
  const { user: self } = useContext(UserContext);
  const [firstLoad, setFirstLoad] = useState(false);
  return !isAssignedTypeToAny("Admin", self) &&
    !isAssignedTypeToAny("User", self) &&
    !hasPermissions(self, ["VIEW_ALL_ENTITY"]) ? (
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
        <Breadcrumb.Item>Incomplete Tasks</Breadcrumb.Item>
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
            <IncompleteChecklists setFirstLoad={setFirstLoad} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane
          tab="Periodic Maintenance"
          key="periodic-maintenance"
        ></Tabs.TabPane> */}
        </Tabs>
      </div>
      {firstLoad && <GroupedLocationIncompleteTask />}
    </>
  );
};
