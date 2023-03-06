import { useLazyQuery } from "@apollo/client";
import { motion, useDragControls } from "framer-motion";
import { memo, useEffect } from "react";
import CountUp from "react-countup";
import { GET_ALL_ENTITY_STATUS_COUNT } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import { EntityStatus } from "../../../models/Enums";
import classes from "./EntityStatusProgressBar.module.css";

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
const EntityStatusProgressBar = ({
  name,
  filter,
}: {
  name?: string;
  filter?: filter;
}) => {
  const isSmallDevice = useIsSmallDevice(1200, true);
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
  const dragControls = useDragControls();
  let workingBars = [];
  let breakdownBars = [];
  let criticalBars = [];
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

    for (let i = 0; i < parseInt(normalized_working.toFixed(0)); i++) {
      workingBars.push(
        <motion.div
          animate={{ x: 0, opacity: 1 }}
          initial={{ x: -100, opacity: 0 }}
          transition={{ delay: i * 0.01, type: "spring" }}
          viewport={{ once: true }}
          className={classes["working-bar"]}
          key={i}
        />
      );
    }
    for (let i = 0; i < parseInt(normalized_critical.toFixed(0)); i++) {
      criticalBars.push(
        <motion.div
          animate={{ x: 0, opacity: 1 }}
          initial={{ x: -100, opacity: 0 }}
          transition={{ delay: i * 0.01, type: "spring" }}
          viewport={{ once: true }}
          className={classes["critical-bar"]}
          key={i}
        />
      );
    }
    for (let i = 0; i < parseInt(normalized_breakdown.toFixed(0)); i++) {
      breakdownBars.push(
        <motion.div
          animate={{ x: 0, opacity: 1 }}
          initial={{ x: -100, opacity: 0 }}
          transition={{ delay: i * 0.01, type: "spring" }}
          viewport={{ once: true }}
          className={classes["breakdown-bar"]}
          key={i}
        />
      );
    }
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
            {workingBars}
            {!isSmallDevice && (
              <motion.div
                className={classes["percentage"]}
                animate={{ x: 0, opacity: 1 }}
                initial={{ x: -100, opacity: 0 }}
                transition={{ delay: 1, type: "spring" }}
                viewport={{ once: true }}
              >
                <CountUp
                  end={parseInt(normalized_working.toFixed(0))}
                  duration={1}
                />
                %
              </motion.div>
            )}
          </motion.div>
          {isSmallDevice && (
            <motion.div
              className={classes["percentage"]}
              style={{ width: 40 }}
              animate={{ x: 0, opacity: 1 }}
              initial={{ x: -100, opacity: 0 }}
              transition={{ delay: 1, type: "spring" }}
              viewport={{ once: true }}
            >
              <CountUp
                end={parseInt(normalized_working.toFixed(0))}
                duration={1}
              />
              %
            </motion.div>
          )}
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
            {criticalBars}
            {!isSmallDevice && (
              <motion.div
                className={classes["percentage"]}
                animate={{ x: 0, opacity: 1 }}
                initial={{ x: -100, opacity: 0 }}
                transition={{ delay: 1, type: "spring" }}
                viewport={{ once: true }}
              >
                <CountUp
                  end={parseInt(normalized_critical.toFixed(0))}
                  duration={1}
                />
                %
              </motion.div>
            )}
          </motion.div>
          {isSmallDevice && (
            <motion.div
              className={classes["percentage"]}
              style={{ width: 40 }}
              animate={{ x: 0, opacity: 1 }}
              initial={{ x: -100, opacity: 0 }}
              transition={{ delay: 1, type: "spring" }}
              viewport={{ once: true }}
            >
              <CountUp
                end={parseInt(normalized_critical.toFixed(0))}
                duration={1}
              />
              %
            </motion.div>
          )}
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
            {breakdownBars}
            {!isSmallDevice && (
              <motion.div
                className={classes["percentage"]}
                animate={{ x: 0, opacity: 1 }}
                initial={{ x: -100, opacity: 0 }}
                transition={{ delay: 1, type: "spring" }}
                viewport={{ once: true }}
              >
                <CountUp
                  end={parseInt(normalized_breakdown.toFixed(0))}
                  duration={1}
                />
                %
              </motion.div>
            )}
          </motion.div>
          {isSmallDevice && (
            <motion.div
              className={classes["percentage"]}
              style={{ width: 40 }}
              animate={{ x: 0, opacity: 1 }}
              initial={{ x: -100, opacity: 0 }}
              transition={{ delay: 1, type: "spring" }}
              viewport={{ once: true }}
            >
              <CountUp
                end={parseInt(normalized_breakdown.toFixed(0))}
                duration={1}
              />
              %
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(EntityStatusProgressBar);
