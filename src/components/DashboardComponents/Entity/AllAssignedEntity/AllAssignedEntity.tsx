import { Avatar, Collapse, Empty, Image, Skeleton, Spin, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PaginationArgs from "../../../../models/PaginationArgs";
import { errorMessage } from "../../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import {
  GET_ALL_ASSIGNED_ENTITY,
  GET_ALL_ENTITY_STATUS_COUNT,
} from "../../../../api/queries";
import classes from "./AllAssignedEntity.module.css";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import { FaArrowAltCircleRight, FaMapMarkerAlt } from "react-icons/fa";
import { EntityStatus } from "../../../../models/Enums";
import { stringToColor } from "../../../../helpers/style";
import Search from "../../../common/Search";
import { Entity } from "../../../../models/Entity/Entity";
import EntityStatusTag from "../../../common/EntityStatusTag";
import PaginationButtons from "../../../common/PaginationButtons/PaginationButtons";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { LocationSelector } from "../../../Config/Location/LocationSelector";
import { getListImage } from "../../../../helpers/getListImage";
import { EntityIcon } from "../../../common/EntityIcon";
import EntityAssignment from "../../../../models/Entity/EntityAssign";
import { ZoneSelector } from "../../../Config/Zone/ZoneSelector";

const AllAssignedEntity = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [locationIds, setLocationIds] = useState([]);
  const [zoneIds, setZoneIds] = useState([]);

  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      locationIds: number[];
      isAssigned: boolean;
      zoneIds: number[];
    }
  >({
    first: 6,
    last: null,
    before: null,
    after: null,
    search: "",
    locationIds: [],
    isAssigned: true,
    zoneIds: [],
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
    allEntityStatusCount({ variables: filter });
  }, [filter, getAllAssignedEntity, allEntityStatusCount]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    locationIdsValue: number[],
    zoneIdsValue: number[]
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
    searchDebounced(search, locationIds, zoneIds);
    // eslint-disable-next-line
  }, [search, locationIds, zoneIds]);

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

  const pageInfo = data?.getAllAssignedEntity.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let working = statusData?.allEntityStatusCount?.working;
  let breakdown = statusData?.allEntityStatusCount?.breakdown;
  let critical = statusData?.allEntityStatusCount?.critical;

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
          initial={{ x: 20, opacity: 0 }}
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
          initial={{ x: 20, opacity: 0 }}
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
          initial={{ x: 20, opacity: 0 }}
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
                delay: 0.8,
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
                delay: 0.8,
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
                delay: 0.8,
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
                delay: 0.8,
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
                delay: 0.8,
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
          let imagePath = getListImage(entity?.type?.name);

          let loading = true;
          if (imagePath) {
            loading = false;
          }

          const unique = [
            ...new Set(entity?.assignees?.map((assign) => assign.user.id)),
          ];
          let uniqueAssign: any = [];
          for (const b of unique) {
            let assign = entity?.assignees.find((a) => a.user.id === b);
            uniqueAssign.push(assign);
          }

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
                                entityType={entity?.type?.entityType}
                              />
                              <span className={classes["title"]}>
                                {entity?.machineNumber}
                              </span>
                            </div>
                            <div className={classes["title-wrapper"]}>
                              <FaMapMarkerAlt style={{ marginRight: 5 }} />
                              {entity?.location?.name}
                            </div>
                          </div>
                        </div>

                        <div className={classes["second-block"]}>
                          <div>
                            <span className={classes["reading-title"]}>
                              Assigned to:
                            </span>
                            <span className={classes["center"]}>
                              {uniqueAssign?.length! > 0 ? (
                                <Avatar.Group
                                  maxCount={5}
                                  maxStyle={{
                                    color: "#f56a00",
                                    backgroundColor: "#fde3cf",
                                  }}
                                >
                                  {uniqueAssign.map(
                                    (assign: EntityAssignment) => {
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
