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
import EntityUtilization from "../../components/DashboardComponents/Entity/EntityUtilization/EntityUtilization";
import { hasPermissions } from "../../helpers/permissions";
import { motion } from "framer-motion";
import { WarningOutlined } from "@ant-design/icons";
import { useIsSmallDevice } from "../../helpers/useIsSmallDevice";
import CloneEntityUtilization from "../../components/DashboardComponents/Entity/EntityUtilization/CloneEntityUtilization";

const Dashboard = () => {
  const { user: self } = useContext(UserContext);
  const [active, setActive] = useState(false);
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

  const compare = () => {
    setActive(!active);
  };
  const isSmallDevice = useIsSmallDevice(1200, true);
  return (
    <>
      {hasPermissions(self, ["VIEW_DASHBOARD"]) && (
        <div className={classes["status-card"]}>
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              ease: "easeOut",
              duration: 0.3,
              delay: 0.3,
            }}
          >
            <StatusCard
              amountOne={working}
              icon={<FaTractor />}
              iconBackgroundColor={"var(--working-bg)"}
              iconColor={"var(--working-color)"}
              name={"Working"}
            />
          </motion.div>

          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              ease: "easeOut",
              duration: 0.3,
              delay: 0.4,
            }}
          >
            <StatusCard
              amountOne={critical}
              icon={<WarningOutlined />}
              iconBackgroundColor={"var(--critical-bg)"}
              iconColor={"var(--critical-color)"}
              name={"Critical"}
            />
          </motion.div>

          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              ease: "easeOut",
              duration: 0.3,
              delay: 0.5,
            }}
          >
            <StatusCard
              amountOne={breakdown}
              icon={<FaCarCrash />}
              iconBackgroundColor={"var(--breakdown-bg)"}
              iconColor={"var(--breakdown-color)"}
              name={"Breakdown"}
            />
          </motion.div>

          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              ease: "easeOut",
              duration: 0.3,
              delay: 0.6,
            }}
          >
            <StatusCard
              amountOne={dispose}
              icon={<FaRecycle />}
              iconBackgroundColor={"var(--dispose-bg)"}
              iconColor={"var(--dispose-color)"}
              name={"Dispose"}
            />
          </motion.div>
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
          {active && (
            <div
              className={classes["compare"]}
              style={{ display: active && isSmallDevice ? "block" : "none" }}
            ></div>
          )}
          <EntityUtilization active={active} onClick={compare} />
          {active && <CloneEntityUtilization active={active} clone={true} />}
        </div>
      )}
    </>
  );
};

export default Dashboard;
