import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import classes from "./Navbar.module.css";
import Notification from "../Notification/Notification";
import NavUser from "./NavUser";
import { Tag } from "antd";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";

const Navbar = ({ openSidebar }: { openSidebar: () => void }) => {
  const { user: self } = useContext(UserContext);
  return (
    <nav className={classes["navbar"]}>
      <div className={classes["navbar-wrapper"]}>
        <div className={classes["navbar__left-side-wrapper"]}>
          <FaBars onClick={openSidebar} className={classes["navbar__icon"]} />
          <NavLink to={"/"}>
            <div className={classes["navbar__title"]}>
              Computerized Maintenance Management
            </div>
          </NavLink>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {self?.location && (
            <div className={classes["location"]}>
              {self?.location}
            </div>
          )}

          <Notification />
          <NavUser />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
