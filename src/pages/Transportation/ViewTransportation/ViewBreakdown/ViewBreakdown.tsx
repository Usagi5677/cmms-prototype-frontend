import { useLazyQuery } from "@apollo/client";
import { Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { GET_ALL_BREAKDOWN_OF_TRANSPORTATION } from "../../../../api/queries";
import PaginationButtons from "../../../../components/common/PaginationButtons/PaginationButtons";
import AddTransportationBreakdown from "../../../../components/TransportationComponents/AddTransportationBreakdown/AddTransportationBreakdown";
import TransportationBreakdownCard from "../../../../components/TransportationComponents/TransportationBreakdownCard/TransportationBreakdownCard";
import { errorMessage } from "../../../../helpers/gql";
import Breakdown from "../../../../models/Transportation/TransportationBreakdown";
import PaginationArgs from "../../../../models/PaginationArgs";
import classes from "./ViewBreakdown.module.css";
import UserContext from "../../../../contexts/UserContext";

const ViewBreakdown = ({
  transportationID,
  isDeleted,
}: {
  transportationID: number;
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
      transportationId: number;
    }
  >({
    first: 5,
    last: null,
    before: null,
    after: null,
    search: "",
    transportationId: transportationID,
  });

  const [getAllBreakdownOfTransportation, { data, loading }] = useLazyQuery(
    GET_ALL_BREAKDOWN_OF_TRANSPORTATION,
    {
      onError: (err) => {
        errorMessage(err, "Error loading breakdown.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch breakdowns when component mounts or when the filter object changes
  useEffect(() => {
    getAllBreakdownOfTransportation({ variables: filter });
  }, [filter, getAllBreakdownOfTransportation]);

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

  const pageInfo = data?.getAllBreakdownOfTransportation.pageInfo ?? {};

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        {self.assignedPermission.hasTransportationBreakdownAdd && !isDeleted ? (
          <AddTransportationBreakdown transportationID={transportationID} />
        ) : null}
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      <div className={classes["content"]}>
        {data?.getAllBreakdownOfTransportation.edges.map(
          (rec: { node: Breakdown }) => {
            const breakdown = rec.node;
            return (
              <TransportationBreakdownCard
                key={breakdown.id}
                breakdown={breakdown}
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

export default ViewBreakdown;
