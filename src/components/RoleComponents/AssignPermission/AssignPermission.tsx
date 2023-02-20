import { Tooltip } from "antd";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import Role from "../../../models/Role";
import classes from "./AssignPermission.module.css";

const AssignPermission = ({ role }: { role: Role }) => {
  return (
    <>
      <Link to={"/role/" + role.id + "/permission"}>
        <Tooltip title="Assign permission">
          <FaLock className={classes["info-edit"]} />
        </Tooltip>
      </Link>
    </>
  );
};

export default AssignPermission;