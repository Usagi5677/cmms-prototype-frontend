import { FaSignOutAlt } from "react-icons/fa";
import { SidebarData } from "./SidebarData";
import classes from "./Sidebar.module.css";
import Backdrop from "../UI/Backdrop/Backdrop";
import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";

const Sidebar = (props: any) => {
  const { user, logout } = useContext(UserContext);
  return (
    <>
      <Backdrop show={props.openSidebar} clicked={props.closeBackdrop} />
      <div
        className={`${classes["sidebar"]} ${
          props.openSidebar ? "" : classes["close"]
        }`}
      >
        <ul className={classes["sidebar-wrapper"]}>
          <li>
            <div className={classes["sidebar-wrapper__logo-wrapper"]}>
              <img
                className={classes["sidebar__logo"]}
                src="/logo.png"
                alt="MTCC logo"
              />
            </div>
          </li>
          <div className={classes["sidebar-wrapper__sidebar-items-container"]}>
            {SidebarData.map((sbData: any, index: number) => (
              <li key={index}>
                {sbData.dropdowns && sbData.dropdowns.length > 0 ? (
                  <div
                    className={classes["sidebar__sidebar-items-wrapper"]}
                    onClick={props.dropdownClick}
                  >
                    <div
                      className={
                        classes["sidebar__sidebar-item-details-wrapper"]
                      }
                    >
                      <i
                        className={
                          classes["sidebar__sidebar-items-wrapper__icon-left"]
                        }
                      >
                        {sbData.icon}
                      </i>
                      <span
                        className={
                          classes["sidebar__sidebar-items-wrapper__text"]
                        }
                      >
                        {sbData.name}
                      </span>
                    </div>
                    <i
                      className={
                        classes["sidebar__sidebar-items-wrapper__icon-right"]
                      }
                    >
                      <FaChevronDown />
                    </i>
                  </div>
                ) : (
                  <NavLink to={sbData.path}>
                    <div
                      className={classes["sidebar__sidebar-items-wrapper"]}
                      onClick={() => {
                        props.selectLink(index);
                      }}
                    >
                      <div
                        className={
                          classes["sidebar__sidebar-item-details-wrapper"]
                        }
                      >
                        <i
                          className={
                            classes["sidebar__sidebar-items-wrapper__icon-left"]
                          }
                        >
                          {sbData.icon}
                        </i>
                        <span
                          className={
                            classes["sidebar__sidebar-items-wrapper__text"]
                          }
                        >
                          {sbData.name}
                        </span>
                      </div>
                    </div>
                  </NavLink>
                )}

                {sbData.dropdowns && sbData.dropdowns.length > 0 ? (
                  <ul
                    className={`${classes["sidebar__dropdown"]} ${
                      props.dropdownOpen ? classes["active"] : ""
                    }`}
                  >
                    {sbData.dropdowns.map((dropdown: any, index2: number) => (
                      <NavLink key={index2} to={dropdown.path}>
                        <li
                          key={index2}
                          className={
                            classes["sidebar__dropdown__dropdown-items"]
                          }
                        >
                          <span>{dropdown.name}</span>
                        </li>
                      </NavLink>
                    ))}
                    <li>
                      <div
                        className={classes["sidebar__submenu-items-wrapper"]}
                        onClick={props.submenuClick}
                      >
                        <span
                          className={
                            classes["sidebar__submenu-items-wrapper__text"]
                          }
                        >
                          {sbData.submenuName}
                        </span>
                      </div>
                      {sbData.submenus && sbData.submenus.length > 0 ? (
                        <ul
                          className={`${classes["sidebar__submenu_dropdown"]} ${
                            props.submenuOpen ? classes["active"] : ""
                          }`}
                        >
                          {sbData.submenus.map(
                            (submenu: any, index3: number) => (
                              <li
                                key={index3}
                                className={
                                  classes[
                                    "sidebar__submenu_dropdown-items-wrapper"
                                  ]
                                }
                              >
                                <span>{submenu.name}</span>
                                <div className={classes["sidebar__tag"]}>
                                  10+
                                </div>
                              </li>
                            )
                          )}
                        </ul>
                      ) : null}
                    </li>
                  </ul>
                ) : null}
              </li>
            ))}
          </div>
          <div className={classes["divider"]}></div>
          <li>
            <div className={classes["sidebar__profile-container"]}>
              <div className={classes["sidebar__profile-wrapper"]}>
                <div className={classes["sidebar__profile-avatar-wrapper"]}>
                  <img
                    className={classes["sidebar__profile-avatar"]}
                    src="./avatar.jpg"
                    alt=""
                  />
                  <div
                    className={classes["sidebar__profile-avatar-status"]}
                  ></div>
                </div>
                <div className={classes["sidebar__profile-details"]}>
                  <div className={classes["sidebar__profile-name"]}>
                    {/* {user.fullName} */}
                  </div>
                  <div className={classes["sidebar__profile-link"]}>
                    Profile
                  </div>
                </div>
              </div>

              <i className={classes["sidebar__sign-out"]}>
                <FaSignOutAlt onClick={logout} />
              </i>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
