import { Empty, message, Select, Spin } from "antd";
import Search from "../../../components/common/Search";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import { errorMessage } from "../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import { ALL_TRANSPORTATION_VESSELS } from "../../../api/queries";
import { ISLANDS, PAGE_LIMIT } from "../../../helpers/constants";
import PaginationButtons from "../../../components/common/PaginationButtons/PaginationButtons";
import classes from "./ViewAssignedVessels.module.css";
import Transportation from "../../../models/Transportation";
import TransportationCard from "../../../components/TransportationComponents/TransportationCard/TransportationCard";
import AddTransportation from "../../../components/TransportationComponents/AddTransportation/AddTransportation";
import UserContext from "../../../contexts/UserContext";
import TransportationStatusFilter from "../../../components/common/TransportationStatusFilter";

const ViewAssignedVessels = () => {
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
      transportType: string;
      assignedToId: number;
      status: any;
      location: string[];
    }
  >({
    first: 20,
    last: null,
    before: null,
    after: null,
    search: "",
    transportType: "Vessel",
    assignedToId: self.id,
    location: [],
    status: params.get("status"),
  });

  // Update url search param on filter change
  useEffect(() => {
    let newParams: any = {};
    if (filter.status) newParams.status = filter.status;
    setParams(newParams);
  }, [filter, setParams, params]);

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

  // Fetch tickets when component mounts or when the filter object changes
  useEffect(() => {
    if (!self.assignedPermission.hasViewAllAssignedVessels) {
      navigate("/");
      message.error("No permission to view assigned vessels.");
    }
    getAllTransportationVessels({ variables: filter });
  }, [filter, getAllTransportationVessels]);

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

  const pageInfo = data?.getAllTransportationVessels.pageInfo ?? {};
  let options: any = [];
  ISLANDS?.map((island: string) => {
    options.push({
      value: island,
      label: island,
    });
  });
  
  return (
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
        <TransportationStatusFilter
          onChange={(status) => {
            setFilter({ ...filter, status, ...DefaultPaginationArgs });
            setPage(1);
          }}
          value={filter.status}
        />
        <div className={classes["add-wrapper"]}>
          {self.assignedPermission.hasTransportationAdd ? (
            <AddTransportation />
          ) : null}
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
  );
};

export default ViewAssignedVessels;
