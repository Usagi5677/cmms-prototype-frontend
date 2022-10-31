import { useLazyQuery } from "@apollo/client";
import { Checkbox, Empty, Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { REPAIRS } from "../../../../api/queries";
import PaginationButtons from "../../../../components/common/PaginationButtons/PaginationButtons";
import { errorMessage } from "../../../../helpers/gql";
import PaginationArgs from "../../../../models/PaginationArgs";
import classes from "./ViewRepair.module.css";
import UserContext from "../../../../contexts/UserContext";
import User from "../../../../models/User";
import Search from "../../../../components/common/Search";
import { useParams } from "react-router";
import {
  hasPermissions,
  isAssignedType,
} from "../../../../helpers/permissions";
import Repair from "../../../../models/Entity/Repair";
import RepairCard from "../../../../components/EntityComponents/RepairCard/RepairCard";
import AddRepair from "../../../../components/EntityComponents/AddRepair/AddRepair";
import { Entity } from "../../../../models/Entity/Entity";

export interface RepairRequestUserData {
  admin: User[];
  user: User[];
}

const ViewRepair = ({
  isDeleted,
  entity,
}: {
  isDeleted?: boolean | undefined;
  entity: Entity;
}) => {
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
  }, [filter, repairs, id]);

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
          entityId: parseInt(id),
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
  }, [search, id]);

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
          {hasPermissions(self, ["MODIFY_REPAIR_REQUEST"]) ||
          isAssignedType("Admin", entity!, self) ||
          isAssignedType("Engineer", entity!, self) ? (
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
        {data?.repairs.edges.length > 0 ? (
          <div>
            {data?.repairs.edges.map((rec: { node: Repair }) => {
              const repair = rec.node;
              return (
                <RepairCard
                  key={repair.id}
                  repair={repair}
                  isDeleted={isDeleted}
                />
              );
            })}
          </div>
        ) : (
          <Empty />
        )}
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
