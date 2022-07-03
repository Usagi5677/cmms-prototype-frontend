import { Progress, Tooltip } from "antd";
import moment from "moment";
import { useContext } from "react";
import { FaRegBell, FaRegClock } from "react-icons/fa";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import PeriodicMaintenance from "../../../models/Machine/MachinePeriodicMaintenance";
import { TaskList } from "../../TaskList";
import { AddPeriodicMaintenanceTask } from "../AddPeriodicMaintenanceTask";
import DeleteMachinePeriodicMaintenance from "../DeleteMachinePeriodicMaintenance/DeleteMachinePeriodicMaintenance";
import EditMachinePeriodicMaintenance from "../EditMachinePeriodicMaintenance/EditMachinePeriodicMaintenance";
import MachinePeriodicMaintenanceStatus from "../MachinePeriodicMaintenanceStatus/MachinePeriodicMaintenanceStatus";
import classes from "./MachinePeriodicMaintenanceCard.module.css";

const MachinePeriodicMaintenanceCard = ({
  periodicMaintenance,
  isDeleted,
}: {
  periodicMaintenance: PeriodicMaintenance;
  isDeleted: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);

  const taskData = periodicMaintenance?.MachinePeriodicMaintenanceTask!;

  const progressPercentage = Math.round(
    (taskData?.filter((task) => task.completedAt !== null).length /
      taskData?.length) *
      100
  );

  return (
    <div className={classes["container"]}>
      <div className={classes["container-wrapper"]}>
        <div className={classes["wrapper"]}>
          <div className={classes["first-block"]}>
            <div className={classes["time-wrapper"]}>
              <Tooltip title="Created At">
                <FaRegClock />
              </Tooltip>
              <div className={classes["time"]}>
                {moment(periodicMaintenance?.createdAt).format(
                  DATETIME_FORMATS.DAY_MONTH_YEAR
                )}
              </div>
            </div>
            <div className={classes["time-wrapper"]}>
              <Tooltip title="Start Date">
                <FaRegClock />
              </Tooltip>
              <div className={classes["time"]}>
                {moment(periodicMaintenance?.startDate).format(
                  DATETIME_FORMATS.FULL
                )}
              </div>
            </div>

            <div>Title: {periodicMaintenance?.title}</div>
            {/* <div>Description: {periodicMaintenance?.description}</div> */}
            {periodicMaintenance?.completedBy?.fullName && (
              <div className={classes["completedBy"]}>
                Completed by {periodicMaintenance?.completedBy?.fullName}
              </div>
            )}
          </div>
          <div className={classes["second-block"]}>
            <div className={classes["second-block-wrapper"]}>
              <Tooltip title="Notification reminder">
                <FaRegBell />
              </Tooltip>
              <div className={classes["second-block-title"]}>
                {periodicMaintenance?.value} {periodicMaintenance?.measurement}
              </div>
            </div>
          </div>
          <div className={classes["third-block"]}>
            {self.assignedPermission.hasMachinePeriodicMaintenanceEdit ? (
              <MachinePeriodicMaintenanceStatus
                periodicMaintenance={periodicMaintenance}
                isDeleted={isDeleted}
              />
            ) : null}
          </div>
        </div>
        <div className={classes["fourth-block"]}>
          {self.assignedPermission.hasMachinePeriodicMaintenanceEdit && !isDeleted ? (
            <EditMachinePeriodicMaintenance
              periodicMaintenance={periodicMaintenance}
            />
          ) : null}
          {self.assignedPermission.hasMachinePeriodicMaintenanceDelete && !isDeleted ? (
            <DeleteMachinePeriodicMaintenance id={periodicMaintenance?.id} />
          ) : null}
        </div>
        
      </div>
      <div className={classes["task-progress"]}>Task Progress</div>
      {periodicMaintenance.MachinePeriodicMaintenanceTask!.length > 0 && (
        <Progress
          percent={progressPercentage}
          strokeWidth={5}
          style={{ marginBottom: 10, paddingRight: 10 }}
        />
      )}
      <TaskList
        periodicMaintenance={periodicMaintenance}
        tasks={taskData}
        level={0}
        isDeleted={isDeleted}
      />
      <div style={{ marginTop: ".5rem", fontSize: 14 }}>
        <AddPeriodicMaintenanceTask periodicMaintenance={periodicMaintenance} />
      </div>
    </div>
  );
};

export default MachinePeriodicMaintenanceCard;
