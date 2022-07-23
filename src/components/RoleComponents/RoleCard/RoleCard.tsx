import { Tag, Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { RoleTagStringToColor } from "../../../helpers/style";
import Role from "../../../models/Role";
import AssignPermission from "../AssignPermission/AssignPermission";
import DeleteRole from "../DeleteRole/DeleteRole";
import EditRole from "../EditRole/EditRole";
import classes from "./RoleCard.module.css";

const RoleCard = ({ role }: { role: Role }) => {
  const { user: self } = useContext(UserContext);
  return (
    <div className={classes["container"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["first-block"]}>
          <div className={classes["time-wrapper"]}>
            <Tooltip title="Created on">
              <FaRegClock />
            </Tooltip>
            <div className={classes["time"]}>
              {moment(role?.createdAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
            </div>
          </div>
          <div style={{ marginTop: 5, marginBottom: 5 }}>
            <Tag
              key={role.id}
              style={{
                fontWeight: 700,
                borderRadius: 20,
                textAlign: "center",
                maxWidth: 250,
                backgroundColor: RoleTagStringToColor(role.name),

                borderColor: RoleTagStringToColor(role.name),
                borderWidth: 1,
              }}
            >
              {role.name}
            </Tag>
          </div>
          {role?.createdBy?.fullName && (
            <div className={classes["completedBy"]}>
              {role?.createdBy?.fullName} ({role?.createdBy?.rcno})
            </div>
          )}
        </div>
        <div className={classes["icon-wrapper"]}>
          {self.assignedPermission.hasAssignPermission ? (
            <AssignPermission role={role} />
          ) : null}
          {self.assignedPermission.hasRoleEdit ? (
            <EditRole role={role} />
          ) : null}
          {self.assignedPermission.hasRoleDelete ? (
            <DeleteRole id={role?.id} />
          ) : null}
        </div>
        <div className={classes["status"]}></div>
      </div>
    </div>
  );
};

export default RoleCard;
