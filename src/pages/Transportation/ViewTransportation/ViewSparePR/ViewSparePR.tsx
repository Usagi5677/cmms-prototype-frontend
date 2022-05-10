import { useLazyQuery } from "@apollo/client";
import { Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { GET_ALL_SPARE_PR_OF_TRANSPORTATION } from "../../../../api/queries";
import PaginationButtons from "../../../../components/common/PaginationButtons/PaginationButtons";
import AddTransportationSparePR from "../../../../components/TransportationComponents/AddTransportationSparePR/AddTransportationSparePR";
import TransportationSparePRCard from "../../../../components/TransportationComponents/TransportationSparePRCard/TransportationSparePRCard";
import { errorMessage } from "../../../../helpers/gql";
import PaginationArgs from "../../../../models/PaginationArgs";
import SparePR from "../../../../models/Transportation/TransportationSparePR";

import classes from "./ViewSparePR.module.css";

const ViewSparePR = ({ transportationID }: { transportationID: number }) => {
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
    first: 3,
    last: null,
    before: null,
    after: null,
    search: "",
    transportationId: transportationID,
  });

  const [getAllSparePROfTransportation, { data, loading }] = useLazyQuery(
    GET_ALL_SPARE_PR_OF_TRANSPORTATION,
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
    getAllSparePROfTransportation({ variables: filter });
  }, [filter, getAllSparePROfTransportation]);

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
    searchDebounced(search);
    // eslint-disable-next-line
  }, [search]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: 3,
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

  const pageInfo = data?.getAllSparePROfTransportation.pageInfo ?? {};

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        <AddTransportationSparePR transportationID={transportationID} />
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      <div className={classes["content"]}>
        {data?.getAllSparePROfTransportation.edges.map((rec: { node: SparePR }) => {
          const sparePR = rec.node;
          return (
            <TransportationSparePRCard key={sparePR.id} sparePR={sparePR} />
          );
        })}
      </div>

      <PaginationButtons
        pageInfo={pageInfo}
        page={page}
        next={next}
        back={back}
        pageLimit={3}
      />
    </div>
  );
};

export default ViewSparePR;
