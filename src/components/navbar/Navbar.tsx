import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import classes from "./Navbar.module.css";
import Notification from "../Notification/Notification";
import NavUser from "./NavUser";

const Navbar = ({ openSidebar }: { openSidebar: () => void }) => {
  return (
    <nav className={classes["navbar"]}>
      <div className={classes["navbar-wrapper"]}>
        <div className={classes["navbar__left-side-wrapper"]}>
          <FaBars onClick={openSidebar} className={classes["navbar__icon"]} />
          <NavLink to={"/"}>
            <div className={classes["navbar__title"]}>
              CMMS
            </div>
          </NavLink>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: 20 }}>
          </div>
          <Notification />
          <NavUser />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;