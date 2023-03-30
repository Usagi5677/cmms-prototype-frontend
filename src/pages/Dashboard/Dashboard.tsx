import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import classes from "./Dashboard.module.css";
import AllAssignedEntity from "../../components/DashboardComponents/Maintenance/AllAssignedEntity/AllAssignedEntity";
import { hasPermissions } from "../../helpers/permissions";
import GroupedEntityUtilization from "../../components/DashboardComponents/Maintenance/EntityUtilization/GroupedEntityUtilization";
import GroupedTypeRepairStats from "../../components/DashboardComponents/Maintenance/GroupedTypeRepairStats/GroupedTypeRepairStats";
import EntityStatusPie from "../../components/common/EntityStatusPie/EntityStatusPie";
import UserTypePie from "../../components/common/UserTypePie/UserTypePie";
import { Button, Result } from "antd";
import { NO_AUTH_MESSAGE_ONE } from "../../helpers/constants";
import ValueCard from "../../components/common/ValueCard/ValueCard";
import { FaMapMarkerAlt } from "react-icons/fa";
import MyEntityPMTask from "../../components/DashboardComponents/Maintenance/MyEntityPMTask/MyEntityPMTask";
import ValueCardContainer from "../../components/DashboardComponents/Maintenance/ValueCardContainer/ValueCardContainer";
import EntityTypePieChart from "../../components/common/EntityTypePieChart/EntityTypePieChart";

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
        <div className={classes["level-one"]}>
          <div className={classes["value-card-wrapper"]}>
            <ValueCardContainer />
            <GroupedEntityUtilization entityType="Vessel" />
          </div>

          <div className={classes["pie-card-wrapper"]}>
            <EntityStatusPie />
            <UserTypePie />
            <EntityTypePieChart/>
          </div>
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
          
          <GroupedEntityUtilization entityType="Machine" />
          <GroupedTypeRepairStats />
        </div>
      )}
    </>
  );
};

export default Dashboard;
