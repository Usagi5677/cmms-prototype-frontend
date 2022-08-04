import { useLazyQuery } from "@apollo/client";
import { Avatar, Checkbox, Collapse, Empty, Select, Spin, Tooltip } from "antd";
import { useContext, useState, useEffect, useRef } from "react";
import {
  FaArrowAltCircleRight,
  FaMapMarkerAlt,
  FaTractor,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  GET_ALL_TRANSPORTATION_PM_TASK_STATUS_COUNT,
  GET_ALL_TRANSPORTATION_PM_TASK,
} from "../../../../api/queries";
import UserContext from "../../../../contexts/UserContext";
import { ISLANDS } from "../../../../helpers/constants";
import { errorMessage } from "../../../../helpers/gql";
import { stringToColor } from "../../../../helpers/style";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import DefaultPaginationArgs from "../../../../models/DefaultPaginationArgs";
import { PeriodicMaintenanceStatus } from "../../../../models/Enums";
import PaginationArgs from "../../../../models/PaginationArgs";
import TransportationPMTask from "../../../../models/Transportation/TransportationPMTask";
import PaginationButtons from "../../../common/PaginationButtons/PaginationButtons";
import PeriodicMaintenanceStatusTag from "../../../common/PeriodicMaintenanceStatusTag";
import Search from "../../../common/Search";
import TransportationPMStatusFilter from "../../../common/TransportationPMStatusFilter";
import classes from "./MyTransportationPMTask.module.css";

const MyTransportationPMTask = () => {
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
      assignedToId: number;
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
    assignedToId: self.id,
  });

  const [
    getAllTransportationPMTaskStatusCount,
    { data: statusData, loading: statusLoading },
  ] = useLazyQuery(GET_ALL_TRANSPORTATION_PM_TASK_STATUS_COUNT, {
    onError: (err) => {
      errorMessage(
        err,
        "Error loading my transportation periodic maintenance task status count."
      );
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [getAllTransportationPeriodicMaintenanceTask, { data, loading }] =
    useLazyQuery(GET_ALL_TRANSPORTATION_PM_TASK, {
      onError: (err) => {
        errorMessage(
          err,
          "Error loading my transportation periodic maintenance tasks."
        );
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  // Fetch pm when component mounts or when the filter object changes
  useEffect(() => {
    getAllTransportationPeriodicMaintenanceTask({ variables: filter });
    getAllTransportationPMTaskStatusCount({
      variables: {
        assignedToId: self.id,
      },
    });
  }, [
    filter,
    getAllTransportationPeriodicMaintenanceTask,
    getAllTransportationPMTaskStatusCount,
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

  const pageInfo =
    data?.getAllTransportationPeriodicMaintenanceTask.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let done = statusData?.allTransportationPMTaskStatusCount?.done;
  let pending = statusData?.allTransportationPMTaskStatusCount?.pending;
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
        My Transports Periodic Maintenance Task
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
          <Checkbox onChange={(e) => setComplete(e.target.checked)}>
            Complete
          </Checkbox>
        </div>
      </div>
      <div className={classes["counter-container"]}>
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
      {data?.getAllTransportationPeriodicMaintenanceTask.edges.length > 0 ? (
        data?.getAllTransportationPeriodicMaintenanceTask.edges.map(
          (rec: { node: TransportationPMTask }) => {
            const periodicMaintenanceTask = rec.node;
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
                                    .transportation?.assignees?.length > 0 ? (
                                    <Avatar.Group
                                      maxCount={5}
                                      maxStyle={{
                                        color: "#f56a00",
                                        backgroundColor: "#fde3cf",
                                      }}
                                    >
                                      {periodicMaintenanceTask.periodicMaintenance.transportation?.assignees?.map(
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

export default MyTransportationPMTask;
