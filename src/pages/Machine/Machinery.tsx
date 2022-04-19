import {
  FaGlobe,
  FaRegEnvelope,
  FaEllipsisV,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import classes from "./Machinery.module.css";
import { Input, Button, Menu, Dropdown, Spin } from "antd";
import Search from "../../components/common/Search";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DefaultPaginationArgs from "../../models/DefaultPaginationArgs";
import PaginationArgs from "../../models/PaginationArgs";
import { errorMessage } from "../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import { ALL_MACHINES } from "../../api/queries";
import { PAGE_LIMIT } from "../../helpers/constants";
import PaginationButtons from "../../components/common/PaginationButtons";
import AddMachine from "../../components/AddMachine";
import Machines from "../../components/Machine/Machine";
import Machine from "../../models/Machine";

const Machinery = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
    }
  >({
    ...DefaultPaginationArgs,
    search: "",
  });

  const [getAllMachine, { data, loading }] = useLazyQuery(ALL_MACHINES, {
    onError: (err) => {
      errorMessage(err, "Error loading machines.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch tickets when component mounts or when the filter object changes
  useEffect(() => {
    getAllMachine({ variables: filter });
  }, [filter, getAllMachine]);

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

  const pageInfo = data?.getAllMachine.pageInfo ?? {};

  return (
    <div className={classes["machinaries-container"]}>
      <div className={classes["machinaries-options-wrapper"]}>
        <Search
          searchValue={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
        />
        <div>
          <AddMachine />
        </div>
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      {data?.getAllMachine.edges.map((rec: { node: Machine }) => {
        const machine = rec.node;
        return (
          <Link to={"/machine/" + machine.id} key={machine.id}>
            <Machines machine={machine} />
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

export default Machinery;
