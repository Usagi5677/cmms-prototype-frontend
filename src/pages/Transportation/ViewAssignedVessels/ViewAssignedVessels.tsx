import { Spin } from "antd";
import Search from "../../../components/common/Search";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import { errorMessage } from "../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import { ALL_TRANSPORTATION_VESSELS } from "../../../api/queries";
import { PAGE_LIMIT } from "../../../helpers/constants";
import PaginationButtons from "../../../components/common/PaginationButtons/PaginationButtons";
import classes from "./ViewAssignedVessels.module.css";
import Transportation from "../../../models/Transportation";
import TransportationCard from "../../../components/TransportationComponents/TransportationCard/TransportationCard";
import AddTransportation from "../../../components/TransportationComponents/AddTransportation/AddTransportation";
import UserContext from "../../../contexts/UserContext";

const ViewAssignedVessels = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const { user: self } = useContext(UserContext);
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      transportType: string;
      assignedToId: number;
    }
  >({
    ...DefaultPaginationArgs,
    search: "",
    transportType: "Vessel",
    assignedToId: self.id,
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

  // Fetch tickets when component mounts or when the filter object changes
  useEffect(() => {
    getAllTransportationVessels({ variables: filter });
  }, [filter, getAllTransportationVessels]);

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

  const pageInfo = data?.getAllTransportationVessels.pageInfo ?? {};

  return (
    <div className={classes["container"]}>
      <div className={classes["options-wrapper"]}>
        <Search
          searchValue={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
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
      {data?.getAllTransportationVessels.edges.map(
        (rec: { node: Transportation }) => {
          const transportation = rec.node;
          return (
            <Link
              to={"/transportation/" + transportation.id}
              key={transportation.id}
            >
              <TransportationCard transportation={transportation} />
            </Link>
          );
        }
      )}
      <PaginationButtons
        pageInfo={pageInfo}
        page={page}
        next={next}
        back={back}
      />
    </div>
  );
};

export default ViewAssignedVessels;
