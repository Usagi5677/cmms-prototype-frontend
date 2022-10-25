import { Tabs } from "antd";
import { LocationEntityAssignments } from "./Entity/LocationEntityAssignments";
import { LocationUserAssignments } from "./User/LocationUserAssignments";

const LocationAssignmentTabs = () => {
  return (
    <Tabs
      defaultActiveKey="locationAssignments"
      style={{
        flex: 1,
      }}
    >
      <Tabs.TabPane tab="User" key="user">
        <LocationUserAssignments />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Entity" key="entity">
        <LocationEntityAssignments />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default LocationAssignmentTabs;
