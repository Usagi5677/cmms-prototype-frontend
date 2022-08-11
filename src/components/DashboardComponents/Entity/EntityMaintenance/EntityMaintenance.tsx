import { Collapse, Empty, Select, Spin, Tooltip } from "antd";
import classes from "./EntityMaintenance.module.css";
import {
  FaArrowAltCircleRight,
  FaMapMarkerAlt,
  FaRegClock,
  FaTractor,
} from "react-icons/fa";
import moment from "moment";
import { useLazyQuery } from "@apollo/client";
import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  GET_ALL_ENTITY_PM_STATUS_COUNT,
  GET_ALL_ENTITY_PERIODIC_MAINTENANCE,
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

const EntityMaintenance = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<any>();
  const [timerId, setTimerId] = useState(null);
  const [location, setLocation] = useState([]);
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      status: any;
      location: string[];
    }
  >({
    first: 3,
    last: null,
    before: null,
    after: null,
    search: "",
    status: null,
    location: [],
  });

  const [
    getAllEntityPMStatusCount,
    { data: statusData, loading: statusLoading },
  ] = useLazyQuery(GET_ALL_ENTITY_PM_STATUS_COUNT, {
    onError: (err) => {
      errorMessage(
        err,
        "Error loading all entity periodic maintenance status count."
      );
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [getAllEntityPeriodicMaintenance, { data, loading }] = useLazyQuery(
    GET_ALL_ENTITY_PERIODIC_MAINTENANCE,
    {
      onError: (err) => {
        errorMessage(err, "Error loading all entity periodic maintenance.");
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
    statusValue: PeriodicMaintenanceStatus,
    locationValue: string[]
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
    searchDebounced(search, status, location);
    // eslint-disable-next-line
  }, [search, status, location]);

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
    <div className={classes["pm-container"]}>
      <div className={classes["heading"]}>Maintenance</div>
      <div className={classes["options-wrapper"]}>
        <Search
          searchValue={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
        />
        <div className={classes["status-wrapper"]}>
          <EntityPMStatusFilter
            onChange={(status) => {
              setFilter({ ...filter, status, ...DefaultPaginationArgs });
              setPage(1);
              setStatus(status);
            }}
            value={filter.status}
          />
          <Select
            showArrow
            className={classes["location"]}
            onChange={(value) => setLocation(value)}
            showSearch
            options={options}
            placeholder={"Location"}
            mode="multiple"
          />
        </div>
      </div>
      <div className={classes["counter-container"]}>
        <div className={classes["counter-wrapper"]}>
          <div className={classes["counter-value"]}>{missed}</div>
          <div className={classes["missed"]}>Missed</div>
        </div>
        <div className={classes["counter-wrapper"]}>
          <div className={classes["counter-value"]}>{pending}</div>
          <div className={classes["pending"]}>Pending</div>
        </div>
        <div className={classes["counter-wrapper"]}>
          <div className={classes["counter-value"]}>{done}</div>
          <div className={classes["done"]}>Done</div>
        </div>
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      {data?.getAllEntityPeriodicMaintenance.edges.length > 0 ? (
        data?.getAllEntityPeriodicMaintenance.edges.map(
          (rec: { node: EntityPeriodicMaintenance }) => {
            const periodicMaintenance = rec.node;
            return (
              <div id="collapse" key={periodicMaintenance.id}>
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
                                  {periodicMaintenance?.entity?.machineNumber}
                                </span>
                              </div>
                              <div className={classes["location-wrapper"]}>
                                <FaMapMarkerAlt />
                                <span className={classes["title"]}>
                                  {periodicMaintenance?.entity?.location}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className={classes["service-reading-wrapper"]}>
                            <div className={classes["reading"]}>
                              <span className={classes["reading-title"]}>
                                Title:
                              </span>
                              <span>{periodicMaintenance?.title}</span>
                            </div>
                            <div className={classes["status"]}>
                              <PeriodicMaintenanceStatusTag
                                status={periodicMaintenance?.status}
                              />
                            </div>
                            <div>
                              <div className={classes["title-wrapper"]}>
                                <Tooltip title="Start Date">
                                  <FaRegClock />
                                </Tooltip>

                                <span className={classes["title"]}>
                                  {moment(
                                    periodicMaintenance?.startDate
                                  ).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
                                </span>
                              </div>
                              <div className={classes["reading"]}>
                                <span className={classes["reading-title"]}>
                                  In:
                                </span>
                                <span>
                                  {periodicMaintenance?.value}{" "}
                                  {periodicMaintenance?.measurement}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Link
                            to={
                              "/transportation/" +
                              periodicMaintenance?.entity?.id
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
                    key={periodicMaintenance?.id}
                  >
                    <div className={classes["container"]}></div>
                  </Collapse.Panel>
                </Collapse>
              </div>
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
    </div>
  );
};

export default EntityMaintenance;
