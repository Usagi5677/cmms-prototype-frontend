import { Collapse, message, Select, Spin, Tooltip } from "antd";
import Search from "../../Search";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DefaultPaginationArgs from "../../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../../models/PaginationArgs";
import { errorMessage } from "../../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import { ALL_MACHINE_UTILIZATION } from "../../../../api/queries";
import {
  DATETIME_FORMATS,
  ISLANDS,
  PAGE_LIMIT,
} from "../../../../helpers/constants";
import PaginationButtons from "../../PaginationButtons/PaginationButtons";
import MachineCard from "../../../MachineComponents/MachineCard/MachineCard";
import Machine from "../../../../models/Machine";
import classes from "./MachineUtilization.module.css";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import UserContext from "../../../../contexts/UserContext";
import moment from "moment";
import {
  FaArrowAltCircleRight,
  FaMapMarkerAlt,
  FaRegClock,
  FaTractor,
} from "react-icons/fa";

const Machinery = () => {
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
    first: 20,
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

  // Fetch tickets when component mounts or when the filter object changes
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
          first: 20,
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
      first: 20,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 20,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.getAllMachineUtilization?.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let options: any = [];
  ISLANDS?.map((island: string) => {
    options.push({
      value: island,
      label: island,
    });
  });

  console.log(data?.getAllMachineUtilization);
  return (
    <div className={classes["container"]}>
      <div className={classes["heading"]}>Utilization</div>
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
      {data?.getAllMachineUtilization?.edges.map((rec: { node: Machine }) => {
        const machine = rec.node;
        return (
          <div className={classes["card"]} key={machine.id}>
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

            <div className={classes["service-reading-wrapper"]}>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Working hours:</span>
                <span>{machine?.histories[0]?.workingHour}</span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Idle hours:</span>
                <span>{machine?.histories[0]?.idleHour}</span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>
                  Breakdown hours:
                </span>
                <span>{machine?.histories[0]?.breakdownHour}</span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Working %:</span>
                <span>
                  {machine?.histories[0]?.workingHour +
                    machine?.histories[0]?.idleHour +
                    machine?.histories[0]?.idleHour}
                </span>
              </div>
              <div className={classes["reading"]}>
                <span className={classes["reading-title"]}>Idle %:</span>
                <span>{machine?.histories[0]?.workingHour +
                    machine?.histories[0]?.idleHour -
                    machine?.histories[0]?.workingHour}</span>
              </div>
            </div>
          </div>
        );
      })}
      <PaginationButtons
        pageInfo={pageInfo}
        page={page}
        next={next}
        back={back}
        pageLimit={20}
      />
    </div>
  );
};

export default Machinery;
