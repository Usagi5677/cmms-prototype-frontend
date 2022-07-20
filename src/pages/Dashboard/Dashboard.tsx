import { useContext } from "react";
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

const Dashboard = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      <div className={classes["my-pm-task"]}>
        <MyMachineryPMTask />
        <MyTransportationPMTask />
      </div>
      <div className={classes["pm-task"]}>
        <MachineryPMTask />
        <AllTransportationPMTask />
      </div>
      <div className={classes["maintenance"]}>
        <MachineMaintenance />
        <TransportationMaintenance />
      </div>
      <div className={classes["utilization"]}>
        <MachineryUtilization />
        <AllTransportationUtilization />
      </div>
    </>
  );
};

export default Dashboard;
