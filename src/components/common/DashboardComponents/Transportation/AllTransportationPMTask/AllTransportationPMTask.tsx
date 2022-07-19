import { Avatar, Collapse, message, Select, Spin, Tooltip } from "antd";
import Search from "../../../Search";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DefaultPaginationArgs from "../../../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../../../models/PaginationArgs";
import { errorMessage } from "../../../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_TRANSPORTATION_PM_TASK } from "../../../../../api/queries";
import {
  DATETIME_FORMATS,
  ISLANDS,
  PAGE_LIMIT,
} from "../../../../../helpers/constants";
import PaginationButtons from "../../../PaginationButtons/PaginationButtons";
import classes from "./AllTransportationPMTask.module.css";
import { useIsSmallDevice } from "../../../../../helpers/useIsSmallDevice";
import UserContext from "../../../../../contexts/UserContext";
import {
  FaArrowAltCircleRight,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaRegClock,
  FaTractor,
} from "react-icons/fa";
import moment from "moment";
import PeriodicMaintenanceStatusTag from "../../../PeriodicMaintenanceStatusTag";
import { PeriodicMaintenanceStatus } from "../../../../../models/Enums";
import { stringToColor } from "../../../../../helpers/style";
import TransportationPMStatusFilter from "../../../TransportationPMStatusFilter";
import TransportationPeriodicMaintenance from "../../../../../models/Transportation/TransportationPeriodicMaintenance";
import TransportationPMTask from "../../../../../models/Transportation/TransportationPMTask";


const AllTransportationPMTask = () => {
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

  const [getAllTransportationPeriodicMaintenanceTask, { data, loading }] =
    useLazyQuery(GET_ALL_TRANSPORTATION_PM_TASK, {
      onError: (err) => {
        errorMessage(
          err,
          "Error loading all transportation periodic maintenance tasks."
        );
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  // Fetch pm when component mounts or when the filter object changes
  useEffect(() => {
    getAllTransportationPeriodicMaintenanceTask({ variables: filter });
  }, [filter, getAllTransportationPeriodicMaintenanceTask]);

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

  const pageInfo =
    data?.getAllTransportationPeriodicMaintenanceTask.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let done = 0;
  let pending = 0;
  let missed = 0;

  data?.getAllTransportationPeriodicMaintenanceTask.edges.map(
    (rec: { node: TransportationPMTask }) => {
      const periodicMaintenanceTask = rec.node;
      if (periodicMaintenanceTask?.periodicMaintenance?.status === "Done") {
        done = done + 1;
      } else if (periodicMaintenanceTask?.periodicMaintenance?.status === "Pending") {
        pending = pending + 1;
      } else if (periodicMaintenanceTask?.periodicMaintenance?.status === "Missed") {
        missed = missed + 1;
      }
    }
  );

  let options: any = [];
  ISLANDS?.map((island: string) => {
    options.push({
      value: island,
      label: island,
    });
  });

  return (
    <div className={classes["pm-container"]}>
      <div className={classes["heading"]}>
        Transports Periodic Maintenance Task
      </div>
      <div className={classes["options-wrapper"]}>
        <Search
          searchValue={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
        />
        <div className={classes["status-wrapper"]}>
          <TransportationPMStatusFilter
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
          <div className={classes["pending"]}>Upcoming</div>
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
      {data?.getAllTransportationPeriodicMaintenanceTask.edges.length > 0 ? (
        data?.getAllTransportationPeriodicMaintenanceTask.edges.map(
          (rec: { node: TransportationPMTask }) => {
            const periodicMaintenanceTask = rec.node;
            //console.log(periodicMaintenanceTask);
            return (
              <div id="collapse" key={periodicMaintenanceTask.id}>
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
                                      ?.transportation?.machineNumber
                                  }
                                </span>
                              </div>
                              <div className={classes["location-wrapper"]}>
                                <FaMapMarkerAlt style={{ marginRight: 5 }} />
                                <div>
                                  <div className={classes["location-width"]}>
                                    {
                                      periodicMaintenanceTask
                                        ?.periodicMaintenance?.transportation
                                        ?.location
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
                                    .transportation?.assignees!.length > 0 ? (
                                    <Avatar.Group
                                      maxCount={5}
                                      maxStyle={{
                                        color: "#f56a00",
                                        backgroundColor: "#fde3cf",
                                      }}
                                    >
                                      {periodicMaintenanceTask.periodicMaintenance.transportation?.assignees?.map(
                                        (assign) => {
                                          console.log(assign?.user?.fullName);
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
                              "/transportation/" +
                              periodicMaintenanceTask?.periodicMaintenance
                                ?.transportation?.id
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
              </div>
            );
          }
        )
      ) : (
        <div className={classes["no-info"]}>No information available.</div>
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

export default AllTransportationPMTask;
