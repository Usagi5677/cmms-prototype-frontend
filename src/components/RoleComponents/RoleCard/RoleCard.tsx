import { Tag } from "antd";
import moment from "moment";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { hasPermissions } from "../../../helpers/permissions";
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
      <div className={classes["level-one"]}>
        <Tag
          key={role.id}
          style={{
            fontWeight: 700,
            borderRadius: 2,
            textAlign: "center",
            maxWidth: 250,
            backgroundColor: RoleTagStringToColor(role.name),
            borderColor: RoleTagStringToColor(role.name),
            borderWidth: 1,
          }}
          className={classes["tag"]}
        >
          {role.name}
        </Tag>
        <div className={classes["icon-wrapper"]}>
          {hasPermissions(self, ["ASSIGN_PERMISSION"]) ? (
            <AssignPermission role={role} />
          ) : null}
          {hasPermissions(self, ["EDIT_ROLE"]) ? (
            <EditRole role={role} />
          ) : null}
          {hasPermissions(self, ["DELETE_ROLE"]) ? (
            <DeleteRole id={role?.id} />
          ) : null}
        </div>
      </div>

      <div className={classes["level-two"]}>
        <span title="Created By">{role?.createdBy?.fullName}</span>
        <span className={classes["dot"]}>•</span>
        <span title="RCNO">{role?.createdBy?.rcno}</span>
        <span className={classes["dot"]}>•</span>
        <div title="Created At" className={classes["time"]}>
          {moment(role?.createdAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
