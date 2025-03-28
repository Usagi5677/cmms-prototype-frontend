import { Avatar, Collapse, Empty, Image, Skeleton, Spin, Tooltip } from "antd";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaginationArgs from "../../../../models/PaginationArgs";
import { errorMessage } from "../../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import {
  GET_ALL_ASSIGNED_ENTITY,
  GET_ALL_ENTITY_STATUS_COUNT,
} from "../../../../api/queries";
import classes from "./AllAssignedEntity.module.css";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import { FaArrowAltCircleRight } from "react-icons/fa";
import Search from "../../../common/Search";
import { Entity } from "../../../../models/Entity/Entity";
import PaginationButtons from "../../../common/PaginationButtons/PaginationButtons";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { LocationSelector } from "../../../Config/Location/LocationSelector";
import { getListImage } from "../../../../helpers/getListImage";
import { ZoneSelector } from "../../../Config/Zone/ZoneSelector";
import UserContext from "../../../../contexts/UserContext";
import SizeableTag from "../../../common/SizeableTag/SizeableTag";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../../helpers/constants";

const AllAssignedEntity = () => {
  const { user: self } = useContext(UserContext);
  const navigate = useNavigate();
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
      zoneIds: number[];
      assignedToId: number;
    }
  >({
    first: 6,
    last: null,
    before: null,
    after: null,
    search: "",
    locationIds: [],
    assignedToId: self.id,
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
  }, [filter]);

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
  const isSmallDevice = useIsSmallDevice(600, true);

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
        Assigned to me
      </motion.div>
      <div className={classes["options-wrapper"]}>
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
          style={{ width: "100%" }}
        >
          <Search
            searchValue={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch("")}
            width={"100%"}
          />
        </motion.div>
      </div>
      <motion.div
        initial={{ x: 20, opacity: 0 }}
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
        initial={{ x: 20, opacity: 0 }}
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
            <CountUp end={breakdown} duration={1} />
          </motion.div>
          <motion.div
            className={classes["breakdown"]}
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
                          navigate(`${`/entity/${entity?.id}`}`)
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
                                title={`${entity?.id}`}
                              />
                            )}
                            <div
                              className={classes["inner-first-block"]}
                              style={{ flex: 2 }}
                            >
                              <div
                                className={
                                  classes["inner-first-block-level-one"]
                                }
                              >
                                <span
                                  className={classes["mn-title"]}
                                  title={`Machine Number`}
                                >
                                  {entity?.machineNumber}
                                </span>
                                {entity?.division && (
                                  <SizeableTag
                                    name={entity?.division?.name}
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
                                {entity?.type?.name && (
                                  <div title={"Type"}>
                                    {entity?.type?.name}
                                    {(entity?.model ||
                                      entity?.brand?.name ||
                                      entity?.engine?.name) && (
                                      <span className={classes["dot"]}>•</span>
                                    )}
                                  </div>
                                )}
                                {entity?.model && (
                                  <div
                                    className={classes["model"]}
                                    title={"Model"}
                                  >
                                    {entity?.model}
                                    {(entity?.brand?.name ||
                                      entity?.engine?.name) && (
                                      <span className={classes["dot"]}>•</span>
                                    )}
                                  </div>
                                )}

                                {entity?.brand?.name && (
                                  <div
                                    className={classes["brand"]}
                                    title={"Brand"}
                                  >
                                    {entity?.brand?.name}
                                    {entity?.engine?.name && (
                                      <span className={classes["dot"]}>•</span>
                                    )}
                                  </div>
                                )}
                                {entity?.engine?.name && (
                                  <div
                                    className={classes["engine"]}
                                    title={"Engine"}
                                  >
                                    {entity?.engine?.name}
                                  </div>
                                )}
                              </span>
                              <div
                                className={
                                  classes["inner-first-block-level-three"]
                                }
                              >
                                {entity?.registeredDate && (
                                  <div title={"Registered Date"}>
                                    {moment(entity?.registeredDate).format(
                                      DATETIME_FORMATS.DAY_MONTH_YEAR
                                    )}
                                    {(entity?.location?.name ||
                                      entity?.location?.zone?.name) && (
                                      <span className={classes["dot"]}>•</span>
                                    )}
                                  </div>
                                )}
                                {entity?.location?.name && (
                                  <div title={"Location"}>
                                    {entity?.location?.name}
                                    {entity?.location?.zone?.name && (
                                      <span className={classes["dot"]}>•</span>
                                    )}
                                  </div>
                                )}
                                {entity?.location?.zone?.name && (
                                  <div title={"Zone"}>
                                    {entity?.location?.zone?.name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Link to={"/entity/" + entity?.id}>
                          <FaArrowAltCircleRight
                            className={classes["button"]}
                          />
                        </Link>
                      </div>
                    </>
                  }
                  key={entity?.id}
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
        pageLimit={6}
      />
    </motion.div>
  );
};

export default memo(AllAssignedEntity);
