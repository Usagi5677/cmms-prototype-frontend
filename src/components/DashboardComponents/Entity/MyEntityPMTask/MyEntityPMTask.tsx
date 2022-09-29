import { useLazyQuery } from "@apollo/client";
import {
  Avatar,
  Checkbox,
  Collapse,
  Empty,
  Image,
  Skeleton,
  Spin,
  Tooltip,
} from "antd";
import { motion } from "framer-motion";
import { useContext, useState, useEffect, useRef } from "react";
import CountUp from "react-countup";
import { FaArrowAltCircleRight, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  GET_ALL_ENTITY_PM_TASK_STATUS_COUNT,
  GET_ALL_ENTITY_PM_TASK,
} from "../../../../api/queries";
import UserContext from "../../../../contexts/UserContext";
import { getListImage } from "../../../../helpers/getListImage";
import { errorMessage } from "../../../../helpers/gql";
import { stringToColor } from "../../../../helpers/style";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import EntityPMTask from "../../../../models/Entity/EntityPMTask";
import PaginationArgs from "../../../../models/PaginationArgs";
import { EntityIcon } from "../../../common/EntityIcon";
import PaginationButtons from "../../../common/PaginationButtons/PaginationButtons";
import Search from "../../../common/Search";
import { LocationSelector } from "../../../Config/Location/LocationSelector";
import { ZoneSelector } from "../../../Config/Zone/ZoneSelector";
import classes from "./MyEntityPMTask.module.css";

const MyEntityPMTask = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [locationIds, setLocationIds] = useState([]);
  const [zoneIds, setZoneIds] = useState([]);
  const [complete, setComplete] = useState(false);
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      locationIds: number[];
      zoneIds: number[];
      complete: boolean;
      assignedToId: number;
    }
  >({
    first: 5,
    last: null,
    before: null,
    after: null,
    search: "",
    locationIds: [],
    zoneIds: [],
    complete: false,
    assignedToId: self.id,
  });

  const [
    getAllEntityPMTaskStatusCount,
    { data: statusData, loading: statusLoading },
  ] = useLazyQuery(GET_ALL_ENTITY_PM_TASK_STATUS_COUNT, {
    onError: (err) => {
      errorMessage(
        err,
        "Error loading my entity periodic maintenance task status count."
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
          "Error loading my entity periodic maintenance tasks."
        );
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch pm when component mounts or when the filter object changes
  useEffect(() => {
    getAllEntityPeriodicMaintenanceTask({ variables: filter });
    getAllEntityPMTaskStatusCount({ variables: filter });
  }, [filter, getAllEntityPeriodicMaintenanceTask]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    locationIdsValue: number[],
    zoneIdsValue: number[],
    completeValue: boolean
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          locationIds: locationIdsValue,
          zoneIds: zoneIdsValue,
          complete: completeValue,
          first: 5,
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
    searchDebounced(search, locationIds, zoneIds, complete);
    // eslint-disable-next-line
  }, [search, locationIds, zoneIds, complete]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: 5,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 5,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.getAllEntityPeriodicMaintenanceTask.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let complete2 = statusData?.allEntityPMTaskStatusCount?.complete;
  let ongoing = statusData?.allEntityPMTaskStatusCount?.ongoing;

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
            delay: 0.5,
          },
        }}
        viewport={{ once: true }}
      >
        My Periodic Maintenance Tasks
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
              delay: 0.4,
            },
          }}
          viewport={{ once: true }}
          style={{ width: "100%" }}
        >
          <Search
            searchValue={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch("")}
            width={"100%"}
          />
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: {
              ease: "easeOut",
              duration: 0.3,
              delay: 0.5,
            },
          }}
          viewport={{ once: true }}
          className={classes["option"]}
        >
          <LocationSelector
            setLocationId={setLocationIds}
            multiple={true}
            rounded={true}
            width={"100%"}
          />
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: {
              ease: "easeOut",
              duration: 0.3,
              delay: 0.6,
            },
          }}
          viewport={{ once: true }}
          className={classes["option"]}
        >
          <ZoneSelector
            setZoneId={setZoneIds}
            multiple={true}
            rounded={true}
            width={"100%"}
          />
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: {
              ease: "easeOut",
              duration: 0.3,
              delay: 0.7,
            },
          }}
          viewport={{ once: true }}
          className={classes["option"]}
        >
          <Checkbox onChange={(e) => setComplete(e.target.checked)}>
            Complete
          </Checkbox>
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
                delay: 0.8,
              },
            }}
            viewport={{ once: true }}
          >
            <CountUp end={ongoing} duration={1} />
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
                delay: 0.8,
              },
            }}
            viewport={{ once: true }}
          >
            Ongoing
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
                delay: 0.8,
              },
            }}
            viewport={{ once: true }}
          >
            <CountUp end={complete2} duration={1} />
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
                delay: 0.8,
              },
            }}
            viewport={{ once: true }}
          >
            Complete
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
            let imagePath = getListImage(
              periodicMaintenanceTask?.periodicMaintenance?.entity?.type?.name
            );

            let loading = true;
            if (imagePath) {
              loading = false;
            }
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
                    delay: 0.3,
                  },
                }}
                viewport={{ once: true }}
              >
                <Collapse ghost style={{ marginBottom: ".5rem" }}>
                  <Collapse.Panel
                    header={
                      <>
                        <div className={classes["header-container"]}>
                          <div className={classes["first-block"]}>
                            {loading ? (
                              <Skeleton.Image
                                style={{
                                  width: 60,
                                  height: 50,
                                  borderRadius: 6,
                                }}
                              />
                            ) : (
                              <Image
                                src={imagePath}
                                height={50}
                                width={60}
                                preview={false}
                              />
                            )}
                            <div>
                              <div className={classes["title-wrapper"]}>
                                <EntityIcon
                                  entityType={
                                    periodicMaintenanceTask?.periodicMaintenance
                                      ?.entity?.type?.entityType
                                  }
                                />
                                <span className={classes["title"]}>
                                  {
                                    periodicMaintenanceTask?.periodicMaintenance
                                      ?.entity?.machineNumber
                                  }
                                </span>
                              </div>
                              <div className={classes["title-wrapper"]}>
                                <FaMapMarkerAlt style={{ marginRight: 5 }} />
                                <div>
                                  <div className={classes["location-width"]}>
                                    {
                                      periodicMaintenanceTask
                                        ?.periodicMaintenance?.entity?.location
                                        ?.name
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={classes["second-block"]}>
                            <div className={classes["reading"]}>
                              <span className={classes["reading-title"]}>
                                Task:
                              </span>
                              <span>{periodicMaintenanceTask?.name}</span>
                            </div>
                            <div
                              className={classes["reading"]}
                              style={{ marginTop: 2 }}
                            >
                              <span className={classes["reading-title"]}>
                                Assigned to:
                              </span>
                              <span>
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
                                                backgroundColor: stringToColor(
                                                  assign?.user?.fullName!
                                                ),
                                              }}
                                              size={20}
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

export default MyEntityPMTask;
