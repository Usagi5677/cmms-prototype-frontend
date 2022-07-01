import { useLazyQuery } from "@apollo/client";
import { DatePicker, Select, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { GET_ALL_HISTORY_OF_TRANSPORTATION } from "../../../../api/queries";
import PaginationButtons from "../../../../components/common/PaginationButtons/PaginationButtons";
import TransportationHistoryCard from "../../../../components/TransportationComponents/TransportationHistoryCard/TransportationHistoryCard";
import { errorMessage } from "../../../../helpers/gql";
import History from "../../../../models/Transportation/TransportationHistory";
import PaginationArgs from "../../../../models/PaginationArgs";
import classes from "./ViewHistory.module.css";
import Search from "../../../../components/common/Search";
import { DATETIME_FORMATS, ISLANDS } from "../../../../helpers/constants";
import moment from "moment";

const ViewHistory = ({ transportationID }: { transportationID: number }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState<any>([
    moment().subtract(1, "months"),
    moment(),
  ]);
  const [timerId, setTimerId] = useState(null);
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      transportationId: number;
      location: string;
      from: any;
      to: any;
    }
  >({
    first: 20,
    last: null,
    before: null,
    after: null,
    search: "",
    location: "",
    from: dates[0].toISOString(),
    to: dates[1].toISOString(),
    transportationId: transportationID,
  });

  const [getAllHistoryOfTransportation, { data, loading }] = useLazyQuery(
    GET_ALL_HISTORY_OF_TRANSPORTATION,
    {
      onError: (err) => {
        errorMessage(err, "Error loading history.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch history when component mounts or when the filter object changes
  useEffect(() => {
    getAllHistoryOfTransportation({ variables: filter });
  }, [filter, getAllHistoryOfTransportation]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (value: string, locationValue: string) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          location: locationValue,
          from: dates[0].toISOString(),
          to: dates[1].toISOString(),
          first: 20,
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
    searchDebounced(search, location);
    // eslint-disable-next-line
  }, [search, location, dates]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: 20,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 20,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.getAllHistoryOfTransportation.pageInfo ?? {};

  let options: any = [];
  ISLANDS?.map((island: string) => {
    options.push({
      value: island,
      label: island,
    });
  });
  
  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        <Search
          searchValue={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
        />
        <Select
          showArrow
          className={classes["location"]}
          onChange={(value) => setLocation(value)}
          showSearch
          options={options}
          placeholder={"Location"}
        />
        <DatePicker.RangePicker
          className={classes["datepicker"]}
          defaultValue={dates}
          format={DATETIME_FORMATS.DAY_MONTH_YEAR}
          style={{ width: 350, borderRadius: 20 }}
          popupStyle={{ borderRadius: 20 }}
          disabledDate={(date) => date.isAfter(moment(), "day")}
          onChange={setDates}
          allowClear={false}
          ranges={{
            "Past 7 Days": [moment().subtract(1, "week"), moment()],
            "This Week": [moment().startOf("week"), moment()],
            "Past 30 Days": [moment().subtract(30, "day"), moment()],
            "This Month": [moment().startOf("month"), moment()],
          }}
        />
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      <div className={classes["content"]}>
        {data?.getAllHistoryOfTransportation.edges.map((rec: { node: History }) => {
          const history = rec.node;
          return <TransportationHistoryCard key={history.id} history={history} />;
        })}
      </div>

      <PaginationButtons
        pageInfo={pageInfo}
        page={page}
        next={next}
        back={back}
        pageLimit={20}
      />
    </div>
  );
};

export default ViewHistory;
