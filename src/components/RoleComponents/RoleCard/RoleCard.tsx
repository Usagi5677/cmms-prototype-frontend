import { Tag, Tooltip } from "antd";
import moment from "moment";
import { FaRegClock } from "react-icons/fa";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { RoleTagStringToColor } from "../../../helpers/style";
import Role from "../../../models/Role";
import AssignPermission from "../AssignPermission/AssignPermission";
import DeleteRole from "../DeleteRole/DeleteRole";
import EditRole from "../EditRole/EditRole";
import classes from "./RoleCard.module.css";

const RoleCard = ({ role }: { role: Role }) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["first-block"]}>
          <div>{role?.id}</div>
          <div className={classes["time-wrapper"]}>
            <Tooltip title="Created At">
              <FaRegClock />
            </Tooltip>
            <div className={classes["time"]}>
              {moment(role?.createdAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
            </div>
          </div>
          <div style={{marginTop: 5, marginBottom: 5}}>
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
              {role?.createdBy?.fullName}
            </div>
          )}
        </div>
        <div className={classes["icon-wrapper"]}>
          <AssignPermission role={role} />
          <EditRole role={role} />
          <DeleteRole id={role?.id} />
        </div>
        <div className={classes["status"]}></div>
      </div>
    </div>
  );
};

export default RoleCard;
