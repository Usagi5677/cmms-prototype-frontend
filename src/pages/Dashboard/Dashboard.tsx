import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import classes from "./Dashboard.module.css";
import { permissionExist } from "../../helpers/assignPermission";
import MachineryUtilization from "../../components/common/DashboardComponents/Machine/MachineryUtilization/MachineryUtilization";
import AllTransportationUtilization from "../../components/common/DashboardComponents/Transportation/TransportationUtilization/TransportationUtilization";
import MachineMaintenance from "../../components/common/DashboardComponents/Machine/MachineMaintenance/MachineMaintenance";
import TransportationMaintenance from "../../components/common/DashboardComponents/Transportation/TransportationMaintenance/TransportationMaintenance";


const Dashboard = () => {
  
  const { user } = useContext(UserContext);
  return (
    <>
      <div className={classes["utilization"]}>
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
