import { useLazyQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { memo, useEffect } from "react";
import CountUp from "react-countup";
import { GET_ALL_ENTITY_STATUS_COUNT } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import { EntityStatus } from "../../../models/Enums";
import classes from "./EntityStatusProgressBarV2.module.css";

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
const EntityStatusProgressBarV2 = ({
  name,
  filter,
}: {
  name?: string;
  filter?: filter;
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
  let normalized_working = 0;
  let normalized_critical = 0;
  let normalized_breakdown = 0;
  //console.log(statusCount?.working);
  const statusCount = statusData?.allEntityStatusCount;
  if (statusCount) {
    critical = statusCount?.critical;
    working = statusCount?.working;
    breakdown = statusCount?.breakdown;
    //dispose = statusCountData?.dispose;
    total = critical + working + breakdown + dispose;

    normalized_working = ((working - 0) / (total - 0)) * 100;
    normalized_critical = ((critical - 0) / (total - 0)) * 100;
    normalized_breakdown = ((breakdown - 0) / (total - 0)) * 100;
  }

  return (
    <div
      className={classes["container"]}
      title={`${working + critical + breakdown}`}
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
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            viewport={{ once: true }}
            className={classes["bar-wrapper"]}
            style={{
              backgroundColor: "var(--working-bg)",
              border: "1px solid var(--working-bar-color)",
            }}
          >
            {parseInt(normalized_working.toFixed(0)) > 0 ? (
              <motion.div
                className={classes["working-bar"]}
                initial={{ width: "0%" }}
                animate={{ width: `${normalized_working.toFixed(0)}%` }}
                exit={{ width: "0%" }}
                viewport={{ once: true }}
                transition={{ type: "spring" }}
              >
                <motion.div
                  className={classes["percentage"]}
                  animate={{ x: 0, opacity: 1 }}
                  initial={{ x: -100, opacity: 0 }}

                  viewport={{ once: true }}
                >
                  <CountUp
                    end={parseInt(normalized_working.toFixed(0))}
                    duration={1}
                  />
                  %
                </motion.div>
              </motion.div>
            ) : (
              <motion.div className={classes["percentage"]} style={{color:"var(--text-primary)"}}>
                <CountUp
                  end={parseInt(normalized_working.toFixed(0))}
                  duration={1}
                />
                %
              </motion.div>
            )}
          </motion.div>
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
          <motion.div
            className={classes["bar-wrapper"]}
            style={{
              backgroundColor: "var(--critical-bg)",
              border: "1px solid var(--critical-bar-color)",
            }}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {parseInt(normalized_critical.toFixed(0)) > 0 ? (
              <motion.div
                className={classes["critical-bar"]}
                initial={{ width: "0%" }}
                animate={{ width: `${normalized_critical.toFixed(0)}%` }}
                exit={{ width: "0%" }}
                transition={{ type: "spring" }}
                viewport={{ once: true }}
              >
                <motion.div
                  className={classes["percentage"]}
                  animate={{ x: 0, opacity: 1 }}
                  initial={{ x: -100, opacity: 0 }}
                  viewport={{ once: true }}
                >
                  <CountUp
                    end={parseInt(normalized_critical.toFixed(0))}
                    duration={1}
                  />
                  %
                </motion.div>
              </motion.div>
            ) : (
              <motion.div className={classes["percentage"]} style={{color:"var(--text-primary)"}}>
                <CountUp
                  end={parseInt(normalized_critical.toFixed(0))}
                  duration={1}
                />
                %
              </motion.div>
            )}
          </motion.div>
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
          <motion.div
            className={classes["bar-wrapper"]}
            style={{
              backgroundColor: "var(--breakdown-bg)",
              border: "1px solid var(--breakdown-bar-color)",
            }}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {parseInt(normalized_breakdown.toFixed(0)) > 0 ? (
              <motion.div
                className={classes["breakdown-bar"]}
                initial={{ width: "0%" }}
                animate={{ width: `${normalized_breakdown.toFixed(0)}%` }}
                exit={{ width: "0%" }}
                transition={{ type: "spring" }}
              >
                <motion.div
                  className={classes["percentage"]}
                  animate={{ x: 0, opacity: 1 }}
                  initial={{ x: -100, opacity: 0 }}
                  viewport={{ once: true }}
                >
                  <CountUp
                    end={parseInt(normalized_breakdown.toFixed(0))}
                    duration={1}
                  />
                  %
                </motion.div>
              </motion.div>
            ) : (
              <motion.div className={classes["percentage"]} style={{color:"var(--text-primary)"}}>
                <CountUp
                  end={parseInt(normalized_breakdown.toFixed(0))}
                  duration={1}
                />
                %
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default memo(EntityStatusProgressBarV2);
