import { Tooltip } from "antd";
import { FaUnlockAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Role from "../../../models/Role";

const AssignPermission = ({ role }: { role: Role }) => {
  return (
    <Link to={"/role/" + role.id + "/permission"}>
      <Tooltip title="Assign Permission">
        <FaUnlockAlt className="editButtonTwo" />
      </Tooltip>
    </Link>
  );
};

export default AssignPermission;
