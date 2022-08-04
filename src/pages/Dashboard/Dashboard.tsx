import { useContext, useEffect } from "react";
import UserContext from "../../contexts/UserContext";
import classes from "./Dashboard.module.css";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_ENTITY_STATUS_COUNT } from "../../api/queries";
import { errorMessage } from "../../helpers/gql";
import {
  FaCarCrash,
  FaRecycle,
  FaSpinner,
  FaTractor,
  FaTruck,
} from "react-icons/fa";
import StatusCard from "../../components/common/StatusCard/StatusCard";
import MyMachineryPMTask from "../../components/DashboardComponents/Machine/MyMachineryPMTask/MyMachineryPMTask";
import AllAssignedMachinery from "../../components/DashboardComponents/Machine/AllAssignedMachinery/AllAssignedMachinery";
import MachineMaintenance from "../../components/DashboardComponents/Machine/MachineMaintenance/MachineMaintenance";
import MachineryPMTask from "../../components/DashboardComponents/Machine/MachineryPMTask/MachineryPMTask";
import MachineryUtilization from "../../components/DashboardComponents/Machine/MachineryUtilization/MachineryUtilization";
import AllAssignedTransportation from "../../components/DashboardComponents/Transportation/AllAssignedTransportation/AllAssignedTransportation";
import AllTransportationPMTask from "../../components/DashboardComponents/Transportation/AllTransportationPMTask/AllTransportationPMTask";
import MyTransportationPMTask from "../../components/DashboardComponents/Transportation/MyTransportationPMTask/MyTransportationPMTask";
import TransportationMaintenance from "../../components/DashboardComponents/Transportation/TransportationMaintenance/TransportationMaintenance";
import AllTransportationUtilization from "../../components/DashboardComponents/Transportation/TransportationUtilization/TransportationUtilization";
import MyEntityPMTask from "../../components/DashboardComponents/Entity/MyEntityPMTask/MyEntityPMTask";
import AllAssignedEntity from "../../components/DashboardComponents/Entity/AllAssignedEntity/AllAssignedEntity";
import AllEntityPMTask from "../../components/DashboardComponents/Entity/AllEntityPMTask/AllEntityPMTask";
import EntityMaintenance from "../../components/DashboardComponents/Entity/EntityMaintenance/EntityMaintenance";
import EntityUtilization from "../../components/DashboardComponents/Entity/EntityUtilization/EntityUtilization";

const Dashboard = () => {
  const { user: self } = useContext(UserContext);

  const [getAllEntityStatusCount, { data: statusData }] =
    useLazyQuery(GET_ALL_ENTITY_STATUS_COUNT, {
      onError: (err) => {
        errorMessage(
          err,
          "Error loading status count of machinery & transports."
        );
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  useEffect(() => {
    getAllEntityStatusCount();
  }, [getAllEntityStatusCount]);

  let idle = 0;
  let working = 0;
  let breakdown = 0;
  let dispose = 0;

  const statusCountData = statusData?.allEntityStatusCount;
  if (statusCountData) {
    idle = statusCountData?.idle;
    working = statusCountData?.working;
    breakdown = statusCountData?.breakdown;
    dispose = statusCountData?.dispose;
    
  }

  return (
    <>
      {self?.assignedPermission?.hasViewDashboardStatusCount && (
        <div className={classes["status-card"]}>
          <StatusCard
            amountOne={working}
            icon={<FaTractor />}
            iconBackgroundColor={"rgb(224,255,255)"}
            iconColor={"rgb(0,139,139)"}
            name={"Working"}
          />
          <StatusCard
            amountOne={idle}
            icon={<FaSpinner />}
            iconBackgroundColor={"rgba(255,165,0,0.2)"}
            iconColor={"rgb(219,142,0)"}
            name={"Idle"}
          />
          <StatusCard
            amountOne={breakdown}
            icon={<FaCarCrash />}
            iconBackgroundColor={"rgba(255,0,0,0.2)"}
            iconColor={"rgb(139,0,0)"}
            name={"Breakdown"}
          />
          <StatusCard
            amountOne={dispose}
            icon={<FaRecycle />}
            iconBackgroundColor={"rgba(102, 0, 0,0.3)"}
            iconColor={"rgb(102, 0, 0)"}
            name={"Dispose"}
          />
        </div>
      )}
      <div className={classes["content"]}>
        {self?.assignedPermission?.hasViewDashboardMyEntityPMTask && (
          <MyEntityPMTask />
        )}
        {self?.assignedPermission?.hasViewDashboardAssignedEntity && (
          <AllAssignedEntity />
        )}
        {self?.assignedPermission?.hasViewDashboardEntityPMTask && (
          <AllEntityPMTask />
        )}
        {self?.assignedPermission?.hasViewDashboardEntityMaintenance && (
          <EntityMaintenance />
        )}
        {self?.assignedPermission?.hasViewDashboardEntityUtilization && (
          <EntityUtilization />
        )}
      </div>
    </>
  );
};

export default Dashboard;
