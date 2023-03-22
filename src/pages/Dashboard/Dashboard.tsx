import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import classes from "./Dashboard.module.css";
import MyEntityPMTask from "../../components/DashboardComponents/Entity/MyEntityPMTask/MyEntityPMTask";
import AllAssignedEntity from "../../components/DashboardComponents/Entity/AllAssignedEntity/AllAssignedEntity";
import { hasPermissions } from "../../helpers/permissions";
import GroupedEntityUtilization from "../../components/DashboardComponents/Entity/EntityUtilization/GroupedEntityUtilization";
import GroupedTypeRepairStats from "../../components/DashboardComponents/Entity/GroupedTypeRepairStats/GroupedTypeRepairStats";
import EntityStatusPie from "../../components/common/EntityStatusPie/EntityStatusPie";
import UserTypePie from "../../components/common/UserTypePie/UserTypePie";
import { Button, Result } from "antd";
import { NO_AUTH_MESSAGE_ONE } from "../../helpers/constants";

const Dashboard = () => {
  const { user: self } = useContext(UserContext);

  return (
    <>
      {!hasPermissions(self, ["VIEW_DASHBOARD"]) && (
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
      )}
      {hasPermissions(self, ["VIEW_DASHBOARD"]) && (
        <div className={classes["status-card"]}>
          <EntityStatusPie />
          <UserTypePie />
        </div>
      )}
      {hasPermissions(self, ["VIEW_DASHBOARD"]) && (
        <div className={classes["content"]}>
          {hasPermissions(self, ["VIEW_DASHBOARD"]) &&
            hasPermissions(
              self,
              ["ENTITY_ENGINEER", "ENTITY_ADMIN"],
              "any"
            ) && <MyEntityPMTask />}
          {hasPermissions(self, ["VIEW_DASHBOARD"]) &&
            hasPermissions(self, ["ENTITY_USER", "ENTITY_ADMIN"], "any") && (
              <AllAssignedEntity />
            )}

          <GroupedEntityUtilization entityType="Vehicle" />
          <GroupedEntityUtilization entityType="Vessel" />
          <GroupedEntityUtilization entityType="Machine" />
          <GroupedTypeRepairStats />
        </div>
      )}
    </>
  );
};

export default Dashboard;
