import { useLazyQuery } from "@apollo/client";
import { Progress } from "antd";
import { memo, useEffect } from "react";
import CountUp from "react-countup";
import {
  ALL_PERIODIC_MAINTENANCE_STATUS_COUNT,
} from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import { PeriodicMaintenanceStatus } from "../../../models/Enums";
import classes from "./MaintenanceProgressBar.module.css";

interface filter {
  first?: number | null;
  last?: number | null;
  after?: string | null;
  before?: string | null;
  search: string;
  locationIds: number[];
  type2Ids: number[];
  zoneIds: number[];
  divisionIds: number[];
  measurement: string[];
  lteInterService: string;
  gteInterService: string;
  pmStatus: PeriodicMaintenanceStatus[];
  from: any;
  to: any;
}
const MaintenanceProgressBar = ({ filter }: { filter?: filter }) => {
  const [allPMStatusCount, { data: statusData }] = useLazyQuery(
    ALL_PERIODIC_MAINTENANCE_STATUS_COUNT,
    {
      onError: (err) => {
        errorMessage(err, "Error loading status count.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  //Fetch all machine status count
  useEffect(() => {
    allPMStatusCount({ variables: filter });
  }, [filter]);
  let completed = 0;
  let ongoing = 0;
  let upcoming = 0;
  let overdue = 0;
  let total = 0;
  let normalized_completed = 0;
  let normalized_ongoing = 0;
  let normalized_overdue = 0;
  //console.log(statusCount?.working);
  const statusCount = statusData?.allPMStatusCount;
  if (statusCount) {
    completed = statusCount?.completed;
    ongoing = statusCount?.ongoing;
    upcoming = statusCount?.upcoming;
    overdue = statusCount?.overdue;
    total = completed + ongoing + upcoming + overdue;

    normalized_completed = ((completed - 0) / (total - 0)) * 100;
    normalized_ongoing = ((ongoing - 0) / (total - 0)) * 100;
    normalized_overdue = ((overdue - 0) / (total - 0)) * 100;
  }

  return (
    <div
      className={classes["container"]}
      title={`${completed + ongoing + overdue}`}
    >
      <div className={classes["bar-container"]}>
        <div className={classes["status-info"]}>
          <CountUp
            className={classes["status-count"]}
            end={completed}
            duration={1}
          />
          <span className={classes["status-title"]}>Completed</span>
        </div>

        <div className={classes["bar-box"]}>
          <Progress
            percent={parseInt(normalized_completed.toFixed(0))}
            strokeColor={"var(--working-bar-color)"}
          />
        </div>
      </div>
      <div className={classes["bar-container"]}>
        <div className={classes["status-info"]}>
          <CountUp
            className={classes["status-count"]}
            end={ongoing}
            duration={1}
          />
          <span className={classes["status-title"]}>Ongoing</span>
        </div>
        <div className={classes["bar-box"]}>
          <Progress
            percent={parseInt(normalized_ongoing.toFixed(0))}
            strokeColor={"var(--critical-bar-color)"}
          />
        </div>
      </div>
      <div className={classes["bar-container"]}>
        <div className={classes["status-info"]}>
          <CountUp
            className={classes["status-count"]}
            end={overdue}
            duration={1}
          />
          <span className={classes["status-title"]}>Overdue</span>
        </div>
        <div className={classes["bar-box"]}>
          <Progress
            percent={parseInt(normalized_overdue.toFixed(0))}
            strokeColor={"var(--breakdown-bar-color)"}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(MaintenanceProgressBar);
