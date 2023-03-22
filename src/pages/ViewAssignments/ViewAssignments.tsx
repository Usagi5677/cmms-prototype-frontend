import { Breadcrumb, Button, Result, Tabs } from "antd";
import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import { NO_AUTH_MESSAGE_ONE } from "../../helpers/constants";
import { hasPermissions } from "../../helpers/permissions";
import { Assignments } from "./Assignments";
import DivisionAssignmentTabs from "./DivisionAssignmentTabs";
import { BrandEntityAssignments } from "./Entity/BrandEntityAssignments";
import LocationAssignmentTabs from "./LocationAssignmentTabs";
import classes from "./ViewAssignments.module.css";
const ViewAssignments = () => {
  const { user: self } = useContext(UserContext);
  return !hasPermissions(self, ["ASSIGN_TO_ENTITY"]) ? (
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
