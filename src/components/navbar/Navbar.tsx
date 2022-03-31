import { FaBars, FaBell } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import classes from "./Navbar.module.css";

const Navbar = (props: any) => {
  return (
    <nav className={classes["navbar"]}>
      <div className={classes["navbar-wrapper"]}>
        <div className={classes["navbar__left-side-wrapper"]}>
          <NavLink to={"#"}>
            <div
              className={`${classes["navbar__title"]} ${
                props.openSidebar ? classes["active"] : ""
              }`}
            >
                  <FaBars
            onClick={props.sideBarToggleClicked}
            className={classes["navbar__icon"]}
          />
              CMMS
            </div>
          </NavLink>
        </div>
        <div className={classes["navbar__right-side-wrapper"]}>
          <FaBell className={classes["navbar__icon"]}></FaBell>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
