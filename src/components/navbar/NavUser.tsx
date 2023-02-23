
import { Dropdown, Menu } from "antd";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { LogoutOutlined } from "@ant-design/icons";
import UserAvatar from "../common/UserAvatar";

const NavUser = () => {
  const { user, logout } = useContext(UserContext);
  return (
    <Dropdown
      placement="bottomRight"
      trigger={["click"]}
      overlay={
        <Menu style={{ borderRadius: 20 }}>
          <Menu.Item key={1} style={{ cursor: "default" }}>
            <UserAvatar user={user} /> {user?.fullName}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key={2} onClick={logout}>
            <LogoutOutlined /> Logout
          </Menu.Item>
        </Menu>
      }
    >
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 10,
        }}
      >
        <UserAvatar user={user} />
      </div>
    </Dropdown>
  );
};

export default NavUser;