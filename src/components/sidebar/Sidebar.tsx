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
  FaPage4,
  FaPager,
  FaCog,
} from "react-icons/fa";
import { RiSailboatFill } from "react-icons/ri";

import classes from "./Sidebar.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import UserContext from "../../contexts/UserContext";
import { Badge, Menu } from "antd";
import { useLazyQuery } from "@apollo/client";
import { errorMessage } from "../../helpers/gql";
import {
  GET_BREAKDOWN_COUNT_OF_ALL,
  GET_BREAKDOWN_MACHINE_COUNT,
  GET_BREAKDOWN_VEHICLE_COUNT,
  GET_BREAKDOWN_VESSEL_COUNT,
} from "../../api/queries";
import { hasPermissions } from "../../helpers/permissions";

const { Divider } = Menu;
interface SidebarItem {
  name: string;
  path: string;
  icon?: any;
  count?: number;
}

const Sidebar = ({ onClick }: { onClick: () => void }) => {
  const { user: self } = useContext(UserContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [allEntityBreakdownCount, { data: breakdownData }] = useLazyQuery(
    GET_BREAKDOWN_COUNT_OF_ALL,
    {
      onError: (err) => {
        errorMessage(err, "Error loading breakdown count.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );
  useEffect(() => {
    allEntityBreakdownCount();
  }, [allEntityBreakdownCount]);

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
  ];

  if (
    self?.machineAssignments.length > 0 ||
    hasPermissions(self, ["VIEW_ALL_ENTITY"])
  ) {
    // Insert at second position
    SidebarData.push({
      name: "Machinery",
      path: "/machinery",
      icon: <FaTractor />,
      count: breakdownData?.allEntityBreakdownCount?.machine,
    });
  }

  if (
    self?.vesselAssignments.length > 0 ||
    hasPermissions(self, ["VIEW_ALL_ENTITY"])
  ) {
    SidebarData.push({
      name: "Vessels",
      path: "/vessels",
      icon: <RiSailboatFill />,
      count: breakdownData?.allEntityBreakdownCount?.vessel,
    });
  }

  if (
    self?.vehicleAssignments.length > 0 ||
    hasPermissions(self, ["VIEW_ALL_ENTITY"])
  ) {
    SidebarData.push({
      name: "Vehicles",
      path: "/vehicles",
      icon: <FaTruck />,
      count: breakdownData?.allEntityBreakdownCount?.vehicle,
    });
  }

  SidebarData.push({
    name: "Divider",
    path: "divider2",
  });

  if (hasPermissions(self, ["VIEW_USERS"])) {
    SidebarData.splice(10, 0, {
      name: "Users",
      path: "/users",
      icon: <FaUsers />,
    });
  }
  if (hasPermissions(self, ["VIEW_ROLES"])) {
    SidebarData.splice(11, 0, {
      name: "Roles",
      path: "/roles",
      icon: <FaLock />,
    });
  }

  if (hasPermissions(self, ["VIEW_TEMPLATES", "MODIFY_TEMPLATES"], "any")) {
    SidebarData.push({
      name: "Templates",
      path: "/templates",
      icon: <FaPager />,
    });
  }

  if (hasPermissions(self, ["MODIFY_TYPES"], "any")) {
    SidebarData.push({
      name: "Config",
      path: "/config",
      icon: <FaCog />,
    });
  }
  /*
    if (self?.assignedPermission?.hasViewMachineryReport) {
      SidebarData.splice(13, 0, {
        name: "Machinery Report",
        path: "/machinery-report",
        icon: <FaRegChartBar />,
      });
    }
    if (self?.assignedPermission?.hasViewTransportationReport) {
      SidebarData.splice(14, 0, {
        name: "Transportation Report",
        path: "/transportation-report",
        icon: <FaRegChartBar />,
      });
    }
  */

  return (
    <>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        style={{ overflowX: "hidden", flex: 1 }}
      >
        {SidebarData.map((item: SidebarItem) => {
          if (item.name === "Divider") return <Divider key={item.path} />;
          return (
            <Menu.Item
              key={item.path}
              icon={item.icon}
              className={classes["newMenuItem"]}
              onClick={() => {
                navigate(item.path);
                onClick();
              }}
            >
              {item.name}{" "}
              <Badge
                showZero={false}
                count={item.count ?? 0}
                style={{ marginLeft: 10 }}
              />
            </Menu.Item>
          );
        })}
      </Menu>
    </>
  );
};

export default Sidebar;
