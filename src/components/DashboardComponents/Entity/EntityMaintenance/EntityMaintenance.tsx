import { Collapse, Empty, Select, Spin, Tooltip } from "antd";
import classes from "./EntityMaintenance.module.css";
import {
  FaArrowAltCircleRight,
  FaMapMarkerAlt,
  FaRegClock,
  FaTractor,
  FaTruck,
} from "react-icons/fa";
import moment from "moment";
import { useLazyQuery } from "@apollo/client";
import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  GET_ALL_ENTITY_PM_STATUS_COUNT,
  GET_ALL_ENTITY_PERIODIC_MAINTENANCE,
  PERIODIC_MAINTENANCE_SUMMARIES,
} from "../../../../api/queries";
import UserContext from "../../../../contexts/UserContext";
import { ISLANDS, DATETIME_FORMATS } from "../../../../helpers/constants";
import { errorMessage } from "../../../../helpers/gql";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import DefaultPaginationArgs from "../../../../models/DefaultPaginationArgs";
import { PeriodicMaintenanceStatus } from "../../../../models/Enums";
import PaginationArgs from "../../../../models/PaginationArgs";
import PaginationButtons from "../../../common/PaginationButtons/PaginationButtons";
import PeriodicMaintenanceStatusTag from "../../../common/PeriodicMaintenanceStatusTag";
import Search from "../../../common/Search";
import EntityPeriodicMaintenance from "../../../../models/Entity/EntityPeriodicMaintenance";
import EntityPMStatusFilter from "../../../common/EntityPMStatusFilter";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { RiSailboatFill } from "react-icons/ri";
import { LocationSelector } from "../../../Config/Location/LocationSelector";
import PeriodicMaintenance from "../../../../models/PeriodicMaintenance/PeriodicMaintenance";
import PeriodicMaintenanceCard from "../../../EntityComponents/PeriodicMaintenanceCard/PeriodicMaintenanceCard";

const EntityMaintenance = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [timerId, setTimerId] = useState(null);


  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;


    }
  >({
    first: 3,
    last: null,
    before: null,
    after: null,
    search: "",

  });

  const [
    getAllEntityPMStatusCount,
    { data: statusData, loading: statusLoading },
  ] = useLazyQuery(GET_ALL_ENTITY_PM_STATUS_COUNT, {
    onError: (err) => {
      errorMessage(err, "Error loading all periodic maintenance status count.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [getAllEntityPeriodicMaintenance, { data, loading }] = useLazyQuery(
    GET_ALL_ENTITY_PERIODIC_MAINTENANCE,
    {
      onError: (err) => {
        errorMessage(err, "Error loading all periodic maintenance.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch pm when component mounts or when the filter object changes
  useEffect(() => {
    getAllEntityPeriodicMaintenance({ variables: filter });
    getAllEntityPMStatusCount();
  }, [filter, getAllEntityPeriodicMaintenance, getAllEntityPMStatusCount]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          first: 3,
          last: null,
          before: null,
          after: null,
        }));
        setPage(1);
      }, 500)
    );
  };
  const initialRender = useRef<boolean>(true);
  useEffect(() => {
    if (initialRender.current === true) {
      initialRender.current = false;
      return;
    }
    // eslint-disable-next-line no-restricted-globals
    searchDebounced(search);
    // eslint-disable-next-line
  }, [search]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: 3,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 3,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.getAllEntityPeriodicMaintenance.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let missed = statusData?.allEntityPMStatusCount?.missed;
  let done = statusData?.allEntityPMStatusCount?.done;
  let pending = statusData?.allEntityPMStatusCount?.pending;

  let options: any = [];
  ISLANDS?.map((island: string) => {
    options.push({
      value: island,
      label: island,
    });
  });

  return (
    <motion.div
      className={classes["pm-container"]}
      initial={{ x: 60, opacity: 0 }}
      whileInView={{
        x: 0,
        opacity: 1,
        transition: {
          ease: "easeOut",
          duration: 0.3,
          delay: 0.3,
        },
      }}
      viewport={{ once: true }}
    >
      <motion.div
        className={classes["heading"]}
        initial={{ y: -20, opacity: 0 }}
        whileInView={{
          y: 0,
          opacity: 1,
          transition: {
            ease: "easeOut",
            duration: 0.3,
            delay: 0.5,
          },
        }}
        viewport={{ once: true }}
      >
        Perioidic Maintenance
      </motion.div>
      <div className={classes["options-wrapper"]}>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: {
              ease: "easeOut",
              duration: 0.3,
              delay: 0.8,
            },
          }}
          viewport={{ once: true }}
        >
          <Search
            searchValue={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch("")}
          />
        </motion.div>
      </div>
      <div className={classes["counter-container"]}>
        <div className={classes["counter-wrapper"]}>
          <motion.div
            className={classes["counter-value"]}
            initial={{ x: -20, opacity: 0 }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                ease: "easeOut",
                duration: 0.3,
                delay: 1.2,
              },
            }}
            viewport={{ once: true }}
          >
            <CountUp end={missed} duration={1} />
          </motion.div>
          <motion.div
            className={classes["missed"]}
            initial={{ x: -20, opacity: 0 }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                ease: "easeOut",
                duration: 0.3,
                delay: 1.2,
              },
            }}
            viewport={{ once: true }}
          >
            Missed
          </motion.div>
        </div>
        <div className={classes["counter-wrapper"]}>
          <motion.div
            className={classes["counter-value"]}
            initial={{ x: -20, opacity: 0 }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                ease: "easeOut",
                duration: 0.3,
                delay: 1.3,
              },
            }}
            viewport={{ once: true }}
          >
            <CountUp end={pending} duration={1} />
          </motion.div>
          <motion.div
            className={classes["pending"]}
            initial={{ x: -20, opacity: 0 }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                ease: "easeOut",
                duration: 0.3,
                delay: 1.3,
              },
            }}
            viewport={{ once: true }}
          >
            Pending
          </motion.div>
        </div>
        <div className={classes["counter-wrapper"]}>
          <motion.div
            className={classes["counter-value"]}
            initial={{ x: -20, opacity: 0 }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                ease: "easeOut",
                duration: 0.3,
                delay: 1.4,
              },
            }}
            viewport={{ once: true }}
          >
            <CountUp end={done} duration={1} />
          </motion.div>
          <motion.div
            className={classes["done"]}
            initial={{ x: -20, opacity: 0 }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                ease: "easeOut",
                duration: 0.3,
                delay: 1.4,
              },
            }}
            viewport={{ once: true }}
          >
            Done
          </motion.div>
        </div>
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      {data?.getAllEntityPeriodicMaintenance.edges.length > 0 ? (
        data?.getAllEntityPeriodicMaintenance.edges.map(
          (rec: { node: PeriodicMaintenance }) => {
            const periodicMaintenance = rec.node;
            const isOlderPeriodicMaintenance = moment(
              periodicMaintenance.to
            ).isBefore(moment(), "second");
            return (
              <motion.div
                id="collapse"
                key={periodicMaintenance.id}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    ease: "easeOut",
                    duration: 0.3,
                    delay: 0.3,
                  },
                }}
                viewport={{ once: true }}
              >
                <PeriodicMaintenanceCard
                  periodicMaintenance={periodicMaintenance}
                  isDeleted={periodicMaintenance?.entity?.deletedAt !== null}
                  isOlder={isOlderPeriodicMaintenance}
                  isCopy
                />
              </motion.div>
            );
          }
        )
      ) : (
        <Empty />
      )}

      <PaginationButtons
        pageInfo={pageInfo}
        page={page}
        next={next}
        back={back}
        pageLimit={3}
      />
    </motion.div>
  );
};

export default EntityMaintenance;
