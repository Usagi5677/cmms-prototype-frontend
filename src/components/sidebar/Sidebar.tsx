import {
  FaBook,
  FaCarCrash,
  FaHome,
  FaLayerGroup,
  FaListAlt,
  FaListUl,
  FaRegChartBar,
  FaTh,
  FaUserLock,
  FaUsers,
  FaWrench,
  FaTruck
} from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { IoLocationSharp} from "react-icons/io5";
import { AiFillDatabase } from "react-icons/ai";
import { RiSailboatFill } from "react-icons/ri";

import classes from "./Sidebar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { Menu } from "antd";

const { Divider } = Menu;
interface SidebarItem {
  name: string;
  path: string;
  icon?: any;
}

const Sidebar = ({ onClick }: { onClick: () => void }) => {
  const { user } = useContext(UserContext);
  const { pathname } = useLocation();

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
      name: "Machinaries",
      path: "/machinaries",
      icon: <AiFillDatabase />,
    },
    {
      name: "Vessels",
      path: "/vessels",
      icon: <RiSailboatFill />,
    },
    {
      name: "Vehicles",
      path: "/vehicles",
      icon: <FaTruck />,
    },
    {
      name: "Divider",
      path: "divider2",
    },
    {
      name: "Division",
      path: "/division",
      icon: <BsPeopleFill />,
    },
    {
      name: "Breakdown",
      path: "/breakdown",
      icon: <FaCarCrash />,
    },
    {
      name: "Service/Repair",
      path: "/service",
      icon: <FaWrench />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FaRegChartBar />,
    },
    {
      name: "Divider",
      path: "divider3",
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