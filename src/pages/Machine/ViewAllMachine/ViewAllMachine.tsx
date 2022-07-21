import { Empty, message, Select, Spin } from "antd";
import Search from "../../../components/common/Search";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import { errorMessage } from "../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import {
  ALL_MACHINES,
  GET_ALL_MACHINE_AND_TRANSPORTATION_STATUS_COUNT,
} from "../../../api/queries";
import { ISLANDS, PAGE_LIMIT } from "../../../helpers/constants";
import PaginationButtons from "../../../components/common/PaginationButtons/PaginationButtons";
import AddMachine from "../../../components/MachineComponents/AddMachine/AddMachine";
import MachineCard from "../../../components/MachineComponents/MachineCard/MachineCard";
import Machine from "../../../models/Machine";
import classes from "./ViewAllMachine.module.css";
import MachineStatusFilter from "../../../components/common/MachineStatusFilter";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import UserContext from "../../../contexts/UserContext";
import StatusCard from "../../../components/common/StatusCard/StatusCard";
import { FaCarCrash, FaSpinner, FaTractor } from "react-icons/fa";

const Machinery = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [params, setParams] = useSearchParams();
  const [location, setLocation] = useState([]);
  const navigate = useNavigate();
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      status: any;
      location: string[];
    }
  >({
    first: 20,
    last: null,
    before: null,
    after: null,
    search: "",
    location: [],
    status: params.get("status"),
  });

  const [getAllMachineAndTransportStatusCount, { data: statusData }] =
    useLazyQuery(GET_ALL_MACHINE_AND_TRANSPORTATION_STATUS_COUNT, {
      onError: (err) => {
        errorMessage(
          err,
          "Error loading status count of machine & transports."
        );
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  // Update url search param on filter change
  useEffect(() => {
    let newParams: any = {};
    if (filter.status) newParams.status = filter.status;
    setParams(newParams);
  }, [filter, setParams, params]);

  const [getAllMachine, { data, loading }] = useLazyQuery(ALL_MACHINES, {
    onError: (err) => {
      errorMessage(err, "Error loading machines.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch tickets when component mounts or when the filter object changes
  useEffect(() => {
    if (!self.assignedPermission.hasViewAllMachines) {
      navigate("/");
      message.error("No permission to view all machines.");
    }
    getAllMachine({ variables: filter });
  }, [filter, getAllMachine]);

  //Fetch all machine status count
  useEffect(() => {
    getAllMachineAndTransportStatusCount();
  }, [getAllMachineAndTransportStatusCount]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (value: string, locationValue: string[]) => {
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

  const pageInfo = data?.getAllMachine.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let options: any = [];
  ISLANDS?.map((island: string) => {
    options.push({
      value: island,
      label: island,
    });
  });

  let machineIdle = 0;
  let machineWorking = 0;
  let machineBreakdown = 0;
  let total = 0;

  const statusCountData = statusData?.allMachineAndTransportStatusCount;
  if (statusCountData) {
    machineIdle = statusCountData?.machineIdle;
    machineWorking = statusCountData?.machineWorking;
    machineBreakdown = statusCountData?.machineBreakdown;
    total = machineIdle + machineWorking + machineBreakdown;
  }

  return (
    <>
      <div className={classes["status-card"]}>
        <div className={classes["total-card"]}>
          <div className={classes["total-title"]}>Machinery</div>
          <div className={classes["total-amount"]}>{total}</div>
        </div>
        <StatusCard
          amountOne={machineWorking}
          icon={<FaTractor />}
          iconBackgroundColor={"rgb(224,255,255)"}
          iconColor={"rgb(0,139,139)"}
          name={"Working"}
        />
        <StatusCard
          amountOne={machineIdle}
          icon={<FaSpinner />}
          iconBackgroundColor={"rgba(255,165,0,0.2)"}
          iconColor={"rgb(219,142,0)"}
          name={"Idle"}
        />
        <StatusCard
          amountOne={machineBreakdown}
          icon={<FaCarCrash />}
          iconBackgroundColor={"rgba(255,0,0,0.2)"}
          iconColor={"rgb(139,0,0)"}
          name={"Breakdown"}
        />
      </div>
      <div className={classes["container"]}>
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
            mode="multiple"
          />
          <MachineStatusFilter
            onChange={(status) => {
              setFilter({ ...filter, status, ...DefaultPaginationArgs });
              setPage(1);
            }}
            value={filter.status}
          />
          <div className={classes["add-machine-wrapper"]}>
            {self.assignedPermission.hasMachineAdd ? <AddMachine /> : null}
          </div>
        </div>
        {loading && (
          <div>
            <Spin style={{ width: "100%", margin: "2rem auto" }} />
          </div>
        )}
        {data?.getAllMachine.edges.length > 0 ? (
          <div>
            {data?.getAllMachine.edges.map((rec: { node: Machine }) => {
              const machine = rec.node;
              return <MachineCard machine={machine} key={machine.id} />;
            })}
          </div>
        ) : (
          <div
            style={{
              marginTop: 50,
            }}
          >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}

        <PaginationButtons
          pageInfo={pageInfo}
          page={page}
          next={next}
          back={back}
          pageLimit={20}
        />
      </div>
    </>
  );
};

export default Machinery;
