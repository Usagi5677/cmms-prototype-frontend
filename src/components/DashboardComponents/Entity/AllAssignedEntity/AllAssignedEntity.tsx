import { Avatar, Collapse, Empty, Select, Spin, Tooltip } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DefaultPaginationArgs from "../../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../../models/PaginationArgs";
import { errorMessage } from "../../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import {
  GET_ALL_ASSIGNED_ENTITY,
  GET_ALL_ENTITY_STATUS_COUNT,
} from "../../../../api/queries";
import { ISLANDS } from "../../../../helpers/constants";
import classes from "./AllAssignedEntity.module.css";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import UserContext from "../../../../contexts/UserContext";
import {
  FaArrowAltCircleRight,
  FaMapMarkerAlt,
  FaTractor,
  FaTruck,
} from "react-icons/fa";
import { EntityStatus } from "../../../../models/Enums";
import { stringToColor } from "../../../../helpers/style";
import Search from "../../../common/Search";
import EntityStatusFilter from "../../../common/EntityStatusFilter";
import { Entity } from "../../../../models/Entity/Entity";
import EntityStatusTag from "../../../common/EntityStatusTag";
import PaginationButtons from "../../../common/PaginationButtons/PaginationButtons";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { RiSailboatFill } from "react-icons/ri";
import { LocationSelector } from "../../../Config/Location/LocationSelector";

const AllAssignedEntity = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<any>();
  const [timerId, setTimerId] = useState(null);
  const [locationIds, setLocationIds] = useState([]);

  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      status: any;
      locationIds: number[];
      isAssigned: boolean;
    }
  >({
    first: 3,
    last: null,
    before: null,
    after: null,
    search: "",
    status: null,
    locationIds: [],
    isAssigned: true,
  });

  const [allEntityStatusCount, { data: statusData }] = useLazyQuery(
    GET_ALL_ENTITY_STATUS_COUNT,
    {
      onError: (err) => {
        errorMessage(err, "Error loading status count of entities");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  const [getAllAssignedEntity, { data, loading }] = useLazyQuery(
    GET_ALL_ASSIGNED_ENTITY,
    {
      onError: (err) => {
        errorMessage(err, "Error loading all assigned entities.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch pm when component mounts or when the filter object changes
  useEffect(() => {
    getAllAssignedEntity({ variables: filter });
    allEntityStatusCount({
      variables: {
        isAssigned: true,
      },
    });
  }, [filter, getAllAssignedEntity, allEntityStatusCount]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    statusValue: EntityStatus,
    locationIdsValue: number[]
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          status: statusValue,
          locationIds: locationIdsValue,
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
    searchDebounced(search, status, locationIds);
    // eslint-disable-next-line
  }, [search, status, locationIds]);

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

  const pageInfo = data?.getAllAssignedEntity.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let working = statusData?.allEntityStatusCount?.working;
  let breakdown = statusData?.allEntityStatusCount?.breakdown;
  let critical = statusData?.allEntityStatusCount?.critical;

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
        Assigned to me
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

        <div className={classes["status-wrapper"]}>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
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
            <EntityStatusFilter
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
                delay: 1.1,
              },
            }}
            viewport={{ once: true }}
          >
            <div className={classes["location"]}>
              <LocationSelector
                setLocationId={setLocationIds}
                multiple={true}
                rounded={true}
                width={"100%"}
              />
            </div>
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
                delay: 1.2,
              },
            }}
            viewport={{ once: true }}
          >
            <CountUp end={breakdown} duration={1} />
          </motion.div>
          <motion.div
            className={classes["breakdown"]}
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
            Breakdown
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
            <CountUp end={critical} duration={1} />
          </motion.div>
          <motion.div
            className={classes["critical"]}
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
            Critical
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
            <CountUp end={working} duration={1} />
          </motion.div>
          <motion.div
            className={classes["working"]}
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
            Working
          </motion.div>
        </div>
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      {data?.getAllAssignedEntity.edges.length > 0 ? (
        data?.getAllAssignedEntity.edges.map((rec: { node: Entity }) => {
          const entity = rec.node;
          return (
            <motion.div
              id="collapse"
              key={entity.id}
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
                      <div
                        className={classes["header-container"]}
                      >
                        <div className={classes["first-block"]}>
                          <div>
                            <div className={classes["title-wrapper"]}>
                              {entity?.type?.entityType === "Vessel" ? (
                                <RiSailboatFill />
                              ) : entity?.type?.entityType === "Vehicle" ? (
                                <FaTruck />
                              ) : (
                                <FaTractor />
                              )}
                              <span className={classes["title"]}>
                                {entity?.machineNumber}
                              </span>
                            </div>
                            <div className={classes["location-wrapper"]}>
                              <FaMapMarkerAlt style={{ marginRight: 5 }} />
                              <div>
                                <div className={classes["location-width"]}>
                                  {entity?.location?.name}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={classes["service-reading-wrapper"]}>
                          <div className={classes["reading"]}>
                            <div>
                              <span className={classes["reading-title"]}>
                                Assigned to:
                              </span>
                              <span className={classes["center"]}>
                                {entity?.assignees?.length! > 0 ? (
                                  <Avatar.Group
                                    maxCount={5}
                                    maxStyle={{
                                      color: "#f56a00",
                                      backgroundColor: "#fde3cf",
                                    }}
                                  >
                                    {entity?.assignees?.map((assign) => {
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
                                    })}
                                  </Avatar.Group>
                                ) : (
                                  <span>None</span>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className={classes["status"]}>
                            <EntityStatusTag status={entity?.status} />
                          </div>
                        </div>
                        <Link to={"/entity/" + entity?.id}>
                          <Tooltip title="Open">
                            <FaArrowAltCircleRight
                              className={classes["button"]}
                            />
                          </Tooltip>
                        </Link>
                      </div>
                    </>
                  }
                  key={entity?.id!}
                >
                  <div className={classes["container"]}></div>
                </Collapse.Panel>
              </Collapse>
            </motion.div>
          );
        })
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

export default AllAssignedEntity;
