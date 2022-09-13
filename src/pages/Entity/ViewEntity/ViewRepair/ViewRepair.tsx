import { useLazyQuery } from "@apollo/client";
import { Checkbox, Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import {
  GET_ALL_REPAIR_OF_ENTITY,
  GET_USERS_WITH_PERMISSION,
  REPAIRS,
} from "../../../../api/queries";
import PaginationButtons from "../../../../components/common/PaginationButtons/PaginationButtons";
import { errorMessage } from "../../../../helpers/gql";
import PaginationArgs from "../../../../models/PaginationArgs";
import classes from "./ViewRepair.module.css";
import UserContext from "../../../../contexts/UserContext";
import AddEntityRepairRequest from "../../../../components/EntityComponents/AddEntityRepairRequest/AddEntityRepairRequest";
import EntityRepairCard from "../../../../components/EntityComponents/EntityRepairCard/EntityRepairCard";
import EntityRepairRequest from "../../../../models/Entity/EntityRepairRequest";
import User from "../../../../models/User";
import Search from "../../../../components/common/Search";
import { useParams } from "react-router";
import { hasPermissions } from "../../../../helpers/permissions";
import { GetUsersWithPermission } from "../../../../helpers/getUsersWithPermission";
import Repair from "../../../../models/Entity/Repair";
import RepairCard from "../../../../components/EntityComponents/RepairCard/RepairCard";
import AddRepair from "../../../../components/EntityComponents/AddRepair/AddRepair";

export interface RepairRequestUserData {
  admin: User[];
  user: User[];
}

const ViewRepair = ({ isDeleted }: { isDeleted?: boolean | undefined }) => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const { id }: any = useParams();
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      entityId: number;
    }
  >({
    first: 5,
    last: null,
    before: null,
    after: null,
    search: "",
    entityId: parseInt(id),
  });

  const [repairs, { data, loading }] = useLazyQuery(REPAIRS, {
    onError: (err) => {
      errorMessage(err, "Error loading repair.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch repairs when component mounts or when the filter object changes
  useEffect(() => {
    repairs({ variables: filter });
  }, [filter, repairs]);

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
          first: 5,
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
    // eslint-disable-next-line no-restricted-globals
    searchDebounced(search);
    // eslint-disable-next-line
  }, [search]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: 5,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 5,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.repairs.pageInfo ?? {};

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        <div className={classes["first-block"]}>
          <Search
            searchValue={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch("")}
          />
        </div>

        <div className={classes["add"]}>
          {hasPermissions(self, ["MODIFY_REPAIR_REQUEST"]) ? (
            <AddRepair />
          ) : null}
        </div>
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      <div className={classes["content"]}>
        {data?.repairs.edges.map((rec: { node: Repair }) => {
          const repair = rec.node;
          return (
            <RepairCard key={repair.id} repair={repair} isDeleted={isDeleted} />
          );
        })}
      </div>

      <PaginationButtons
        pageInfo={pageInfo}
        page={page}
        next={next}
        back={back}
        pageLimit={5}
      />
    </div>
  );
};

export default ViewRepair;
