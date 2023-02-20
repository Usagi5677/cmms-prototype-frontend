import classes from "./PMCardV2.module.css";
import PeriodicMaintenance from "../../../models/PeriodicMaintenance/PeriodicMaintenance";
import PeriodicMaintenanceStatusTag from "../PeriodicMaintenanceStatusTag";
import { PeriodicMaintenanceStatus } from "../../../models/Enums";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { Tooltip } from "antd";
import { FaRegClock } from "react-icons/fa";
import { ToolOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const PMCardV2 = ({
  pm,
  currentRunning,
  entityId,
}: {
  pm: PeriodicMaintenance;
  currentRunning?: number;
  entityId?: number;
}) => {
  const navigate = useNavigate();
  let color: string | undefined = undefined;
  if (pm?.status === "Completed") color = "cyan";
  else if (pm?.status === "Ongoing") color = "orange";
  else if (pm?.status === "Upcoming") color = "#825b22";
  else if (pm?.status === "Overdue") color = "red";

  let measurement = "";
  if (pm?.measurement?.toLowerCase() === "kilometer") {
    measurement = "km";
  } else if (pm?.measurement?.toLowerCase() === "hour") {
    measurement = "hr";
  } else if (pm?.measurement?.toLowerCase() === "days") {
    measurement = "days";
  }

  const dueIn = (currentRunning ?? 0) - (pm.dueAt ?? 0);
  return (
    <div
      className={classes["container"]}
      style={{ borderLeft: `6px solid ${color}` }}
      onClick={() =>
        navigate(
          `/entity/${entityId}?tab=periodicMaintenance&createdAt=${pm.createdAt}`
        )
      }
    >
      <div className={classes["level-one"]}>
        <div className={classes["first-block"]}>
          <div className={classes["main-title"]}>{pm?.name}</div>
          <div className={classes["second-block-wrapper"]}>
            <div className={classes["second-block"]}>
              <span style={{ opacity: 0.5 }}>Occurs every:</span> {pm?.value?.toLocaleString()} (
              {measurement})
            </div>
            <div className={classes["status"]}>
              <PeriodicMaintenanceStatusTag
                status={pm?.status as PeriodicMaintenanceStatus}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={classes["level-two"]}>
        <div className={(classes["title-wrapper"], classes["space"])}>
          <ToolOutlined />
          <span className={classes["id-title"]}>{pm?.id}</span>
        </div>
        <div className={(classes["title-wrapper"], classes["space"])}>
          <Tooltip title="Due Date">
            <FaRegClock />
          </Tooltip>

          <span className={classes["title"]}>
            {moment(pm.createdAt)
              .add(1, "days")
              .format(DATETIME_FORMATS.DAY_MONTH)}
          </span>
        </div>
        <div className={(classes["title-wrapper"], classes["space"])}>
          <Tooltip title="Due In">
            <FaRegClock />
          </Tooltip>
          <span className={classes["title"]}>
            {dueIn?.toLocaleString()} ({measurement})
          </span>
        </div>
        <div className={(classes["title-wrapper"], classes["space"])}>
          <Tooltip title="Due At">
            <FaRegClock />
          </Tooltip>
          <span className={classes["title"]}>
            {pm.dueAt?.toLocaleString() ?? 0} ({measurement})
          </span>
        </div>
      </div>
    </div>
  );
};

export default PMCardV2;
