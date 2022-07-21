import { useLazyQuery } from "@apollo/client";
import { useContext, useEffect, useRef, useState } from "react";
import { Empty, message, Spin } from "antd";
import { errorMessage } from "../../helpers/gql";
import Search from "../../components/common/Search";
import PaginationArgs from "../../models/PaginationArgs";
import DefaultPaginationArgs from "../../models/DefaultPaginationArgs";
import classes from "./Users.module.css";
import PaginationButtons from "../../components/common/PaginationButtons/PaginationButtons";
import { PAGE_LIMIT } from "../../helpers/constants";
import AddUserRoles from "../../components/UserComponents/AddUserRoles/AddUserRoles";
import { GET_ALL_USERS } from "../../api/queries";
import User from "../../models/User";
import UserCard from "../../components/UserComponents/UserCard/UserCard";
import UserContext from "../../contexts/UserContext";
import { useNavigate } from "react-router";

const Users = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [timerId, setTimerId] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
    }
  >({
    ...DefaultPaginationArgs,
    search: "",
  });

  const [getAllUsers, { data, loading }] = useLazyQuery(GET_ALL_USERS, {
    onError: (err) => {
      errorMessage(err, "Error loading app users.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch users when component mounts
  useEffect(() => {
    if (!self.assignedPermission.hasViewUsers) {
      navigate("/");
      message.error("No permission to view users.");
    }
    getAllUsers({ variables: filter });
  }, [filter, getAllUsers]);

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

  const pageInfo = data?.getAllUsers?.pageInfo ?? {};
  return (
    <div className={classes["container"]}>
      <div className={classes["options-wrapper"]}>
        <Search
          searchValue={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
        />
        <div className={classes["add-wrapper"]}>
          {self.assignedPermission.hasAddUserWithRole ? <AddUserRoles /> : null}
        </div>
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      {data?.getAllUsers.edges.length > 0 ? (
        <div>
          {data?.getAllUsers.edges.map((rec: { node: User }) => {
            const userData = rec.node;
            return <UserCard userData={userData} key={userData.id} />;
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
      />
    </div>
  );
};

export default Users;
