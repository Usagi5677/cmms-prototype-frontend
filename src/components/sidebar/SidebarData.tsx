import { FaHome, FaTicketAlt, FaBook, FaServer, FaLockOpen, FaRegChartBar, FaWrench, FaLocationArrow, FaSearchLocation, FaCarCrash } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";

interface SidebarItem {
  name: string;
  path?: string;
  icon?: any;
  dropdowns?: SidebarItem[];
  submenuName?: string;
  submenus?: SidebarItem[];
}

export const SidebarData: SidebarItem[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: <FaHome />,
  },
  {
    name: "Assets",
    path: "/",
    icon: <FaServer />,
    dropdowns: [
      { name: "All Machineries", path: "/machinaries" },
      { name: "All Vessels", path: "/vessels" },
      { name: "All Vehicles", path: "/vehicles" },
    ],
  },
  {
    name: "Location",
    path: "/location",
    icon: <IoLocationSharp />,
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
];
