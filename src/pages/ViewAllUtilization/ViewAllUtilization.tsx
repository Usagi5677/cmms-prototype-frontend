import { Breadcrumb, Button, Result } from "antd";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import { NO_AUTH_MESSAGE_TWO } from "../../helpers/constants";
import { hasPermissions } from "../../helpers/permissions";
import { useIsSmallDevice } from "../../helpers/useIsSmallDevice";
import CloneEntityUtilization from "./CloneEntityUtilization";
import EntityUtilization from "./EntityUtilization";
import classes from "./ViewAllUtilization.module.css";

const ViewAllUtilization = () => {
  const [active, setActive] = useState(false);
  const { user: self } = useContext(UserContext);
  const compare = () => {
    setActive(!active);
  };
  const isSmallDevice = useIsSmallDevice(1200, true);
  return self?.machineAssignments.length === 0 &&
    self?.vehicleAssignments.length === 0 &&
    self?.vesselAssignments.length === 0 &&
    !hasPermissions(self, ["VIEW_ALL_ENTITY"]) &&
    !hasPermissions(self, ["VIEW_ALL_MACHINERY"]) &&
    !hasPermissions(self, ["VIEW_ALL_VEHICLES"]) &&
    !hasPermissions(self, ["VIEW_ALL_VESSELS"]) &&
    !hasPermissions(self, ["VIEW_ALL_DIVISION_ENTITY"]) ? (
    <Result
      status="403"
      title="403"
      subTitle={NO_AUTH_MESSAGE_TWO}
      extra={
        <Button
          type="primary"
          onClick={() => `${window.open("https://helpdesk.mtcc.com.mv/")}`}
          style={{ borderRadius: 2 }}
        >
          Get Help
        </Button>
      }
    />
  ) : (
    <>
      <Breadcrumb style={{ marginBottom: 6 }}>
        <Breadcrumb.Item>
          <Link to={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Utilizations</Breadcrumb.Item>
      </Breadcrumb>
      <div className={classes["content"]}>
        {active && (
          <div
            className={classes["compare"]}
            style={{ display: active && isSmallDevice ? "block" : "none" }}
          ></div>
        )}
        <EntityUtilization active={active} onClick={compare} />
        {active && <CloneEntityUtilization active={active} clone={true} />}
      </div>
    </>
  );
};

export default ViewAllUtilization;
