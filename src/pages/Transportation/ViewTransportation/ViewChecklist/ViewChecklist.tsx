import { useContext } from "react";
import { Checklists } from "../../../../components/Checklists/Checklists";
import UserContext from "../../../../contexts/UserContext";
import Transportation from "../../../../models/Transportation";
import classes from "./ViewChecklist.module.css";

const ViewChecklist = ({
  transportationData,
  isDeleted,
}: {
  transportationData: Transportation;
  isDeleted?: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}></div>
      <div className={classes["content"]}>
        <div className={classes["content-wrapper-one"]}>
          <Checklists entity={transportationData} type="Daily" />
        </div>
        <div className={classes["content-wrapper-two"]}>
          <Checklists entity={transportationData} type="Weekly" />
        </div>
      </div>
    </div>
  );
};

export default ViewChecklist;
