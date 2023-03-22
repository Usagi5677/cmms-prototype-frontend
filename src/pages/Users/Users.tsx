import { useLazyQuery } from "@apollo/client";
import { useContext, useEffect, useRef, useState } from "react";
import { Breadcrumb, Button, Empty, Result, Spin } from "antd";
import { errorMessage } from "../../helpers/gql";
import Search from "../../components/common/Search";
import PaginationArgs from "../../models/PaginationArgs";
import DefaultPaginationArgs from "../../models/DefaultPaginationArgs";
import classes from "./Users.module.css";
import PaginationButtons from "../../components/common/PaginationButtons/PaginationButtons";
import { NO_AUTH_MESSAGE_THREE, PAGE_LIMIT } from "../../helpers/constants";
import AddUserRoles from "../../components/UserComponents/AddUserRoles/AddUserRoles";
import { GET_ALL_USERS } from "../../api/queries";
import User from "../../models/User";
import UserCard from "../../components/UserComponents/UserCard/UserCard";
import UserContext from "../../contexts/UserContext";
import { hasPermissions } from "../../helpers/permissions";
import { useIsSmallDevice } from "../../helpers/useIsSmallDevice";
import { Link } from "react-router-dom";

const Users = () => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [timerId, setTimerId] = useState(null);
  const [search, setSearch] = useState("");
  const isSmallDevice = useIsSmallDevice(600, true);
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

  return !hasPermissions(self, ["VIEW_USERS"]) ? (
    <Result
      status="403"
      title="403"
      subTitle={NO_AUTH_MESSAGE_THREE}
      extra={
        <Button
          type="primary"
          onClick={() => `${window.open("https://helpdesk.mtcc.com.mv/")}`}
          style={{ borderRadius: 2 }}
        >
          Get Help
        </Button>
      }
    />
  ) : (
    <>
      <Breadcrumb style={{ marginBottom: 6 }}>
        <Breadcrumb.Item>
          <Link to={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Users</Breadcrumb.Item>
      </Breadcrumb>
      <div className={classes["container"]}>
        <div className={classes["options-wrapper"]}>
          <Search
            searchValue={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch("")}
          />
          <div className={classes["add-wrapper"]}>
            {hasPermissions(self, ["ADD_USER_WITH_ROLE"]) ? (
              <AddUserRoles />
            ) : null}
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
              return (
                <UserCard
                  userData={userData}
                  key={userData.id}
                  small={isSmallDevice}
                />
              );
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
    </>
  );
};

export default Users;
