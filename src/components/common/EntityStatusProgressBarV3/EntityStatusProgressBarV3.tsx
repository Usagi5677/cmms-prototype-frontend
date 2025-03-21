import { useLazyQuery } from "@apollo/client";
import { Progress } from "antd";
import { memo, useEffect } from "react";
import CountUp from "react-countup";
import { GET_ALL_ENTITY_STATUS_COUNT } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import { EntityStatus } from "../../../models/Enums";
import classes from "./EntityStatusProgressBarV3.module.css";

interface filter {
  first?: number | null;
  last?: number | null;
  after?: string | null;
  before?: string | null;
  search: string;
  status: EntityStatus[];
  locationIds: number[];
  entityType: string[];
  typeIds: number[];
  zoneIds: number[];
  divisionIds: number[];
  brandIds: number[];
  isAssigned: boolean;
  //assignedToId: number | null;
  measurement: string[];
  lteInterService: string;
  gteInterService: string;
  isIncompleteChecklistTask: boolean;
}
const EntityStatusProgressBarV3 = ({
  name,
  filter,
  disposeView,
}: {
  name?: string;
  filter?: filter;
  disposeView?: boolean;
}) => {
  const [getAllEntityStatusCount, { data: statusData }] = useLazyQuery(
    GET_ALL_ENTITY_STATUS_COUNT,
    {
      onError: (err) => {
        errorMessage(err, "Error loading status count of entities.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  //Fetch all machine status count
  useEffect(() => {
    getAllEntityStatusCount({ variables: filter });
  }, [filter]);
  let critical = 0;
  let working = 0;
  let breakdown = 0;
  let dispose = 0;
  let total = 0;
  let total_with_dispose = 0;
  let normalized_working = 0;
  let normalized_critical = 0;
  let normalized_breakdown = 0;
  //console.log(statusCount?.working);
  const statusCount = statusData?.allEntityStatusCount;
  if (statusCount) {
    critical = statusCount?.critical;
    working = statusCount?.working;
    breakdown = statusCount?.breakdown;
    dispose = statusCount?.dispose;
    total = critical + working + breakdown;
    total_with_dispose = statusCount?.total;
    normalized_working = ((working - 0) / (total - 0)) * 100;
    normalized_critical = ((critical - 0) / (total - 0)) * 100;
    normalized_breakdown = ((breakdown - 0) / (total - 0)) * 100;
  }

  return !disposeView ? (
    <div
      className={classes["container"]}
      title={`Total: ${working + critical + breakdown}`}
    >
      <div className={classes["bar-container"]}>
        <div className={classes["status-info"]}>
          <CountUp
            className={classes["status-count"]}
            end={working}
            duration={1}
          />
          <span className={classes["status-title"]}>Working</span>
        </div>

        <div className={classes["bar-box"]}>
          <Progress
            percent={parseInt(normalized_working.toFixed(0))}
            strokeColor={"var(--working-bar-color)"}
          />
        </div>
      </div>
      <div className={classes["bar-container"]}>
        <div className={classes["status-info"]}>
          <CountUp
            className={classes["status-count"]}
            end={critical}
            duration={1}
          />
          <span className={classes["status-title"]}>Critical</span>
        </div>
        <div className={classes["bar-box"]}>
          <Progress
            percent={parseInt(normalized_critical.toFixed(0))}
            strokeColor={"var(--critical-bar-color)"}
          />
        </div>
      </div>
      <div className={classes["bar-container"]}>
        <div className={classes["status-info"]}>
          <CountUp
            className={classes["status-count"]}
            end={breakdown}
            duration={1}
          />
          <span className={classes["status-title"]}>Breakdown</span>
        </div>
        <div className={classes["bar-box"]}>
          <Progress
            percent={parseInt(normalized_breakdown.toFixed(0))}
            strokeColor={"var(--breakdown-bar-color)"}
          />
        </div>
      </div>
    </div>
  ) : (
    <div
      className={classes["container"]}
      title={`Total: ${total_with_dispose}`}
    >
      <div className={classes["bar-container"]}>
        <div className={classes["status-info"]}>
          <CountUp
            className={classes["status-count"]}
            end={dispose}
            duration={1}
          />
          <span className={classes["status-title"]}>Dispose</span>
        </div>

        <div className={classes["bar-box"]}>
          <Progress
            percent={parseInt(((dispose / total_with_dispose) * 100).toFixed(0))}
            strokeColor={"var(--dispose-bar-color)"}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(EntityStatusProgressBarV3);
