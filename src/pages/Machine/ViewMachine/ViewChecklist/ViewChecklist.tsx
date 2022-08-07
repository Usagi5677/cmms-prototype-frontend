import { useContext } from "react";
import { Checklists } from "../../../../components/Checklists/Checklists";
import UserContext from "../../../../contexts/UserContext";
import Machine from "../../../../models/Machine";
import classes from "./ViewChecklist.module.css";

const ViewChecklist = ({
  machineData,
  isDeleted,
}: {
  machineData: Machine;
  isDeleted?: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}></div>
      <div className={classes["content"]}>
        <div className={classes["content-wrapper-one"]}>
          <Checklists entity={machineData} type="Daily" />
        </div>
        <div className={classes["content-wrapper-two"]}>
          <Checklists entity={machineData} type="Weekly" />
        </div>
      </div>
    </div>
  );
};

export default ViewChecklist;
