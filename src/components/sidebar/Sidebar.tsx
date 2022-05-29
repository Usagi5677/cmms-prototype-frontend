import {
  FaHome,
  FaLayerGroup,
  FaListAlt,
  FaListUl,
  FaRegChartBar,
  FaTh,
  FaUserLock,
  FaUsers,
  FaTruck,
  FaTractor,
  FaLock,
} from "react-icons/fa";
import { RiSailboatFill } from "react-icons/ri";

import classes from "./Sidebar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import UserContext from "../../contexts/UserContext";
import { Badge, Menu } from "antd";
import { useLazyQuery } from "@apollo/client";
import { errorMessage } from "../../helpers/gql";
import {
  GET_BREAKDOWN_MACHINE_COUNT,
  GET_BREAKDOWN_VEHICLE_COUNT,
  GET_BREAKDOWN_VESSEL_COUNT,
} from "../../api/queries";

const { Divider } = Menu;
interface SidebarItem {
  name: string;
  path: string;
  icon?: any;
}

const Sidebar = ({ onClick }: { onClick: () => void }) => {
  const { user } = useContext(UserContext);
  const { pathname } = useLocation();

  const [breakdownMachineCount, { data: machineData }] = useLazyQuery(
    GET_BREAKDOWN_MACHINE_COUNT,
    {
      onError: (err) => {
        errorMessage(err, "Error loading request.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  const [breakdownVesselCount, { data: vesselData }] = useLazyQuery(
    GET_BREAKDOWN_VESSEL_COUNT,
    {
      onError: (err) => {
        errorMessage(err, "Error loading request.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  const [breakdownVehicleCount, { data: vehicleData }] = useLazyQuery(
    GET_BREAKDOWN_VEHICLE_COUNT,
    {
      onError: (err) => {
        errorMessage(err, "Error loading request.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );
  useEffect(() => {
    breakdownMachineCount();
    breakdownVesselCount();
    breakdownVehicleCount();
  }, [breakdownMachineCount, breakdownVesselCount, breakdownVehicleCount]);

  let SidebarData: SidebarItem[] = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "Divider",
      path: "divider1",
    },
    {
      name: "Machinery",
      path: "/machinery",
      icon: <FaTractor />,
    },
    {
      name: "Vessels",
      path: "/transportation/vessels",
      icon: <RiSailboatFill />,
    },
    {
      name: "Vehicles",
      path: "/transportation/vehicles",
      icon: <FaTruck />,
    },
    {
      name: "Divider",
      path: "divider2",
    },
    {
      name: "Assigned Machinery",
      path: "/assigned-machinery",
      icon: <FaListUl />,
    },
    {
      name: "Assigned Vessels",
      path: "/assigned-vessels",
      icon: <FaListUl />,
    },
    {
      name: "Assigned Vehicles",
      path: "/assigned-vehicles",
      icon: <FaListUl />,
    },
    {
      name: "Divider",
      path: "divider3",
    },
    {
      name: "Users",
      path: "/users",
      icon: <FaUsers />,
    },
    {
      name: "Roles",
      path: "/roles",
      icon: <FaLock />,
    },
    {
      name: "Divider",
      path: "divider4",
    },
    {
      name: "Machinery Report",
      path: "/machinery-report",
      icon: <FaRegChartBar />,
    },
    {
      name: "Transportation Report",
      path: "/transportation-report",
      icon: <FaRegChartBar />,
    },
    {
      name: "Divider",
      path: "divider5",
    },
  ];

  // Items only shown to admins and agents
  if (user?.isAdmin || user?.isAgent) {
    // Insert at second position
    SidebarData.splice(3, 0, {
      name: "All Tickets",
      path: "/all-tickets",
      icon: <FaListAlt />,
    });
    // Insert at the end
    SidebarData.push(
      {
        name: "Categories",
        path: "/categories",
        icon: <FaTh />,
      },
      {
        name: "User Groups",
        path: "/usergroups",
        icon: <FaUsers />,
      }
    );
  }

  // Items only shown to admins
  if (user?.isAdmin) {
    SidebarData.push({
      name: "Users",
      path: "/users",
      icon: <FaUserLock />,
    });
  }

  // Items only shown to agents
  if (user?.isAgent) {
    // Insert at third position
    SidebarData.splice(4, 0, {
      name: "Assigned Tickets",
      path: "/assigned-tickets",
      icon: <FaListUl />,
    });
  }

  // Items only shown to super admins
  if (user?.isSuperAdmin) {
    SidebarData.push(
      {
        name: "Divider",
        path: "divider3",
      },
      {
        name: "Sites",
        path: "/sites",
        icon: <FaLayerGroup />,
      }
    );
  }

  return (
    <>
      <Menu
        mode="inline"
        defaultOpenKeys={pathname === "my-tickets" ? ["my-tickets"] : []}
        selectedKeys={[pathname]}
        style={{ overflowX: "hidden", flex: 1 }}
      >
        {SidebarData.map((item: SidebarItem) => {
          if (item.name === "Divider") return <Divider key={item.path} />;
          if (item.name === "Machinery") {
            return (
              <Menu.Item
                key={item.path}
                icon={item.icon}
                className={classes["newMenuItem"]}
                onClick={onClick}
              >
                <NavLink to={item.path}>
                  {item.name}{" "}
                  <Badge
                    count={machineData?.breakdownMachineCount.count}
                    style={{ marginLeft: 10 }}
                  />
                </NavLink>
              </Menu.Item>
            );
          }
          if (item.name === "Vessels") {
            return (
              <Menu.Item
                key={item.path}
                icon={item.icon}
                className={classes["newMenuItem"]}
                onClick={onClick}
              >
                <NavLink to={item.path}>
                  {item.name}{" "}
                  <Badge
                    count={vesselData?.breakdownVesselCount.count}
                    style={{ marginLeft: 10 }}
                  />
                </NavLink>
              </Menu.Item>
            );
          }
          if (item.name === "Vehicles") {
            return (
              <Menu.Item
                key={item.path}
                icon={item.icon}
                className={classes["newMenuItem"]}
                onClick={onClick}
              >
                <NavLink to={item.path}>
                  {item.name}{" "}
                  <Badge
                    count={vehicleData?.breakdownVehicleCount.count}
                    style={{ marginLeft: 10 }}
                  />
                </NavLink>
              </Menu.Item>
            );
          }
          return (
            <Menu.Item
              key={item.path}
              icon={item.icon}
              className={classes["newMenuItem"]}
              onClick={onClick}
            >
              <NavLink to={item.path}>{item.name}</NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    </>
  );
};

export default Sidebar;
