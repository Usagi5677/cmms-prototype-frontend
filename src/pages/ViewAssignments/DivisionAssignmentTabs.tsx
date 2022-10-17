import { Tabs } from "antd";
import { DivisionEntityAssignments } from "./Entity/DivisionEntityAssignments";
import { DivisionUserAssignments } from "./User/DivisionUserAssignments";

const DivisionAssignmentTabs = () => {
  return (
    <Tabs
      defaultActiveKey="userAssignments"
      style={{
        flex: 1,
      }}
    >
      <Tabs.TabPane tab="User" key="user">
        <DivisionUserAssignments />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Entity" key="entity">
        <DivisionEntityAssignments />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default DivisionAssignmentTabs;
