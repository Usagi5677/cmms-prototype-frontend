import { message, Tabs } from "antd";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { IncompleteChecklists } from "../components/IncompleteTasks/IncompleteChecklists";
import UserContext from "../contexts/UserContext";
import { isAssignedTypeToAny } from "../helpers/permissions";

export interface IncompleteTasksProps {}

export const IncompleteTasks: React.FC<IncompleteTasksProps> = ({}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAssignedTypeToAny("Admin", user)) {
      navigate("/");
      message.error("Not an admin of any entity.");
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
      <Tabs defaultActiveKey="checklist">
        <Tabs.TabPane tab="Checklist" key="checklist">
          <IncompleteChecklists />
        </Tabs.TabPane>
        {/* <Tabs.TabPane
          tab="Periodic Maintenance"
          key="periodic-maintenance"
        ></Tabs.TabPane> */}
      </Tabs>
    </div>
  );
};
