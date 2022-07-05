import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import classes from "./Dashboard.module.css";
import { permissionExist } from "../../helpers/assignPermission";
import MachineUtilization from "../../components/common/DashboardComponents/MachineUtilization/MachineUtilization";

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
          <MachineUtilization/>
      </div>
    </>
  );
};

export default Dashboard;
