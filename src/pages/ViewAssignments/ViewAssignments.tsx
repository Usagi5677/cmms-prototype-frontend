import { Tabs } from "antd";
import { Assignments } from "./Assignments";
import DivisionAssignmentTabs from "./DivisionAssignmentTabs";
import classes from "./ViewAssignments.module.css";
const ViewAssignments = () => {
  return (
    <div className={classes["container"]}>
      <Tabs
        defaultActiveKey="userAssignments"
        style={{
          flex: 1,
        }}
      >
        <Tabs.TabPane tab="User Assignments" key="userAssignments">
          <Assignments />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Division Assignments" key="divisionAssignments">
          <DivisionAssignmentTabs />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ViewAssignments;
