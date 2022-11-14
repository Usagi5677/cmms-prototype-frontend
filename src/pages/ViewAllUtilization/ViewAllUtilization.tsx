import { useState } from "react";
import { useIsSmallDevice } from "../../helpers/useIsSmallDevice";
import CloneEntityUtilization from "./CloneEntityUtilization";
import EntityUtilization from "./EntityUtilization";
import classes from "./ViewAllUtilization.module.css";

const ViewAllUtilization = () => {
  const [active, setActive] = useState(false);
  const compare = () => {
    setActive(!active);
  };
  const isSmallDevice = useIsSmallDevice(1200, true);
  return (
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
  );
};

export default ViewAllUtilization;
