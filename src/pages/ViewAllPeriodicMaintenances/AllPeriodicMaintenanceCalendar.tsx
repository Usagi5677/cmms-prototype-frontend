import { Button, Calendar, Modal } from "antd";
import { useState } from "react";
import {
  PeriodicMaintenancesStatus,
  PeriodicMaintenanceSummary,
} from "../../components/PeriodicMaintenanceStatus/PeriodicMaintenanceStatus";
import classes from "./AllPeriodicMaintenanceCalendar.module.css";
import PeriodicMaintenanceModal from "./PeriodicMaintenanceModal";

const AllPeriodicMaintenanceCalendar = ({
  summary,
  isDeleted,
  loading,
}: {
  summary?: any;
  isDeleted?: boolean;
  loading?: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  const handleCancel = () => {
    setVisible(false);
  };

  const summaryMatch = (current: any) => {
    if (!summary) return null;
    const match = summary.allPeriodicMaintenanceSummary.filter(
      (ps: PeriodicMaintenanceSummary) => {
        return current.clone().startOf("day").toISOString() === ps.from;
      }
    );
    if (match.length <= 0) {
      return null;
    }

    const arr = [];
    for (const smry of match) {
      arr.push(<PeriodicMaintenanceModal summary={smry} key={smry.id} />);
    }
    return arr;
  };

  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        type="primary"
        onClick={() => setVisible(true)}
        className={classes["custom-btn-primary"]}
        disabled={isDeleted || loading}
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

export default AllPeriodicMaintenanceCalendar;
