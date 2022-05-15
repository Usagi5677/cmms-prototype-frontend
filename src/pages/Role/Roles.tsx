import { Spin } from "antd";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import classes from "./Roles.module.css";
import PaginationArgs from "../../models/PaginationArgs";
import DefaultPaginationArgs from "../../models/DefaultPaginationArgs";
import { errorMessage } from "../../helpers/gql";
import { PAGE_LIMIT } from "../../helpers/constants";
import Search from "../../components/common/Search";
import PaginationButtons from "../../components/common/PaginationButtons/PaginationButtons";
import User from "../../models/User";
import Role from "../../models/Role";
import RoleCard from "../../components/RoleComponents/RoleCard/RoleCard";
import { GET_ALL_ROLES } from "../../api/queries";
import AddRole from "../../components/RoleComponents/AddRole/AddRole";

const Vehicles = () => {
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

  const [getAllRoles, { data, loading }] = useLazyQuery(GET_ALL_ROLES, {
    onError: (err) => {
      errorMessage(err, "Error loading roles.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch roles when component mounts or when the filter object changes
  useEffect(() => {
    getAllRoles({ variables: filter });
  }, [filter, getAllRoles]);

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

  const pageInfo = data?.getAllRoles.pageInfo ?? {};

  return (
    <div className={classes["container"]}>
      <div className={classes["options-wrapper"]}>
        <Search
          searchValue={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
        />
        <div className={classes["add-transportation-wrapper"]}>
          <div>
            <AddRole />
          </div>
        </div>
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      {data?.getAllRoles.edges.map((rec: { node: Role }) => {
        const roles = rec.node;
        return <RoleCard key={roles.id} role={roles} />;
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
