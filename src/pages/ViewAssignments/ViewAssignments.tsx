import { Breadcrumb, Tabs } from "antd";
import { Link } from "react-router-dom";
import { Assignments } from "./Assignments";
import DivisionAssignmentTabs from "./DivisionAssignmentTabs";
import { BrandEntityAssignments } from "./Entity/BrandEntityAssignments";
import LocationAssignmentTabs from "./LocationAssignmentTabs";
import classes from "./ViewAssignments.module.css";
const ViewAssignments = () => {
  return (
    <>
      <Breadcrumb style={{ marginBottom: 6 }}>
        <Breadcrumb.Item>
          <Link to={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Assignments</Breadcrumb.Item>
      </Breadcrumb>
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
          <Tabs.TabPane tab="Location Assignments" key="locationAssignments">
            <LocationAssignmentTabs />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Brand Assignments" key="brandAssignments">
            <BrandEntityAssignments />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ViewAssignments;
