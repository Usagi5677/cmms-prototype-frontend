import { Button, Calendar, Modal } from "antd";
import { CalendarMode } from "antd/lib/calendar/generateCalendar";
import { useState } from "react";
import {
  PeriodicMaintenancesStatus,
  PeriodicMaintenanceSummary,
} from "../../PeriodicMaintenanceStatus/PeriodicMaintenanceStatus";
import classes from "./PeriodicMaintenanceCalendar.module.css";

const PeriodicMaintenanceCalendar = ({
  summary,
  isDeleted,
}: {
  summary?: any;
  isDeleted?: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  const handleCancel = () => {
    setVisible(false);
  };

  const summaryMatch = (current: any) => {
    if (!summary) return null;
    const match = summary.periodicMaintenanceSummary.filter(
      (ps: PeriodicMaintenanceSummary) => {
        return current.clone().startOf("day").toISOString() === ps.from;
      }
    );
    if (match.length <= 0) {
      return null;
    }

    let allTaskCompletion = match.length;
    let someTaskCompletion = match.length;
    let noTask = false;
    let emptyTask = false;
    let readings = match.length;
    let verified = match.length;
    let observations = match.length;
    let remarks = match.length;

    for (const smry of match) {
      if (smry.taskCompletion === "all") {
        allTaskCompletion = allTaskCompletion - 1;
      } else if (smry.taskCompletion === "some") {
        someTaskCompletion = someTaskCompletion - 1;
      } else if (smry.taskCompletion === "none") {
        noTask = true;
      } else if (smry.taskCompletion === "empty") {
        emptyTask = true;
      }
      if (smry.currentMeterReading) {
        readings = readings - 1;
      }
      if (smry.hasVerify) {
        verified = verified - 1;
      }
      if (smry.hasObservations) {
        observations = observations - 1;
      }
      if (smry.hasRemarks) {
        remarks = remarks - 1;
      }
    }
    const PeriodicMaintenancesStatusProps = {
      allTaskCompletion,
      someTaskCompletion,
      noTask,
      emptyTask,
      readings,
      verified,
      observations,
      remarks,
    };
    return (
      <PeriodicMaintenancesStatus
        summary={PeriodicMaintenancesStatusProps}
        calendarView
      />
    );
  };

  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        type="ghost"
        onClick={() => setVisible(true)}
        className={classes["custom-btn-primary"]}
        disabled={isDeleted}
      >
        Calendar View
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={"Calendar"}
        width="90vw"
      >
        <Calendar
          dateCellRender={(current) => <div>{summaryMatch(current)}</div>}
        />
      </Modal>
    </>
  );
};

export default PeriodicMaintenanceCalendar;
