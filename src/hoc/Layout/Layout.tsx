import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import classes from "./Layout.module.css";

const Layout = (props: any) => {
  const [sidebarIsVisible, setSidebarIsVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(true);
  const [selectedLink, setSelectedLink] = useState(-1);

  const openDropdownHandler = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openSubmenuHandler = () => {
    setSubmenuOpen(!submenuOpen);
  };

  const sidebarToggleHandler = () => {
    setSidebarIsVisible(!sidebarIsVisible);
  };

  const selectedLinkHandler = (index: any) => {
    setSelectedLink(index);
  };

  return (
    <>
      <Navbar
        sideBarToggleClicked={sidebarToggleHandler}
        openSidebar={sidebarIsVisible}
      />
      <Sidebar
        openSidebar={sidebarIsVisible}
        closeBackdrop={sidebarToggleHandler}
        dropdownClick={openDropdownHandler}
        dropdownOpen={dropdownOpen}
        submenuClick={openSubmenuHandler}
        submenuOpen={submenuOpen}
        selectedLink={selectedLink}
        selectLink={selectedLinkHandler}
      />
      <main className={classes["content"]}>{props.children}</main>
    </>
  );
};

export default Layout;
