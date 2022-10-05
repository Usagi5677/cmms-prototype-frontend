import { Tabs } from "antd";
import UpcomingPeriodicMaintenances from "./Upcoming/UpcomingPeriodicMaintenances";
import ReadyPeriodicMaintenances from "./Ready/ReadyPeriodicMaintenances";
import { Entity } from "../../../../models/Entity/Entity";

const ViewPeriodicMaintenance = ({
  isDeleted,
  entity,
}: {
  isDeleted?: boolean | undefined;
  entity: Entity,
}) => {
  return (
    <Tabs
      defaultActiveKey="checklist"
      style={{
        flex: 1,
      }}
    >
      <Tabs.TabPane tab="Ready" key="ready">
        <ReadyPeriodicMaintenances isDeleted={isDeleted} entity={entity} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Upcoming" key="upcoming">
        <UpcomingPeriodicMaintenances isDeleted={isDeleted} entity={entity} />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default ViewPeriodicMaintenance;
