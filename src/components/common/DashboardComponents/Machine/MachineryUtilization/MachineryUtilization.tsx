import { Collapse, message, Select, Spin, Tooltip } from "antd";
import Search from "../../../Search";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DefaultPaginationArgs from "../../../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../../..//models/PaginationArgs";
import { errorMessage } from "../../../..//../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import { ALL_MACHINE_UTILIZATION } from "../../../../../api/queries";
import {
  DATETIME_FORMATS,
  ISLANDS,
  PAGE_LIMIT,
} from "../../../../../helpers/constants";
import PaginationButtons from "../../../PaginationButtons/PaginationButtons";
import MachineCard from "../../../../MachineComponents/MachineCard/MachineCard";
import Machine from "../../../../../models/Machine";
import classes from "./MachineryUtilization.module.css";
import { useIsSmallDevice } from "../../../../../helpers/useIsSmallDevice";
import UserContext from "../../../../../contexts/UserContext";
import moment from "moment";
import {
  FaArrowAltCircleRight,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaRegClock,
  FaTractor,
} from "react-icons/fa";
import MachineryUtilizationGraph from "../MachineryUtilizationGraph/MachineryUtilizationGraph";

const MachineryUtilization = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [params, setParams] = useSearchParams();
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      location: string;
    }
  >({
    first: 3,
    last: null,
    before: null,
    after: null,
    search: "",
    location: "",
  });

  const [getAllMachineUtilization, { data, loading }] = useLazyQuery(
    ALL_MACHINE_UTILIZATION,
    {
      onError: (err) => {
        errorMessage(err, "Error loading machine utilization.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch machinery when component mounts or when the filter object changes
  useEffect(() => {
    getAllMachineUtilization({ variables: filter });
  }, [filter, getAllMachineUtilization]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (value: string, locationValue: string) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
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
    searchDebounced(search, location);
    // eslint-disable-next-line
  }, [search, location]);

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

  const pageInfo = data?.getAllMachineUtilization?.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice(1290);
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let options: any = [];
  ISLANDS?.map((island: string) => {
    options.push({
      value: island,
      label: island,
    });
  });

  return (
    <div className={classes["container"]}>
      <div className={classes["heading"]}>Machinery Utilization</div>
      <MachineryUtilizationGraph />
      <div className={classes["options-wrapper"]}>
        <Search
          searchValue={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
        />
        <Select
          showArrow
          className={classes["location"]}
          onChange={(value) => setLocation(value)}
          showSearch
          options={options}
          placeholder={"Location"}
        />
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      {data?.getAllMachineUtilization.edges.length > 0 ? (
        data?.getAllMachineUtilization?.edges.map((rec: { node: Machine }) => {
          const machine = rec.node;
          let workingHour = machine?.histories[0]
            ?.workingHour as unknown as number;
          let idleHour = machine?.histories[0]?.idleHour as unknown as number;
          let breakdownHour = machine?.histories[0]
            ?.breakdownHour as unknown as number;
          let totalHour = workingHour + idleHour + breakdownHour;
          let workingPercentage = (workingHour / totalHour) * 100;
          let idlePercentage = (idleHour / totalHour) * 100;
          let breakdownPercentage = (breakdownHour / totalHour) * 100;

          if (isSmallDevice) {
            return (
              <div id="collapse" key={machine.id}>
                <Collapse ghost style={{ marginBottom: ".5rem" }}>
                  <Collapse.Panel
                    header={
                      <>
                        <div
                          className={classes["header-container"]}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Tooltip
                            title={
                              <>
                                <span className={classes["title"]}>
                                  Registered Date:{" "}
                                  {moment(machine?.registeredDate).format(
                                    DATETIME_FORMATS.DAY_MONTH_YEAR
                                  )}
                                </span>
                              </>
                            }
                          >
                            <div className={classes["first-block"]}>
                              <div className={classes["title-wrapper"]}>
                                <FaTractor />
                                <span className={classes["title"]}>
                                  {machine?.machineNumber}
                                </span>
                              </div>
                              <div className={classes["location-wrapper"]}>
                                <FaMapMarkerAlt />
                                <span className={classes["title"]}>
                                  {machine?.zone}
                                </span>
                                <span className={classes["dash"]}>-</span>
                                <span>{machine?.location}</span>
                              </div>
                            </div>
                          </Tooltip>

                          <div
                            className={classes["service-reading-wrapper-two"]}
                          >
                            <div className={classes["reading"]}>
                              <span className={classes["reading-title-two"]}>
                                Total hour:
                              </span>
                              <span className={classes["bold"]}>
                                {totalHour}
                              </span>
                            </div>
                          </div>
                          <Link to={"/machine/" + machine.id}>
                            <Tooltip title="Open">
                              <FaArrowAltCircleRight
                                className={classes["button"]}
                              />
                            </Tooltip>
                          </Link>
                        </div>
                      </>
                    }
                    key={machine.id}
                  >
                    <div className={classes["collapse-container"]}>
                      <div className={classes["title-wrapper"]}></div>
                      <div>
                        <div className={classes["reading"]}>
                          <span className={classes["reading-title-two"]}>
                            Working hour:
                          </span>
                          <span className={classes["bold"]}>
                            {workingHour === 0 ? 0 : workingHour.toFixed(2)}
                          </span>
                        </div>
                        <div className={classes["reading"]}>
                          <span className={classes["reading-title-two"]}>
                            Idle hour:
                          </span>
                          <span className={classes["bold"]}>
                            {idleHour === 0 ? 0 : idleHour.toFixed(2)}
                          </span>
                        </div>
                        <div className={classes["reading"]}>
                          <span className={classes["reading-title-two"]}>
                            Breakdown hour:
                          </span>
                          <span className={classes["bold"]}>
                            {breakdownHour === 0 ? 0 : breakdownHour.toFixed(2)}
                          </span>
                        </div>
                        <div className={classes["reading"]}>
                          <span className={classes["reading-title-two"]}>
                            Working %:
                          </span>
                          <span className={classes["bold"]}>
                            {workingPercentage === 0 || isNaN(workingPercentage)
                              ? 0
                              : workingPercentage.toFixed(2)}
                          </span>
                        </div>
                        <div className={classes["reading"]}>
                          <span className={classes["reading-title-two"]}>
                            Idle %:
                          </span>
                          <span className={classes["bold"]}>
                            {idlePercentage === 0 || isNaN(idlePercentage)
                              ? 0
                              : idlePercentage.toFixed(2)}
                          </span>
                        </div>
                        <div className={classes["reading"]}>
                          <span className={classes["reading-title-two"]}>
                            Breakdown %:
                          </span>
                          <span className={classes["bold"]}>
                            {breakdownPercentage === 0 ||
                            isNaN(breakdownPercentage)
                              ? 0
                              : breakdownPercentage.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Collapse.Panel>
                </Collapse>
              </div>
            );
          } else {
            return (
              <div className={classes["card"]} key={machine.id}>
                <Tooltip
                  title={
                    <>
                      <span className={classes["title"]}>
                        Registered Date:{" "}
                        {moment(machine?.registeredDate).format(
                          DATETIME_FORMATS.DAY_MONTH_YEAR
                        )}
                      </span>
                    </>
                  }
                >
                  <div className={classes["first-block"]}>
                    <div className={classes["title-wrapper"]}>
                      <FaTractor />
                      <span className={classes["title"]}>
                        {machine?.machineNumber}
                      </span>
                    </div>
                    <div className={classes["location-wrapper"]}>
                      <FaMapMarkerAlt />
                      <span className={classes["title"]}>{machine?.zone}</span>
                      <span className={classes["dash"]}>-</span>
                      <span>{machine?.location}</span>
                    </div>
                  </div>
                </Tooltip>

                <div className={classes["service-reading-wrapper"]}>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Working hour:
                    </span>
                    <span>
                      {workingHour === 0 ? 0 : workingHour.toFixed(2)}
                    </span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>Idle hour:</span>
                    <span>{idleHour === 0 ? 0 : idleHour.toFixed(2)}</span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Breakdown hour:
                    </span>
                    <span>
                      {breakdownHour === 0 ? 0 : breakdownHour.toFixed(2)}
                    </span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Total hours:
                    </span>
                    <span>{totalHour === 0 ? 0 : totalHour.toFixed(2)}</span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>Working %:</span>
                    <span>
                      {workingPercentage === 0 || isNaN(workingPercentage)
                        ? 0
                        : workingPercentage.toFixed(2)}
                    </span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>Idle %:</span>
                    <span>
                      {idlePercentage === 0 || isNaN(idlePercentage)
                        ? 0
                        : idlePercentage.toFixed(2)}
                    </span>
                  </div>
                  <div className={classes["reading"]}>
                    <span className={classes["reading-title"]}>
                      Breakdown %:
                    </span>
                    <span>
                      {breakdownPercentage === 0 || isNaN(breakdownPercentage)
                        ? 0
                        : breakdownPercentage.toFixed(2)}
                    </span>
                  </div>
                  <Link to={"/machine/" + machine.id}>
                    <Tooltip title="Open">
                      <FaArrowAltCircleRight className={classes["button"]} />
                    </Tooltip>
                  </Link>
                </div>
              </div>
            );
          }
        })
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

export default MachineryUtilization;
