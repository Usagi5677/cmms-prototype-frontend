import { useContext, useEffect } from "react";
import UserContext from "../../contexts/UserContext";
import classes from "./Dashboard.module.css";
import { permissionExist } from "../../helpers/assignPermission";
import MachineryUtilization from "../../components/common/DashboardComponents/Machine/MachineryUtilization/MachineryUtilization";
import AllTransportationUtilization from "../../components/common/DashboardComponents/Transportation/TransportationUtilization/TransportationUtilization";
import MachineMaintenance from "../../components/common/DashboardComponents/Machine/MachineMaintenance/MachineMaintenance";
import TransportationMaintenance from "../../components/common/DashboardComponents/Transportation/TransportationMaintenance/TransportationMaintenance";
import MachineryPMTask from "../../components/common/DashboardComponents/Machine/MachineryPMTask/MachineryPMTask";
import AllTransportationPMTask from "../../components/common/DashboardComponents/Transportation/AllTransportationPMTask/AllTransportationPMTask";
import MyMachineryPMTask from "../../components/common/DashboardComponents/Machine/MyMachineryPMTask/MyMachineryPMTask";
import MyTransportationPMTask from "../../components/common/DashboardComponents/Transportation/MyTransportationPMTask/MyTransportationPMTask";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_MACHINE_AND_TRANSPORTATION_STATUS_COUNT } from "../../api/queries";
import { errorMessage } from "../../helpers/gql";
import { FaCarCrash, FaSpinner, FaTractor, FaTruck } from "react-icons/fa";
import StatusCard from "../../components/common/StatusCard/StatusCard";

const Dashboard = () => {
  const { user: self } = useContext(UserContext);

  const [getAllMachineAndTransportStatusCount, { data: statusData }] =
    useLazyQuery(GET_ALL_MACHINE_AND_TRANSPORTATION_STATUS_COUNT, {
      onError: (err) => {
        errorMessage(
          err,
          "Error loading status count of machine & transports."
        );
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  useEffect(() => {
    getAllMachineAndTransportStatusCount();
  }, [getAllMachineAndTransportStatusCount]);

  let machineIdle = 0;
  let transportationIdle = 0;
  let machineWorking = 0;
  let transportationWorking = 0;
  let machineBreakdown = 0;
  let transportationBreakdown = 0;

  const statusCountData = statusData?.allMachineAndTransportStatusCount;
  if (statusCountData) {
    machineIdle = statusCountData?.machineIdle;
    transportationIdle = statusCountData?.transportationIdle;
    machineWorking = statusCountData?.machineWorking;
    transportationWorking = statusCountData?.transportationWorking;
    machineBreakdown = statusCountData?.machineBreakdown;
    transportationBreakdown = statusCountData?.transportationBreakdown;
  }

  return (
    <>
      {self?.assignedPermission?.hasViewDashboardStatusCount && (
        <div className={classes["status-card"]}>
          <StatusCard
            amountOne={machineWorking}
            amountTwo={transportationWorking}
            icon={<FaTractor />}
            subIconOne={<FaTractor />}
            subIconTwo={<FaTruck />}
            iconBackgroundColor={"rgb(224,255,255)"}
            iconColor={"rgb(0,139,139)"}
            name={"Working"}
          />
          <StatusCard
            amountOne={machineIdle}
            amountTwo={transportationIdle}
            icon={<FaSpinner />}
            subIconOne={<FaTractor />}
            subIconTwo={<FaTruck />}
            iconBackgroundColor={"rgba(255,165,0,0.2)"}
            iconColor={"rgb(219,142,0)"}
            name={"Idle"}
          />
          <StatusCard
            amountOne={machineBreakdown}
            amountTwo={transportationBreakdown}
            icon={<FaCarCrash />}
            subIconOne={<FaTractor />}
            subIconTwo={<FaTruck />}
            iconBackgroundColor={"rgba(255,0,0,0.2)"}
            iconColor={"rgb(139,0,0)"}
            name={"Breakdown"}
          />
        </div>
      )}
      <div className={classes["content"]}>
        {self?.assignedPermission?.hasViewDashboardMyMachineryPMTask && (
          <MyMachineryPMTask />
        )}
        {self?.assignedPermission?.hasViewDashboardMyTransportsPMTask && (
          <MyTransportationPMTask />
        )}
       {self?.assignedPermission?.hasViewDashboardMachineryPMTask && (
            <MachineryPMTask />
          )}
          {self?.assignedPermission?.hasViewDashboardTransportsPMTask && (
            <AllTransportationPMTask />
          )}
        {self?.assignedPermission?.hasViewDashboardMachineryMaintenance && (
            <MachineMaintenance />
          )}
          {self?.assignedPermission?.hasViewDashboardTransportsMaintenance && (
            <TransportationMaintenance />
          )}
         {self?.assignedPermission?.hasViewDashboardMachineryUtilization && (
            <MachineryUtilization />
          )}
          {self?.assignedPermission?.hasViewDashboardTransportsUtilization && (
            <AllTransportationUtilization />
          )}
      </div>
    </>
  );
};

export default Dashboard;
