import { Spin } from "antd";
import Search from "../../../components/common/Search";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import { errorMessage } from "../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import { ALL_TRANSPORTATION } from "../../../api/queries";
import { PAGE_LIMIT } from "../../../helpers/constants";
import PaginationButtons from "../../../components/common/PaginationButtons/PaginationButtons";
import classes from "./ViewAllVehicle.module.css";
import Transportation from "../../../models/Transportation";
import TransportationCard from "../../../components/TransportationComponents/TransportationCard/TransportationCard";
import AddTransportation from "../../../components/TransportationComponents/AddTransportation/AddTransportation";
import TransportationStatusFilter from "../../../components/common/TransportationStatusFilter";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";

const Vehicles = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [params, setParams] = useSearchParams();
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      transportType: string;
      status: any;
    }
  >({
    ...DefaultPaginationArgs,
    search: "",
    transportType: "Vehicle",
    status: params.get("status"),
  });

  const [getAllTransportation, { data, loading }] = useLazyQuery(
    ALL_TRANSPORTATION,
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

  // Fetch transportation when component mounts or when the filter object changes
  useEffect(() => {
    getAllTransportation({ variables: filter });
  }, [filter, getAllTransportation]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          ...DefaultPaginationArgs,
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
    searchDebounced(search);
    // eslint-disable-next-line
  }, [search]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: PAGE_LIMIT,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: PAGE_LIMIT,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.getAllTransportation.pageInfo ?? {};
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  return (
    <div className={classes["container"]}>
      <div className={classes["options-wrapper"]}>
        <Search
          searchValue={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
        />
        <TransportationStatusFilter
          onChange={(status) => {
            setFilter({ ...filter, status, ...DefaultPaginationArgs });
            setPage(1);
          }}
          value={filter.status}
          margin={filterMargin}
        />
        <div className={classes["add-wrapper"]}>
          <AddTransportation />
        </div>
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      {data?.getAllTransportation.edges.map((rec: { node: Transportation }) => {
        const transportation = rec.node;
        return (
          <Link
            to={"/transportation/" + transportation.id}
            key={transportation.id}
          >
            <TransportationCard transportation={transportation} />
          </Link>
        );
      })}
      <PaginationButtons
        pageInfo={pageInfo}
        page={page}
        next={next}
        back={back}
      />
    </div>
  );
};

export default Vehicles;
