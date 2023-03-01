import { useLazyQuery } from "@apollo/client";
import {
  Badge,
  Collapse,
  DatePicker,
  Divider,
  Empty,
  Select,
  Spin,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { GET_ALL_HISTORY_OF_ENTITY } from "../../../../api/queries";
import { errorMessage } from "../../../../helpers/gql";
import PaginationArgs from "../../../../models/PaginationArgs";
import classes from "./ViewHistory.module.css";
import Search from "../../../../components/common/Search";
import { DATETIME_FORMATS } from "../../../../helpers/constants";
import moment from "moment";
import EntityHistory from "../../../../models/Entity/EntityHistory";
import EntityHistoryCard from "../../../../components/EntityComponents/EntityHistoryCard/EntityHistoryCard";
import { LocationSelector } from "../../../../components/Config/Location/LocationSelector";
import { useParams } from "react-router";

const ViewHistory = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [locationIds, setLocationIds] = useState<number[]>([]);
  const [dates, setDates] = useState<any>([
    moment().subtract(1, "week"),
    moment(),
  ]);
  const [timerId, setTimerId] = useState(null);
  const { id }: any = useParams();
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      locationIds: number[];
      entityId: number;
      from: any;
      to: any;
    }
  >({
    first: 500,
    last: null,
    before: null,
    after: null,
    search: "",
    locationIds: [],
    entityId: parseInt(id),
    from: dates[0].toISOString(),
    to: dates[1].toISOString(),
  });

  const [getAllHistoryOfEntity, { data, loading }] = useLazyQuery(
    GET_ALL_HISTORY_OF_ENTITY,
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
    getAllHistoryOfEntity({ variables: filter });
  }, [filter, getAllHistoryOfEntity, id]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (value: string, locationIds: number[]) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          entityId: parseInt(id),
          locationIds,
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
    searchDebounced(search, locationIds);
    // eslint-disable-next-line
  }, [search, locationIds, dates, id]);

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

  const pageInfo = data?.getAllHistoryOfEntity.pageInfo ?? {};

  const date = new Date(dates[0]);
  const endDate = new Date(dates[1]);
  const dateArray: any = [];

  if (data?.getAllHistoryOfEntity.edges) {
    while (date <= endDate) {
      for (const rec of data?.getAllHistoryOfEntity.edges) {
        if (
          moment(rec?.node?.createdAt).format(
            DATETIME_FORMATS.DAY_MONTH_YEAR
          ) === moment(date).format(DATETIME_FORMATS.DAY_MONTH_YEAR)
        ) {
          dateArray.push(new Date(date));
          break;
        }
      }
      date.setDate(date.getDate() + 1);
    }
  }

  const dateCount = (date: Date) =>
    data?.getAllHistoryOfEntity.edges?.filter(
      (rec: { node: EntityHistory }) =>
        moment(rec.node.createdAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR) ===
        moment(date).format(DATETIME_FORMATS.DAY_MONTH_YEAR)
    ).length;

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        <div className={classes["block-one"]}>
          <div className={classes["item"]}>
            <Search
              searchValue={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={() => setSearch("")}
            />
          </div>
          <div className={classes["item"]}>
            <LocationSelector
              setLocationId={setLocationIds}
              multiple={true}
              rounded={true}
              width={190}
            />
          </div>
        </div>

        <DatePicker.RangePicker
          className={classes["datepicker"]}
          defaultValue={dates}
          format={DATETIME_FORMATS.DAY_MONTH_YEAR}
          style={{ width: 350, borderRadius: 6 }}
          popupStyle={{ borderRadius: 6 }}
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
      {data?.getAllHistoryOfEntity.edges.length > 0 ? (
        <div className={classes["content"]}>
          {dateArray?.reverse()?.map((dateVal: any, index: number) => {
            return (
              <div
                className={classes["collapse-container"]}
                key={index + "div"}
              >
                <Collapse
                  ghost
                  style={{ marginBottom: ".5rem" }}
                  defaultActiveKey={index + "col"}
                >
                  <Collapse.Panel
                    header={
                      <div>
                        {moment(dateVal).format(
                          DATETIME_FORMATS.DAY_MONTH_YEAR
                        )}
                        {dateCount(dateVal) > 0 && (
                          <Badge
                            count={`${dateCount(dateVal)} item${
                              dateCount(dateVal) === 1 ? "" : "s"
                            }`}
                            style={{
                              color: "black",
                              backgroundColor: "#e5e5e5",
                              marginLeft: ".5rem",
                              marginBottom: ".3rem",
                            }}
                          />
                        )}
                      </div>
                    }
                    key={index + "col"}
                  >
                    {data?.getAllHistoryOfEntity.edges.map(
                      (rec: { node: EntityHistory }, i: number) => {
                        const history = rec.node;
                        if (
                          moment(history.createdAt).format(
                            DATETIME_FORMATS.DAY_MONTH_YEAR
                          ) ===
                          moment(dateVal).format(
                            DATETIME_FORMATS.DAY_MONTH_YEAR
                          )
                        ) {
                          return (
                            <div key={history.id}>
                              {i !== 0 && <Divider style={{ marginTop: 6, marginBottom: 6 }} />}
                              <EntityHistoryCard history={history} />
                            </div>
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
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default ViewHistory;
