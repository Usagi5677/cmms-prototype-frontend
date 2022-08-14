import { Avatar, Checkbox, Collapse, Empty, Select, Spin, Tooltip } from "antd";
import classes from "./AllEntityPMTask.module.css";
import {
  FaArrowAltCircleRight,
  FaMapMarkerAlt,
  FaTractor,
} from "react-icons/fa";
import moment from "moment";
import { useLazyQuery } from "@apollo/client";
import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  GET_ALL_ENTITY_PM_TASK_STATUS_COUNT,
  GET_ALL_ENTITY_PM_TASK,
} from "../../../../api/queries";
import UserContext from "../../../../contexts/UserContext";
import { ISLANDS } from "../../../../helpers/constants";
import { errorMessage } from "../../../../helpers/gql";
import { stringToColor } from "../../../../helpers/style";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import DefaultPaginationArgs from "../../../../models/DefaultPaginationArgs";
import { PeriodicMaintenanceStatus } from "../../../../models/Enums";
import PaginationArgs from "../../../../models/PaginationArgs";
import PaginationButtons from "../../../common/PaginationButtons/PaginationButtons";
import PeriodicMaintenanceStatusTag from "../../../common/PeriodicMaintenanceStatusTag";
import Search from "../../../common/Search";
import EntityPMStatusFilter from "../../../common/EntityPMStatusFilter";
import EntityPMTask from "../../../../models/Entity/EntityPMTask";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const AllEntityPMTask = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<any>();
  const [timerId, setTimerId] = useState(null);
  const [location, setLocation] = useState([]);
  const [complete, setComplete] = useState(false);
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      status: any;
      location: string[];
      complete: boolean;
    }
  >({
    first: 3,
    last: null,
    before: null,
    after: null,
    search: "",
    status: null,
    location: [],
    complete: false,
  });

  const [
    getAllEntityPMTaskStatusCount,
    { data: statusData, loading: statusLoading },
  ] = useLazyQuery(GET_ALL_ENTITY_PM_TASK_STATUS_COUNT, {
    onError: (err) => {
      errorMessage(
        err,
        "Error loading all entity periodic maintenance task status count."
      );
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [getAllEntityPeriodicMaintenanceTask, { data, loading }] = useLazyQuery(
    GET_ALL_ENTITY_PM_TASK,
    {
      onError: (err) => {
        errorMessage(
          err,
          "Error loading all entity periodic maintenance tasks."
        );
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch pm when component mounts or when the filter object changes
  useEffect(() => {
    getAllEntityPeriodicMaintenanceTask({ variables: filter });
    getAllEntityPMTaskStatusCount();
  }, [
    filter,
    getAllEntityPeriodicMaintenanceTask,
    getAllEntityPMTaskStatusCount,
  ]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    statusValue: PeriodicMaintenanceStatus,
    locationValue: string[],
    completeValue: boolean
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          status: statusValue,
          location: locationValue,
          complete: completeValue,
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
    searchDebounced(search, status, location, complete);
    // eslint-disable-next-line
  }, [search, status, location, complete]);

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

  const pageInfo = data?.getAllEntityPeriodicMaintenanceTask.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let done = statusData?.allEntityPMTaskStatusCount?.done;
  let pending = statusData?.allEntityPMTaskStatusCount?.pending;
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
      initial={{ x: -60, opacity: 0 }}
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
            delay: 0.8,
          },
        }}
        viewport={{ once: true }}
      >
        Periodic Maintenance Tasks
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
              delay: 1,
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

        <div className={classes["status-wrapper"]}>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                ease: "easeOut",
                duration: 0.3,
                delay: 1.1,
              },
            }}
            viewport={{ once: true }}
          >
            <EntityPMStatusFilter
              onChange={(status) => {
                setFilter({ ...filter, status, ...DefaultPaginationArgs });
                setPage(1);
                setStatus(status);
              }}
              value={filter.status}
            />
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
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
            <Select
              showArrow
              className={classes["location"]}
              onChange={(value) => setLocation(value)}
              showSearch
              options={options}
              placeholder={"Location"}
              mode="multiple"
            />
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
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
            <Checkbox onChange={(e) => setComplete(e.target.checked)}>
              Complete
            </Checkbox>
          </motion.div>
        </div>
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
                delay: 1.4,
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
                delay: 1.4,
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
            initial={{ x: 20, opacity: 0 }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                ease: "easeOut",
                duration: 0.3,
                delay: 1.5,
              },
            }}
            viewport={{ once: true }}
          >
            <CountUp end={done} duration={1} />
          </motion.div>
          <motion.div
            className={classes["done"]}
            initial={{ x: 20, opacity: 0 }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                ease: "easeOut",
                duration: 0.3,
                delay: 1.5,
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
      {data?.getAllEntityPeriodicMaintenanceTask.edges.length > 0 ? (
        data?.getAllEntityPeriodicMaintenanceTask.edges.map(
          (rec: { node: EntityPMTask }) => {
            const periodicMaintenanceTask = rec.node;
            return (
              <motion.div
                id="collapse"
                key={periodicMaintenanceTask.id}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    ease: "easeOut",
                    duration: 0.3,
                    delay: 1.7,
                  },
                }}
                viewport={{ once: true }}
              >
                <Collapse ghost style={{ marginBottom: ".5rem" }}>
                  <Collapse.Panel
                    header={
                      <>
                        <div
                          className={classes["header-container"]}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className={classes["first-block"]}>
                            <div>
                              <div className={classes["title-wrapper"]}>
                                <FaTractor />
                                <span className={classes["title"]}>
                                  {
                                    periodicMaintenanceTask?.periodicMaintenance
                                      ?.entity?.machineNumber
                                  }
                                </span>
                              </div>
                              <div className={classes["location-wrapper"]}>
                                <FaMapMarkerAlt style={{ marginRight: 5 }} />
                                <div>
                                  <div className={classes["location-width"]}>
                                    {
                                      periodicMaintenanceTask
                                        ?.periodicMaintenance?.entity?.location
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={classes["service-reading-wrapper"]}>
                            <div className={classes["reading"]}>
                              <span className={classes["reading-title"]}>
                                Task:
                              </span>
                              <span>{periodicMaintenanceTask?.name}</span>
                            </div>
                            <div className={classes["reading"]}>
                              <div>
                                <span className={classes["reading-title"]}>
                                  Assigned to:
                                </span>
                                <span className={classes["center"]}>
                                  {periodicMaintenanceTask.periodicMaintenance
                                    .entity?.assignees?.length > 0 ? (
                                    <Avatar.Group
                                      maxCount={5}
                                      maxStyle={{
                                        color: "#f56a00",
                                        backgroundColor: "#fde3cf",
                                      }}
                                    >
                                      {periodicMaintenanceTask.periodicMaintenance.entity?.assignees?.map(
                                        (assign) => {
                                          return (
                                            <Tooltip
                                              title={
                                                <>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    {assign?.user?.fullName} (
                                                    {assign?.user?.rcno})
                                                  </div>
                                                </>
                                              }
                                              placement="bottom"
                                              key={assign?.user?.id}
                                            >
                                              <Avatar
                                                style={{
                                                  backgroundColor:
                                                    stringToColor(
                                                      assign?.user?.fullName!
                                                    ),
                                                }}
                                                size={22}
                                              >
                                                {assign?.user?.fullName
                                                  .match(/^\w|\b\w(?=\S+$)/g)
                                                  ?.join()
                                                  .replace(",", "")
                                                  .toUpperCase()}
                                              </Avatar>
                                            </Tooltip>
                                          );
                                        }
                                      )}
                                    </Avatar.Group>
                                  ) : (
                                    <span>None</span>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className={classes["status"]}>
                              <PeriodicMaintenanceStatusTag
                                status={
                                  periodicMaintenanceTask?.periodicMaintenance
                                    ?.status
                                }
                              />
                            </div>
                          </div>
                          <Link
                            to={
                              "/entity/" +
                              periodicMaintenanceTask?.periodicMaintenance
                                ?.entity?.id
                            }
                          >
                            <Tooltip title="Open">
                              <FaArrowAltCircleRight
                                className={classes["button"]}
                              />
                            </Tooltip>
                          </Link>
                        </div>
                      </>
                    }
                    key={periodicMaintenanceTask?.id!}
                  >
                    <div className={classes["container"]}></div>
                  </Collapse.Panel>
                </Collapse>
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

export default AllEntityPMTask;
/*



*/
