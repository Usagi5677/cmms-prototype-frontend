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
  ];

  if (self?.assignedPermission?.hasViewAllMachines) {
    // Insert at second position
    SidebarData.splice(2, 0, {
      name: "Machinery",
      path: "/machinery",
      icon: <FaTractor />,
      count: machineData?.breakdownMachineCount.count,
    });
  }

  if (self?.assignedPermission?.hasViewAllVessels) {
    SidebarData.splice(3, 0, {
      name: "Vessels",
      path: "/transportation/vessels",
      icon: <RiSailboatFill />,
      count: vesselData?.breakdownVesselCount.count,
    });
  }

  if (self?.assignedPermission?.hasViewAllVehicles) {
    SidebarData.splice(4, 0, {
      name: "Vehicles",
      path: "/transportation/vehicles",
      icon: <FaTruck />,
      count: vehicleData?.breakdownVehicleCount.count,
    });
  }
  if (self?.assignedPermission?.hasViewAllAssignedMachines) {
    SidebarData.splice(6, 0, {
      name: "Assigned Machinery",
      path: "/assigned-machinery",
      icon: <FaListUl />,
    });
  }
  if (self?.assignedPermission?.hasViewAllAssignedVehicles) {
    SidebarData.splice(7, 0, {
      name: "Assigned Vessels",
      path: "/assigned-vessels",
      icon: <FaListUl />,
    });
  }

  if (self?.assignedPermission?.hasViewAllAssignedVessels) {
    SidebarData.splice(8, 0, {
      name: "Assigned Vehicles",
      path: "/assigned-vehicles",
      icon: <FaListUl />,
    });
  }

  if (self?.assignedPermission?.hasViewUsers) {
    SidebarData.splice(10, 0, {
      name: "Users",
      path: "/users",
      icon: <FaUsers />,
    });
  }
  if (self?.assignedPermission?.hasViewRoles) {
    SidebarData.splice(11, 0, {
      name: "Roles",
      path: "/roles",
      icon: <FaLock />,
    });
  }

  SidebarData.push({
    name: "Templates",
    path: "/templates",
    icon: <FaPager />,
  });

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
