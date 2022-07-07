import { Collapse, message, Select, Spin, Tooltip } from "antd";
import Search from "../../../Search";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DefaultPaginationArgs from "../../../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../../../models/PaginationArgs";
import { errorMessage } from "../../../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_TRANSPORTATION_PERIODIC_MAINTENANCE } from "../../../../../api/queries";
import {
  DATETIME_FORMATS,
  ISLANDS,
  PAGE_LIMIT,
} from "../../../../../helpers/constants";
import PaginationButtons from "../../../PaginationButtons/PaginationButtons";
import AddMachine from "../../../../MachineComponents/AddMachine/AddMachine";
import MachineCard from "../../../../MachineComponents/MachineCard/MachineCard";
import Machine from "../../../../../models/Machine";
import classes from "./TransportationMaintenance.module.css";
import MachineStatusFilter from "../../../MachineStatusFilter";
import { useIsSmallDevice } from "../../../../../helpers/useIsSmallDevice";
import UserContext from "../../../../../contexts/UserContext";
import MachinePMStatusFilter from "../../../MachinePMStatusFilter";
import MachinePeriodicMaintenance from "../../../../../models/Machine/MachinePeriodicMaintenance";
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
import TransportationPeriodicMaintenance from "../../../../../models/Transportation/TransportationPeriodicMaintenance";

const TransportationMaintenance = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<any>();
  const [timerId, setTimerId] = useState(null);
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      status: any;
    }
  >({
    first: 3,
    last: null,
    before: null,
    after: null,
    search: "",
    status: null,
  });

  const [getAllTransportationPeriodicMaintenance, { data, loading }] =
    useLazyQuery(GET_ALL_TRANSPORTATION_PERIODIC_MAINTENANCE, {
      onError: (err) => {
        errorMessage(
          err,
          "Error loading all transportation periodic maintenance."
        );
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  // Fetch tickets when component mounts or when the filter object changes
  useEffect(() => {
    getAllTransportationPeriodicMaintenance({ variables: filter });
  }, [filter, getAllTransportationPeriodicMaintenance]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    statusValue: PeriodicMaintenanceStatus
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          status: statusValue,
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
    searchDebounced(search, status);
    // eslint-disable-next-line
  }, [search, status]);

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

  const pageInfo = data?.getAllTransportationPeriodicMaintenance.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let done = 0;
  let pending = 0;
  let missed = 0;

  data?.getAllTransportationPeriodicMaintenance.edges.map(
    (rec: { node: MachinePeriodicMaintenance }) => {
      const periodicMaintenance = rec.node;
      if (periodicMaintenance?.status === "Done") {
        done = done + 1;
      } else if (periodicMaintenance?.status === "Pending") {
        pending = pending + 1;
      } else if (periodicMaintenance?.status === "Missed") {
        missed = missed + 1;
      }
    }
  );

  return (
    <div className={classes["pm-container"]}>
      <div className={classes["heading"]}>Transports Maintenance</div>
      <div className={classes["options-wrapper"]}>
        <Search
          searchValue={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
        />
        <div className={classes["status-wrapper"]}>
          <MachinePMStatusFilter
            onChange={(status) => {
              setFilter({ ...filter, status, ...DefaultPaginationArgs });
              setPage(1);
              setStatus(status);
            }}
            value={filter.status}
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
      {data?.getAllTransportationPeriodicMaintenance.edges.length > 0 ? (
        data?.getAllTransportationPeriodicMaintenance.edges.map(
          (rec: { node: TransportationPeriodicMaintenance }) => {
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
                                  {
                                    periodicMaintenance?.transportation
                                      ?.machineNumber
                                  }
                                </span>
                              </div>
                              <div className={classes["location-wrapper"]}>
                                <FaMapMarkerAlt />
                                <span className={classes["title"]}>
                                  {
                                    periodicMaintenance?.transportation
                                      ?.location
                                  }
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
                              periodicMaintenance?.transportation?.id
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

export default TransportationMaintenance;
