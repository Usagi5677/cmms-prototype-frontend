import { Empty, message, Select, Spin } from "antd";
import Search from "../../../components/common/Search";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import { errorMessage } from "../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import {
  ALL_TRANSPORTATION_VESSELS,
  GET_ALL_MACHINE_AND_TRANSPORTATION_STATUS_COUNT,
} from "../../../api/queries";
import { DEPARTMENTS, ISLANDS, PAGE_LIMIT } from "../../../helpers/constants";
import PaginationButtons from "../../../components/common/PaginationButtons/PaginationButtons";
import classes from "./ViewAllVessel.module.css";
import Transportation from "../../../models/Transportation";
import TransportationCard from "../../../components/TransportationComponents/TransportationCard/TransportationCard";
import AddTransportation from "../../../components/TransportationComponents/AddTransportation/AddTransportation";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import TransportationStatusFilter from "../../../components/common/TransportationStatusFilter";
import UserContext from "../../../contexts/UserContext";
import StatusCard from "../../../components/common/StatusCard/StatusCard";
import { FaCarCrash, FaRecycle, FaSpinner, FaTruck } from "react-icons/fa";

const Vessels = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [params, setParams] = useSearchParams();
  const [location, setLocation] = useState([]);
  const [department, setDepartment] = useState([]);
  const navigate = useNavigate();
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      transportType: string;
      status: any;
      location: string[];
      department: string[];
    }
  >({
    first: 20,
    last: null,
    before: null,
    after: null,
    search: "",
    location: [],
    department: [],
    transportType: "Vessel",
    status: params.get("status"),
  });

  const [getAllTransportationVessels, { data, loading }] = useLazyQuery(
    ALL_TRANSPORTATION_VESSELS,
    {
      onError: (err) => {
        errorMessage(err, "Error loading vessels.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Update url search param on filter change
  useEffect(() => {
    let newParams: any = {};
    if (filter.status) newParams.status = filter.status;
    setParams(newParams);
  }, [filter, setParams, params]);

  // Fetch tickets when component mounts or when the filter object changes
  useEffect(() => {
    if (!self.assignedPermission.hasViewAllVessels) {
      navigate("/");
      message.error("No permission to view all vessels.");
    }
    getAllTransportationVessels({ variables: filter });
  }, [filter, getAllTransportationVessels]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    locationValue: string[],
    departmentValue: string[]
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          location: locationValue,
          department: departmentValue,
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
    searchDebounced(search, location, department);
    // eslint-disable-next-line
  }, [search, location, department]);

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

  useEffect(() => {
    getAllMachineAndTransportStatusCount();
  }, [getAllMachineAndTransportStatusCount]);

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

  const pageInfo = data?.getAllTransportationVessels.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let options: any = [];
  ISLANDS?.sort((a, b) => a.localeCompare(b))?.map((island: string) => {
    options.push({
      value: island,
      label: island,
    });
  });

  let departmentOptions: any = [];
  DEPARTMENTS?.sort((a, b) => a.localeCompare(b))?.map((dp: string) => {
    departmentOptions.push({
      value: dp,
      label: dp,
    });
  });

  let transportationIdle = 0;
  let transportationWorking = 0;
  let transportationBreakdown = 0;
  let transportationDispose = 0;
  let total = 0;

  const statusCountData = statusData?.allMachineAndTransportStatusCount;
  if (statusCountData) {
    transportationIdle = statusCountData?.transportationIdle;
    transportationWorking = statusCountData?.transportationWorking;
    transportationBreakdown = statusCountData?.transportationBreakdown;
    transportationDispose = statusCountData?.transportationDispose;
    total =
      transportationIdle +
      transportationWorking +
      transportationBreakdown +
      transportationDispose;
  }

  return (
    <>
      <div className={classes["status-card"]}>
        <div className={classes["total-card"]}>
          <div className={classes["total-title"]}>Transports</div>
          <div className={classes["total-amount"]}>{total}</div>
        </div>
        <StatusCard
          amountOne={transportationWorking}
          icon={<FaTruck />}
          iconBackgroundColor={"rgb(224,255,255)"}
          iconColor={"rgb(0,139,139)"}
          name={"Working"}
        />
        <StatusCard
          amountOne={transportationIdle}
          icon={<FaSpinner />}
          iconBackgroundColor={"rgba(255,165,0,0.2)"}
          iconColor={"rgb(219,142,0)"}
          name={"Idle"}
        />
        <StatusCard
          amountOne={transportationBreakdown}
          icon={<FaCarCrash />}
          iconBackgroundColor={"rgba(255,0,0,0.2)"}
          iconColor={"rgb(139,0,0)"}
          name={"Breakdown"}
        />
        <StatusCard
          amountOne={transportationDispose}
          icon={<FaRecycle />}
          iconBackgroundColor={"rgba(102, 0, 0,0.3)"}
          iconColor={"rgb(102, 0, 0)"}
          name={"Dispose"}
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
          <Select
            showArrow
            className={classes["department"]}
            onChange={(value) => setDepartment(value)}
            showSearch
            options={departmentOptions}
            placeholder={"Department"}
            mode="multiple"
          />
          <TransportationStatusFilter
            onChange={(status) => {
              setFilter({ ...filter, status, ...DefaultPaginationArgs });
              setPage(1);
            }}
            value={filter.status}
          />
          <div className={classes["add-wrapper"]}>
            <AddTransportation transportationType="Vessel" />
          </div>
        </div>
        {loading && (
          <div>
            <Spin style={{ width: "100%", margin: "2rem auto" }} />
          </div>
        )}
        {data?.getAllTransportationVessels.edges.length > 0 ? (
          <div>
            {data?.getAllTransportationVessels.edges.map(
              (rec: { node: Transportation }) => {
                const transportation = rec.node;
                return (
                  <TransportationCard
                    transportation={transportation}
                    key={transportation.id}
                  />
                );
              }
            )}
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

export default Vessels;
