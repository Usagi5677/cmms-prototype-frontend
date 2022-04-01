import { useState, useEffect, useContext } from "react";

import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
//import { onMessageListener } from "../../firebase";
import { Spin, Dropdown, Badge, Button } from "antd";

import { FaBell } from "react-icons/fa";

import classes from "./Notification.module.css";

import { useNavigate } from "react-router";
import UserContext from "../../contexts/UserContext";

const Notifications = () => {
return (
      <div style={{ position: "relative" }}>
        <Badge
  
        >
          <FaBell
            style={{
              cursor: "pointer",
              color: "white",
              fontSize: 18,
              marginTop: 6,
            }}
          />
        </Badge>
      </div>
  );
};

export default Notifications;