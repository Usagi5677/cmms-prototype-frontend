import { useContext } from "react";
import { Checklists } from "../../../../components/Checklists/Checklists";
import UserContext from "../../../../contexts/UserContext";
import { Entity } from "../../../../models/Entity/Entity";
import classes from "./ViewChecklist.module.css";

const ViewChecklist = ({
  entityData,
  isDeleted,
}: {
  entityData: Entity;
  isDeleted?: boolean | undefined;
}) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}></div>
      <div className={classes["content"]}>
        <div className={classes["content-wrapper-one"]}>
          <Checklists entity={entityData} type="Daily" />
        </div>
        <div className={classes["content-wrapper-two"]}>
          <Checklists entity={entityData} type="Weekly" />
        </div>
      </div>
    </div>
  );
};

export default ViewChecklist;
