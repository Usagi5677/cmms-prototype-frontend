import { Breadcrumb, Button, Result, Tabs } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Brands } from "../components/Config/Brand/Brands";
import { Divisions } from "../components/Config/Division/Divisions";
import { HullTypes } from "../components/Config/HullType/HullTypes";
import { InterServiceColors } from "../components/Config/InterServiceColor/InterServiceColors";
import { Locations } from "../components/Config/Location/Locations";
import { Types } from "../components/Config/Type/Types";
import { UserAssignments } from "../components/Config/UserAssignment/UserAssignments";
import { Zones } from "../components/Config/Zone/Zones";
import UserContext from "../contexts/UserContext";
import { NO_AUTH_MESSAGE_THREE } from "../helpers/constants";
import { hasPermissions } from "../helpers/permissions";

export interface ConfigProps {}

export const Config: React.FC<ConfigProps> = ({}) => {
  const { user: self } = useContext(UserContext);
  return !hasPermissions(self, ["MODIFY_TYPES", "MODIFY_LOCATIONS"], "any") ? (
    <Result
      status="403"
      title="403"
      subTitle={NO_AUTH_MESSAGE_THREE}
      extra={
        <Button
          type="primary"
          onClick={() => `${window.open("https://helpdesk.mtcc.com.mv/")}`}
          style={{ borderRadius: 2 }}
        >
          Get Help
        </Button>
      }
    />
  ) : (
    <>
      <Breadcrumb style={{ marginBottom: 6 }}>
        <Breadcrumb.Item>
          <Link to={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Config</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          width: "100%",
          backgroundColor: "var(--card-bg)",
          borderRadius: 10,
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 4px",
          padding: 10,
          paddingTop: 0,
          paddingLeft: 10,
          border: "var(--card-border)",
        }}
      >
        <Tabs defaultActiveKey="types">
          {hasPermissions(self, ["MODIFY_TYPES"]) && (
            <Tabs.TabPane tab="Types" key="types">
              <Types />
            </Tabs.TabPane>
          )}
          {hasPermissions(self, ["MODIFY_LOCATIONS"]) && (
            <>
              <Tabs.TabPane tab="Locations" key="locations">
                <Locations />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Zones" key="zones">
                <Zones />
              </Tabs.TabPane>
            </>
          )}
          {hasPermissions(self, ["MODIFY_DIVISIONS"]) && (
            <>
              <Tabs.TabPane tab="Divisions" key="divisions">
                <Divisions />
              </Tabs.TabPane>
            </>
          )}
          {hasPermissions(self, ["MODIFY_HULL_TYPES"]) && (
            <Tabs.TabPane tab="Hull Types" key="hullTypes">
              <HullTypes />
            </Tabs.TabPane>
          )}
          {hasPermissions(self, ["MODIFY_BRANDS"]) && (
            <Tabs.TabPane tab="Brands" key="brands">
              <Brands />
            </Tabs.TabPane>
          )}
          {hasPermissions(self, ["MODIFY_INTER_SERVICE_COLOR"]) && (
            <Tabs.TabPane tab="Inter Service Color" key="interServiceColor">
              <InterServiceColors />
            </Tabs.TabPane>
          )}
          {hasPermissions(self, ["MODIFY_USER_ASSIGNMENTS"]) && (
            <Tabs.TabPane tab="User" key="userAssignments">
              <UserAssignments/>
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </>
  );
};
