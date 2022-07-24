import { useLazyQuery } from "@apollo/client";
import { Badge, Collapse, DatePicker, Select, Spin } from "antd";
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
  const [location, setLocation] = useState([]);
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
      location: string[];
      from: any;
      to: any;
    }
  >({
    first: 500,
    last: null,
    before: null,
    after: null,
    search: "",
    location: [],
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
  const searchDebounced = (value: string, locationValue: string[]) => {
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
          first: 500,
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
      first: 500,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 500,
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
  
  const date = new Date(dates[0]);
  const endDate = new Date(dates[1]);
  const dateArray = [];

  while (date <= endDate) {
    dateArray.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

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
          mode="multiple"
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
        {dateArray.reverse()?.map((dateVal, index) => {
          return (
            <div className={classes["collapse-container"]} key={index+"div"}>
              <Collapse ghost style={{ marginBottom: ".5rem" }}>
                <Collapse.Panel
                  header={
                    <div>
                      {moment(dateVal).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
                      <Badge
                        count={`${
                          data?.getAllHistoryOfTransportation.edges?.filter(
                            (rec: { node: History }) =>
                              moment(rec.node.createdAt).format(
                                DATETIME_FORMATS.DAY_MONTH_YEAR
                              ) ===
                              moment(dateVal).format(
                                DATETIME_FORMATS.DAY_MONTH_YEAR
                              )
                          ).length
                        } item`}
                        style={{
                          color: "black",
                          backgroundColor: "#e5e5e5",
                          marginLeft: ".5rem",
                          marginBottom: ".3rem",
                        }}
                      />
                    </div>
                  }
                  key={index+"col"}
                
                >
                  {data?.getAllHistoryOfTransportation.edges.map(
                    (rec: { node: History }) => {
                      const history = rec.node;
                      if (
                        moment(history.createdAt).format(
                          DATETIME_FORMATS.DAY_MONTH_YEAR
                        ) ===
                        moment(dateVal).format(DATETIME_FORMATS.DAY_MONTH_YEAR)
                      ) {
                        return (
                          <TransportationHistoryCard
                            key={history.id}
                            history={history}
                          />
                        );
                      }
                    }
                  )}
                </Collapse.Panel>
              </Collapse>
            </div>
          );
        })}
      </div>

      
    </div>
  );
};

export default ViewHistory;
