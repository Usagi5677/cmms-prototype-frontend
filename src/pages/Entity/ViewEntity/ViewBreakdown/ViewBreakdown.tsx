import { useLazyQuery } from "@apollo/client";
import { Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { BREAKDOWNS } from "../../../../api/queries";
import PaginationButtons from "../../../../components/common/PaginationButtons/PaginationButtons";
import Search from "../../../../components/common/Search";
import AddBreakdown from "../../../../components/EntityComponents/AddBreakdown/AddBreakdown";
import BreakdownCard from "../../../../components/EntityComponents/BreakdownCard/BreakdownCard";
import UserContext from "../../../../contexts/UserContext";
import { errorMessage } from "../../../../helpers/gql";
import { hasPermissions } from "../../../../helpers/permissions";
import Breakdown from "../../../../models/Entity/Breakdown";
import PaginationArgs from "../../../../models/PaginationArgs";
import classes from "./ViewBreakdown.module.css";

const ViewBreakdown = ({ isDeleted }: { isDeleted?: boolean | undefined }) => {
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

  const [breakdowns, { data, loading }] = useLazyQuery(BREAKDOWNS, {
    onError: (err) => {
      errorMessage(err, "Error loading breakdown.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch breakdowns when component mounts or when the filter object changes
  useEffect(() => {
    breakdowns({ variables: filter });
  }, [filter, breakdowns]);

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
      last: 3,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.breakdowns.pageInfo ?? {};

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
        {hasPermissions(self, ["MODIFY_BREAKDOWN"]) ? (
          <AddBreakdown entityID={parseInt(id)} isDeleted={isDeleted} />
        ) : null}
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      <div className={classes["content"]}>
        {data?.breakdowns.edges.map((rec: { node: Breakdown }) => {
          const breakdown = rec.node;
          return (
            <BreakdownCard
              key={breakdown.id}
              breakdown={breakdown}
              isDeleted={isDeleted}
            />
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

export default ViewBreakdown;
