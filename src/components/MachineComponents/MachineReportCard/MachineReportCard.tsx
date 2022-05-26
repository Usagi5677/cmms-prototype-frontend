import MachineReport from "../../../models/Machine/MachineReport";
import classes from "./MachineReportCard.module.css";

const MachineReportCard = ({
  report,
  index,
}: {
  report: MachineReport;
  index: number;
}) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["first-block"]}>
          <div>{index + 1}</div>
          <div className={classes["info-title-wrapper"]}>
            <div>Type: </div>
            <div className={classes["info-content"]}>{report?.type}</div>
          </div>
          <div className={classes["info-title-wrapper"]}>
            <div>Total: </div>
            <div className={classes["info-content"]}>
              {report?.working + report?.breakdown}
            </div>
          </div>
        </div>
        <div className={classes["status"]}>
          <div className={classes["info-title-wrapper"]}>
            <div>Working: </div>
            <div className={classes["info-content"]}>{report?.working}</div>
          </div>
          <div className={classes["info-title-wrapper"]}>
            <div>Breakdown: </div>
            <div className={classes["info-content"]}>{report?.breakdown}</div>
          </div>
          <div className={classes["info-title-wrapper"]}>
            <div>Working %: </div>
            <div className={classes["info-content"]}>
              {(report.working / (report.working + report.breakdown)) * 100}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineReportCard;
