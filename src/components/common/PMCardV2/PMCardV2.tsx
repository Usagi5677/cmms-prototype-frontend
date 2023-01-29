import classes from "./PMCardV2.module.css";
import PeriodicMaintenance from "../../../models/PeriodicMaintenance/PeriodicMaintenance";
import PeriodicMaintenanceStatusTag from "../PeriodicMaintenanceStatusTag";
import { PeriodicMaintenanceStatus } from "../../../models/Enums";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";

const PMCardV2 = ({
  pm,
  currentRunning,
}: {
  pm: PeriodicMaintenance;
  currentRunning?: number;
}) => {
  let color: string | undefined = undefined;
  if (pm?.status === "Completed") color = "cyan";
  else if (pm?.status === "Ongoing") color = "orange";
  else if (pm?.status === "Upcoming") color = "#825b22";
  else if (pm?.status === "Overdue") color = "red";

  const dueIn = (currentRunning ?? 0) - (pm.dueAt ?? 0);
  return (
    <div
      className={classes["container"]}
      style={{ borderLeft: `2px solid ${color}` }}
    >
      <div className={classes["first-block"]}>
        <div>{pm?.id}</div>
        <div>{pm?.name}</div>
      </div>
      <div className={classes["second-block"]}>
        Occurs every: {pm?.value} ({pm?.measurement})
      </div>
      <div className={classes["third-block"]}>
        <PeriodicMaintenanceStatusTag
          status={pm?.status as PeriodicMaintenanceStatus}
        />
      </div>
      <div className={classes["fourth-block"]}>
        Due Date:{" "}
        {moment(pm.createdAt).add(1, "days").format(DATETIME_FORMATS.DAY_MONTH)}
      </div>
      <div className={classes["sixth-block"]}>Due In: {dueIn}</div>
      <div className={classes["fifth-block"]}>Due At: {pm.dueAt ?? 0}</div>
    </div>
  );
};

export default PMCardV2;
