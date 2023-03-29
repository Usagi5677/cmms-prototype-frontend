import { useLazyQuery } from "@apollo/client";
import {
  Avatar,
  Checkbox,
  Collapse,
  DatePicker,
  Empty,
  Image,
  Skeleton,
  Spin,
  Tooltip,
} from "antd";
import { motion } from "framer-motion";
import moment from "moment";
import { useContext, useState, useEffect, useRef, memo } from "react";
import CountUp from "react-countup";
import { FaArrowAltCircleRight, FaMapMarkerAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  GET_ALL_ENTITY_PM_TASK_STATUS_COUNT,
  GET_ALL_ENTITY_PM_TASK,
} from "../../../../api/queries";
import UserContext from "../../../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../../../helpers/constants";
import { getListImage } from "../../../../helpers/getListImage";
import { errorMessage } from "../../../../helpers/gql";
import { stringToColor } from "../../../../helpers/style";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import EntityAssignment from "../../../../models/Entity/EntityAssign";
import EntityPMTask from "../../../../models/Entity/EntityPMTask";
import PaginationArgs from "../../../../models/PaginationArgs";
import PaginationButtons from "../../../common/PaginationButtons/PaginationButtons";
import Search from "../../../common/Search";
import SizeableTag from "../../../common/SizeableTag/SizeableTag";
import { LocationSelector } from "../../../Config/Location/LocationSelector";
import { ZoneSelector } from "../../../Config/Zone/ZoneSelector";
import classes from "./MyEntityPMTask.module.css";

const MyEntityPMTask = () => {
  const { user: self } = useContext(UserContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [locationIds, setLocationIds] = useState([]);
  const [zoneIds, setZoneIds] = useState([]);
  const [dates, setDates] = useState<any>([
    moment().subtract(1, "day"),
    moment(),
  ]);
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      locationIds: number[];
      zoneIds: number[];
      complete: boolean;
      assignedToId: number;
      from: Date;
      to: Date;
    }
  >({
    first: 6,
    last: null,
    before: null,
    after: null,
    search: "",
    locationIds: [],
    zoneIds: [],
    complete: false,
    assignedToId: self.id,
    from: dates[0].toISOString(),
    to: dates[1].toISOString(),
  });

  const [
    getAllEntityPMTaskStatusCount,
    { data: statusData, loading: statusLoading },
  ] = useLazyQuery(GET_ALL_ENTITY_PM_TASK_STATUS_COUNT, {
    onError: (err) => {
      errorMessage(
        err,
        "Error loading my periodic maintenance task status count."
      );
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [getAllEntityPeriodicMaintenanceTask, { data, loading }] = useLazyQuery(
    GET_ALL_ENTITY_PM_TASK,
    {
      onError: (err) => {
        errorMessage(err, "Error loading my periodic maintenance tasks.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch attachments when component mounts or when the filter object changes
  useEffect(() => {
    getAllEntityPeriodicMaintenanceTask({
      variables: {
        ...filter,
      },
    });
    getAllEntityPMTaskStatusCount({
      variables: {
        ...filter,
      },
    });
  }, [filter, getAllEntityPeriodicMaintenanceTask]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    locationIdsValue: number[],
    zoneIdsValue: number[],
    fromValue: any,
    toValue: any
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
          from: fromValue,
          to: toValue,
          first: 6,
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
    searchDebounced(
      search,
      locationIds,
      zoneIds,
      dates[0].toISOString(),
      dates[1].toISOString()
    );
    // eslint-disable-next-line
  }, [search, locationIds, zoneIds, dates]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: 6,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 6,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.getAllEntityPeriodicMaintenanceTask.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice(600, true);

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
          duration: 0.3,
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
            duration: 0.3,
            delay: 0.5,
          },
        }}
        viewport={{ once: true }}
      >
        My Maintenance Tasks
      </motion.div>
      <div className={classes["options-wrapper"]}>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              delay: 0.4,
            },
          }}
          viewport={{ once: true }}
        >
          <DatePicker.RangePicker
            defaultValue={dates}
            format={DATETIME_FORMATS.DAY_MONTH_YEAR}
            className={classes["datepicker"]}
            popupStyle={{ borderRadius: 6 }}
            disabledDate={(date) => date.isAfter(moment(), "day")}
            onChange={setDates}
            allowClear={false}
            ranges={{
              "Past 7 Days": [moment().subtract(1, "week"), moment()],
              "This Week": [moment().startOf("week"), moment()],
              "Past 30 Days": [moment().subtract(30, "day"), moment()],
              "This Month": [moment().startOf("month"), moment()],
            }}
          />
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              delay: 0.4,
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
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        whileInView={{
          x: 0,
          opacity: 1,
          transition: {
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
      <div className={classes["counter-container"]}>
        <div className={classes["counter-wrapper"]}>
          <motion.div
            className={classes["counter-value"]}
            initial={{ x: -20, opacity: 0 }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
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

            const unique = [
              ...new Set(
                periodicMaintenanceTask?.periodicMaintenance?.entity?.assignees?.map(
                  (assign) => assign.user.id
                )
              ),
            ];
            let uniqueAssign: any = [];
            for (const b of unique) {
              let assign =
                periodicMaintenanceTask?.periodicMaintenance?.entity?.assignees.find(
                  (a) => a.user.id === b
                );
              uniqueAssign.push(assign);
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
                        <div
                          className={classes["header-container"]}
                          onDoubleClick={() =>
                            navigate(
                              `${`/entity/${periodicMaintenanceTask?.periodicMaintenance?.entity?.id}`}`
                            )
                          }
                        >
                          <div
                            className={classes["inner-block-wrapper"]}
                            style={{ flex: 1 }}
                          >
                            <div className={classes["first-block"]}>
                              {loading ? (
                                <Skeleton.Image
                                  className={classes["image"]}
                                  style={{
                                    width: isSmallDevice ? 80 : 40,
                                    height: isSmallDevice ? 70 : 30,
                                    borderRadius: 6,
                                  }}
                                />
                              ) : (
                                <Image
                                  src={imagePath}
                                  height={isSmallDevice ? 70 : 30}
                                  width={isSmallDevice ? 80 : 40}
                                  className={classes["image"]}
                                  preview={false}
                                  title={`${periodicMaintenanceTask?.periodicMaintenance?.entity?.id}`}
                                />
                              )}
                              <div
                                className={classes["inner-first-block"]}
                                style={{ flex: 2 }}
                              >
                                <span className={classes["task-title"]} title={"Task"}>
                                  {periodicMaintenanceTask?.name}
                                </span>
                                <div
                                  className={
                                    classes["inner-first-block-level-one"]
                                  }
                                >
                                  <span
                                    className={classes["mn-title"]}
                                    title={`Machine Number`}
                                  >
                                    {
                                      periodicMaintenanceTask
                                        ?.periodicMaintenance?.entity
                                        ?.machineNumber
                                    }
                                  </span>
                                  {periodicMaintenanceTask?.periodicMaintenance
                                    ?.entity?.division && (
                                    <SizeableTag
                                      name={
                                        periodicMaintenanceTask
                                          ?.periodicMaintenance?.entity
                                          ?.division?.name
                                      }
                                      nameColor
                                      fontSize={isSmallDevice ? 9 : 6}
                                      height={isSmallDevice ? 14 : 10}
                                      fontWeight={800}
                                      title={"Division"}
                                    />
                                  )}
                                </div>
                                <span
                                  className={
                                    classes["inner-first-block-level-two"]
                                  }
                                >
                                  {periodicMaintenanceTask?.periodicMaintenance
                                    ?.entity?.type?.name && (
                                    <div title={"Type"}>
                                      {
                                        periodicMaintenanceTask
                                          ?.periodicMaintenance?.entity?.type
                                          ?.name
                                      }
                                      {(periodicMaintenanceTask
                                        ?.periodicMaintenance?.entity?.model ||
                                        periodicMaintenanceTask
                                          ?.periodicMaintenance?.entity?.brand
                                          ?.name ||
                                        periodicMaintenanceTask
                                          ?.periodicMaintenance?.entity
                                          ?.engine) && (
                                        <span className={classes["dot"]}>
                                          •
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {periodicMaintenanceTask?.periodicMaintenance
                                    ?.entity?.model && (
                                    <div
                                      className={classes["model"]}
                                      title={"Model"}
                                    >
                                      {
                                        periodicMaintenanceTask
                                          ?.periodicMaintenance?.entity?.model
                                      }
                                      {(periodicMaintenanceTask
                                        ?.periodicMaintenance?.entity?.brand
                                        ?.name ||
                                        periodicMaintenanceTask
                                          ?.periodicMaintenance?.entity
                                          ?.engine) && (
                                        <span className={classes["dot"]}>
                                          •
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {periodicMaintenanceTask?.periodicMaintenance
                                    ?.entity?.brand?.name && (
                                    <div
                                      className={classes["brand"]}
                                      title={"Brand"}
                                    >
                                      {
                                        periodicMaintenanceTask
                                          ?.periodicMaintenance?.entity?.brand
                                          ?.name
                                      }
                                      {periodicMaintenanceTask
                                        ?.periodicMaintenance?.entity
                                        ?.engine && (
                                        <span className={classes["dot"]}>
                                          •
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {periodicMaintenanceTask?.periodicMaintenance
                                    ?.entity?.engine && (
                                    <div
                                      className={classes["engine"]}
                                      title={"Engine"}
                                    >
                                      {
                                        periodicMaintenanceTask
                                          ?.periodicMaintenance?.entity?.engine
                                      }
                                    </div>
                                  )}
                                </span>
                                <div
                                  className={
                                    classes["inner-first-block-level-three"]
                                  }
                                >
                                  {periodicMaintenanceTask?.periodicMaintenance
                                    ?.entity?.registeredDate && (
                                    <div title={"Registered Date"}>
                                      {moment(
                                        periodicMaintenanceTask
                                          ?.periodicMaintenance?.entity
                                          ?.registeredDate
                                      ).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
                                      {(periodicMaintenanceTask
                                        ?.periodicMaintenance?.entity?.location
                                        ?.name ||
                                        periodicMaintenanceTask
                                          ?.periodicMaintenance?.entity
                                          ?.location?.zone?.name) && (
                                        <span className={classes["dot"]}>
                                          •
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {periodicMaintenanceTask?.periodicMaintenance
                                    ?.entity?.location?.name && (
                                    <div title={"Location"}>
                                      {
                                        periodicMaintenanceTask
                                          ?.periodicMaintenance?.entity
                                          ?.location?.name
                                      }
                                      {periodicMaintenanceTask
                                        ?.periodicMaintenance?.entity?.location
                                        ?.zone?.name && (
                                        <span className={classes["dot"]}>
                                          •
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {periodicMaintenanceTask?.periodicMaintenance
                                    ?.entity?.location?.zone?.name && (
                                    <div title={"Zone"}>
                                      {
                                        periodicMaintenanceTask
                                          ?.periodicMaintenance?.entity
                                          ?.location?.zone?.name
                                      }
                                    </div>
                                  )}
                                </div>
                              </div>
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
        pageLimit={6}
      />
    </motion.div>
  );
};

export default memo(MyEntityPMTask);
