import { Breadcrumb, message, Tabs } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import GroupedTypeRepairStats from "../../components/DashboardComponents/Entity/GroupedTypeRepairStats/GroupedTypeRepairStats";
import { IncompleteChecklists } from "../../components/IncompleteTasks/IncompleteChecklists";
import UserContext from "../../contexts/UserContext";
import { hasPermissions, isAssignedTypeToAny } from "../../helpers/permissions";
import GroupedLocationIncompleteTask from "./GroupedLocationIncompleteTask";

export interface IncompleteTasksProps {}

export const IncompleteTasks: React.FC<IncompleteTasksProps> = ({}) => {
  const { user } = useContext(UserContext);
  const [firstLoad, setFirstLoad] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      !isAssignedTypeToAny("Admin", user) &&
      !isAssignedTypeToAny("User", user) &&
      !hasPermissions(user, ["VIEW_ALL_ENTITY"])
    ) {
      navigate("/");
      message.error("Not an admin or user of any entity.");
    }
  }, []);
  return (
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
