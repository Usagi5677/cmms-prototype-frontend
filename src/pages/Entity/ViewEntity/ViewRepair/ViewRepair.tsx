import { useLazyQuery } from "@apollo/client";
import { Checkbox, Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import {
  GET_ALL_REPAIR_OF_ENTITY,
  GET_USERS_WITH_PERMISSION,
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

const ViewRepair = ({
  entityID,
  isDeleted,
}: {
  entityID: number;
  isDeleted?: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [complete, setComplete] = useState(false);
  const [approve, setApprove] = useState(false);
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      entityId: number;
      complete: boolean;
      approve: boolean;
    }
  >({
    first: 5,
    last: null,
    before: null,
    after: null,
    search: "",
    entityId: entityID,
    approve: false,
    complete: false,
  });

  const [getAllRepairRequestOfEntity, { data, loading }] = useLazyQuery(
    GET_ALL_REPAIR_OF_ENTITY,
    {
      onError: (err) => {
        errorMessage(err, "Error loading repair.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  const [getUsersWithPermission, { data: userData, loading: loadingUsers }] =
    useLazyQuery(GET_USERS_WITH_PERMISSION, {
      onError: (err) => {
        errorMessage(err, "Error loading request.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    });

  // Fetch repairs when component mounts or when the filter object changes
  useEffect(() => {
    getAllRepairRequestOfEntity({ variables: filter });
  }, [filter, getAllRepairRequestOfEntity]);

  // Fetch users when component mount
  useEffect(() => {
    getUsersWithPermission({
      variables: { permissions: ["ADD_ENTITY_REPAIR_REQUEST"] },
    });
  }, [getUsersWithPermission]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    approveValue: boolean,
    completeValue: boolean
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          approve: approveValue,
          complete: completeValue,
          first: 3,
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
    searchDebounced(search, approve, complete);
    // eslint-disable-next-line
  }, [search, approve, complete]);

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

  const pageInfo = data?.getAllRepairRequestOfEntity.pageInfo ?? {};

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        <div className={classes["first-block"]}>
          <Search
            searchValue={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch("")}
          />
          <div className={classes["checkbox"]}>
            <Checkbox onChange={(e) => setComplete(e.target.checked)}>
              Complete
            </Checkbox>
          </div>

          <Checkbox onChange={(e) => setApprove(e.target.checked)}>
            Approve
          </Checkbox>
        </div>

        {self.assignedPermission?.hasEntityRepairRequestAdd && !isDeleted ? (
          <div className={classes["add"]}>
            <AddEntityRepairRequest
              entityID={entityID}
              userData={userData?.getUsersWithPermission}
            />
          </div>
        ) : null}
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      <div className={classes["content"]}>
        {data?.getAllRepairRequestOfEntity.edges.map(
          (rec: { node: EntityRepairRequest }) => {
            const repair = rec.node;
            return (
              <EntityRepairCard
                key={repair.id}
                repair={repair}
                isDeleted={isDeleted}
                userData={userData?.getUsersWithPermission}
              />
            );
          }
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
