import { message, Tabs } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
  console.log(firstLoad);
  return (
    <>
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
      {firstLoad && <GroupedLocationIncompleteTask /> }

    </>
  );
};
