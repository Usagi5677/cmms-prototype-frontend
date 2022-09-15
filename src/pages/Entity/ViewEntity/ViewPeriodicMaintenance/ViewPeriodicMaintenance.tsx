import { Tabs } from "antd";
import UpcomingPeriodicMaintenances from "./Upcoming/UpcomingPeriodicMaintenances";
import ReadyPeriodicMaintenances from "./Ready/ReadyPeriodicMaintenances";

const ViewPeriodicMaintenance = ({
  isDeleted,
}: {
  isDeleted?: boolean | undefined;
}) => {
  return (
    <Tabs
      defaultActiveKey="checklist"
      style={{
        flex: 1,
      }}
    >
      <Tabs.TabPane tab="Ready" key="ready">
        <ReadyPeriodicMaintenances isDeleted={isDeleted} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Upcoming" key="upcoming">
        <UpcomingPeriodicMaintenances isDeleted={isDeleted} />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default ViewPeriodicMaintenance;
