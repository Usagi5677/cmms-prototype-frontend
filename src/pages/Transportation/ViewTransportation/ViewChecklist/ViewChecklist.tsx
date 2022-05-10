import AddTransportationChecklist from "../../../../components/TransportationComponents/AddTransportationChecklist/AddTransportationChecklist";
import TransportationChecklistItem from "../../../../components/TransportationComponents/TransportationChecklistItem/TransportationChecklistItem";
import Transportation from "../../../../models/Transportation";
import classes from "./ViewChecklist.module.css";

const ViewChecklist = ({
  transportationData,
}: {
  transportationData: Transportation;
}) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        <AddTransportationChecklist transportationID={transportationData?.id} />
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
