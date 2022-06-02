import { useContext } from "react";
import AddTransportationChecklist from "../../../../components/TransportationComponents/AddTransportationChecklist/AddTransportationChecklist";
import TransportationChecklistItem from "../../../../components/TransportationComponents/TransportationChecklistItem/TransportationChecklistItem";
import UserContext from "../../../../contexts/UserContext";
import Transportation from "../../../../models/Transportation";
import classes from "./ViewChecklist.module.css";

const ViewChecklist = ({
  transportationData,
}: {
  transportationData: Transportation;
}) => {
  const { user: self } = useContext(UserContext);
  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        {self.assignedPermission.hasTransportationChecklistAdd ? (
          <AddTransportationChecklist
            transportationID={transportationData?.id}
          />
        ) : null}
      </div>
      <div className={classes["content"]}>
        <div className={classes["content-wrapper-one"]}>
          <div className={classes["content-title"]}>Daily</div>
          {transportationData?.checklistItems.map((item) =>
            item.type === "Daily" ? (
              <TransportationChecklistItem key={item.id} item={item} />
            ) : null
          )}
        </div>
        <div className={classes["content-wrapper-two"]}>
          <div className={classes["content-title"]}>Weekly</div>
          {transportationData?.checklistItems.map((item) =>
            item.type === "Weekly" ? (
              <TransportationChecklistItem key={item.id} item={item} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewChecklist;
