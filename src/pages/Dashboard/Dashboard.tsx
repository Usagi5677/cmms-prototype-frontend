import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import classes from "./Dashboard.module.css";
import { permissionExist } from "../../helpers/assignPermission";
import MachineryUtilization from "../../components/common/DashboardComponents/Machine/MachineryUtilization/MachineryUtilization";
import AllTransportationUtilization from "../../components/common/DashboardComponents/Transportation/TransportationUtilization/TransportationUtilization";


const assignedPermission = permissionExist;
const Dashboard = () => {
  // const { assignedPermission } = useContext(UserContext);
  // console.log(assignedPermission)
  // // if engineer
  // const hasManyPermissions = ["VIEW_ROLES", "ASSIGN_PERMISSION"].every(
  //   (permission: string) => {
  //     return assignedPermission.includes(permission);
  //   }
  // );
  // console.log(hasManyPermissions)

  const { user } = useContext(UserContext);
  return (
    <>
      <div className={classes["ticket-dashboard-container"]}>
        {user?.assignedPermission?.hasMachineAssignmentToUser ? (
          <div>Supervisor</div>
        ) : (
          <div>Engineer</div>
        )}
      </div>
      <div className={classes["utilization"]}>
          <MachineryUtilization />
          <AllTransportationUtilization/>
      </div>
    </>
  );
};

export default Dashboard;
