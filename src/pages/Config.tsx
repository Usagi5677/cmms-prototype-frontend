import { message, Tabs } from "antd";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { Brands } from "../components/Config/Brand/Brands";
import { Divisions } from "../components/Config/Division/Divisions";
import { HullTypes } from "../components/Config/HullType/HullTypes";
import { InterServiceColors } from "../components/Config/InterServiceColor/InterServiceColors";
import { Locations } from "../components/Config/Location/Locations";
import { Types } from "../components/Config/Type/Types";
import { Zones } from "../components/Config/Zone/Zones";
import UserContext from "../contexts/UserContext";
import { hasPermissions } from "../helpers/permissions";

export interface ConfigProps {}

export const Config: React.FC<ConfigProps> = ({}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasPermissions(user, ["MODIFY_TYPES", "MODIFY_LOCATIONS"], "any")) {
      navigate("/");
      message.error("No permission to view config.");
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "var(--card-bg)",
        borderRadius: 20,
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        padding: 10,
        paddingTop: 5,
        paddingLeft: 15,
        border: "var(--card-border)",
      }}
    >
      <Tabs defaultActiveKey="types">
        {hasPermissions(user, ["MODIFY_TYPES"]) && (
          <Tabs.TabPane tab="Types" key="types">
            <Types />
          </Tabs.TabPane>
        )}
        {hasPermissions(user, ["MODIFY_LOCATIONS"]) && (
          <>
            <Tabs.TabPane tab="Locations" key="locations">
              <Locations />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Zones" key="zones">
              <Zones />
            </Tabs.TabPane>
          </>
        )}
        {hasPermissions(user, ["MODIFY_DIVISIONS"]) && (
          <>
            <Tabs.TabPane tab="Divisions" key="divisions">
              <Divisions />
            </Tabs.TabPane>
          </>
        )}
        {hasPermissions(user, ["MODIFY_HULL_TYPES"]) && (
          <Tabs.TabPane tab="Hull Types" key="hullTypes">
            <HullTypes />
          </Tabs.TabPane>
        )}
        {hasPermissions(user, ["MODIFY_BRANDS"]) && (
          <Tabs.TabPane tab="Brands" key="brands">
            <Brands />
          </Tabs.TabPane>
        )}
        {hasPermissions(user, ["MODIFY_INTER_SERVICE_COLOR"]) && (
          <Tabs.TabPane tab="Inter Service Color" key="interServiceColor">
            <InterServiceColors />
          </Tabs.TabPane>
        )}
      </Tabs>
    </div>
  );
};
