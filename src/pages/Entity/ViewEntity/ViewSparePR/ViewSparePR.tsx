import { useLazyQuery } from "@apollo/client";
import { Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { GET_ALL_SPARE_PR_OF_ENTITY } from "../../../../api/queries";
import PaginationButtons from "../../../../components/common/PaginationButtons/PaginationButtons";
import { errorMessage } from "../../../../helpers/gql";
import PaginationArgs from "../../../../models/PaginationArgs";
import classes from "./ViewSparePR.module.css";
import UserContext from "../../../../contexts/UserContext";
import AddEntitySparePR from "../../../../components/EntityComponents/AddEntitySparePR/AddEntitySparePR";
import EntitySparePR from "../../../../models/Entity/EntitySparePR";
import EntitySparePRCard from "../../../../components/EntityComponents/EntitySparePRCard/EntitySparePRCard";

const ViewSparePR = ({
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
    entityId: entityID,
  });

  const [getAllSparePROfEntity, { data, loading }] = useLazyQuery(
    GET_ALL_SPARE_PR_OF_ENTITY,
    {
      onError: (err) => {
        errorMessage(err, "Error loading spare PR.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch spare pr when component mounts or when the filter object changes
  useEffect(() => {
    getAllSparePROfEntity({ variables: filter });
  }, [filter, getAllSparePROfEntity]);

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

  const pageInfo = data?.getAllSparePROfEntity.pageInfo ?? {};

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        {self.assignedPermission?.hasEntitySparePRAdd && !isDeleted ? (
          <AddEntitySparePR entityID={entityID} />
        ) : null}
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      <div className={classes["content"]}>
        {data?.getAllSparePROfEntity.edges.map(
          (rec: { node: EntitySparePR }) => {
            const sparePR = rec.node;
            return (
              <EntitySparePRCard
                key={sparePR.id}
                sparePR={sparePR}
                isDeleted={isDeleted}
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

export default ViewSparePR;
