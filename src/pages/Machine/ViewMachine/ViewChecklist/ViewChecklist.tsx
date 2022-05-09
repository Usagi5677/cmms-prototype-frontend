import AddMachineChecklist from "../../../../components/MachineComponents/AddMachineChecklist/AddMachineChecklist";
import MachineChecklistItem from "../../../../components/MachineComponents/MachineChecklistItem/MachineChecklistItem";
import Machine from "../../../../models/Machine";
import classes from "./ViewChecklist.module.css";

const ViewChecklist = ({ machineData }: { machineData: Machine }) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        <AddMachineChecklist machineID={machineData?.id} />
      </div>
      <div className={classes["content"]}>
        <div className={classes["content-wrapper-one"]}>
          <div className={classes["content-title"]}>Daily</div>
          {machineData?.checklistItems.map((item) =>
            item.type === "Daily" ? (
              <MachineChecklistItem key={item.id} item={item} />
            ) : null
          )}
        </div>
        <div className={classes["content-wrapper-two"]}>
          <div className={classes["content-title"]}>Weekly</div>
          {machineData?.checklistItems.map((item) =>
            item.type === "Weekly" ? (
              <MachineChecklistItem key={item.id} item={item} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewChecklist;
