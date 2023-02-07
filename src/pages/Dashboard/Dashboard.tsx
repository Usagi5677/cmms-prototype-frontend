import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";
import classes from "./Dashboard.module.css";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_ENTITY_STATUS_COUNT } from "../../api/queries";
import { errorMessage } from "../../helpers/gql";
import { FaCarCrash, FaRecycle, FaSpinner, FaTractor } from "react-icons/fa";
import StatusCard from "../../components/common/StatusCard/StatusCard";
import MyEntityPMTask from "../../components/DashboardComponents/Entity/MyEntityPMTask/MyEntityPMTask";
import AllAssignedEntity from "../../components/DashboardComponents/Entity/AllAssignedEntity/AllAssignedEntity";
import AllEntityPMTask from "../../components/DashboardComponents/Entity/AllEntityPMTask/AllEntityPMTask";
import EntityMaintenance from "../../components/DashboardComponents/Entity/EntityMaintenance/EntityMaintenance";
import { hasPermissions } from "../../helpers/permissions";
import { motion } from "framer-motion";
import { WarningOutlined } from "@ant-design/icons";
import GroupedEntityUtilization from "../../components/DashboardComponents/Entity/EntityUtilization/GroupedEntityUtilization";
import GroupedTypeRepairStats from "../../components/DashboardComponents/Entity/GroupedTypeRepairStats/GroupedTypeRepairStats";
import EntityStatusPie from "../../components/common/EntityStatusPie/EntityStatusPie";
import UserTypePie from "../../components/common/UserTypePie/UserTypePie";

const Dashboard = () => {
  const { user: self } = useContext(UserContext);

  const [getAllEntityStatusCount, { data: statusData }] = useLazyQuery(
    GET_ALL_ENTITY_STATUS_COUNT,
    {
      onError: (err) => {
        errorMessage(
          err,
          "Error loading status count of machinery & transports."
        );
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    getAllEntityStatusCount();
  }, [getAllEntityStatusCount]);

  let critical = 0;
  let working = 0;
  let breakdown = 0;
  let dispose = 0;

  const statusCountData = statusData?.allEntityStatusCount;
  if (statusCountData) {
    critical = statusCountData?.critical;
    working = statusCountData?.working;
    breakdown = statusCountData?.breakdown;
    dispose = statusCountData?.dispose;
  }

  return (
    <>
      {hasPermissions(self, ["VIEW_DASHBOARD"]) && (
        <div className={classes["status-card"]}>
          <EntityStatusPie/>
          <UserTypePie/>
          
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
