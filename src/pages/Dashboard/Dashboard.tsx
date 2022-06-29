import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { ME_QUERY } from "../../api/queries";
import classes from "./Dashboard.module.css";
import { permissionExist } from "../../helpers/assignPermission";

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
  return <div className={classes["ticket-dashboard-container"]}>
    {user?.assignedPermission?.hasMachineAssignmentToUser ? <div>Supervisor</div> : <div>Engineer</div>}
  </div>;
  
};

export default Dashboard;
