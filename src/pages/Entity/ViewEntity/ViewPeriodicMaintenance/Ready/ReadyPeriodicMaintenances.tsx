import { useLazyQuery } from "@apollo/client";
import { Button, DatePicker, Empty, Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ALL_PERIODIC_MAINTENANCE,
  PERIODIC_MAINTENANCE_SUMMARIES,
} from "../../../../../api/queries";
import PaginationButtons from "../../../../../components/common/PaginationButtons/PaginationButtons";
import { errorMessage } from "../../../../../helpers/gql";
import PaginationArgs from "../../../../../models/PaginationArgs";
import classes from "./ReadyPeriodicMaintenances.module.css";
import { useParams } from "react-router";
import PeriodicMaintenance from "../../../../../models/PeriodicMaintenance/PeriodicMaintenance";
import PeriodicMaintenanceCard from "../../../../../components/EntityComponents/PeriodicMaintenanceCard/PeriodicMaintenanceCard";
import moment from "moment";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import {
  PeriodicMaintenancesStatus,
  PeriodicMaintenanceSummary,
} from "../../../../../components/PeriodicMaintenanceStatus/PeriodicMaintenanceStatus";
import PeriodicMaintenanceCalendar from "../../../../../components/EntityComponents/PeriodicMaintenanceCalendar/PeriodicMaintenanceCalendar";
import { Entity } from "../../../../../models/Entity/Entity";
import { useSearchParams } from "react-router-dom";
import DownloadReport from "../../../../../components/common/DownloadReport/DownloadReport";


const ReadyPeriodicMaintenances = ({
  isDeleted,
  entity,
}: {
  isDeleted?: boolean | undefined;
  entity: Entity;
}) => {
  const [params, setParams] = useSearchParams();
  const urlParamCreatedDate = params.get("createdAt");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [dates, setDates] = useState<any>([
    urlParamCreatedDate ? moment(urlParamCreatedDate) : moment(),
    urlParamCreatedDate ? moment(urlParamCreatedDate) : moment(),
  ]);
  const [month, setMonth] = useState([
    dates[0].clone().startOf("month"),
    dates[0].clone().endOf("month"),
  ]);
  const { RangePicker } = DatePicker;
  const { id }: any = useParams();
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      entityId: number;
      type: string;
      from: any;
      to: any;
    }
  >({
    first: 5,
    last: null,
    before: null,
    after: null,
    search: "",
    entityId: parseInt(id),
    type: "Copy",
    from: urlParamCreatedDate ? moment(urlParamCreatedDate) : dates[0],
    to: urlParamCreatedDate ? moment(urlParamCreatedDate) : dates[1],
  });
  const [periodicMaintenances, { data, loading }] = useLazyQuery(
    ALL_PERIODIC_MAINTENANCE,
    {
      onError: (err) => {
        errorMessage(err, "Error loading periodic maintenances.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  const [getSummary, { data: summary }] = useLazyQuery(
    PERIODIC_MAINTENANCE_SUMMARIES
  );

  // Fetch periodic maintenance when component mounts or when the filter object changes
  useEffect(() => {
    periodicMaintenances({ variables: filter });
    if (!month[0].isSame(dates[0], "month")) {
      setMonth([
        dates[0].clone().startOf("month"),
        dates[0].clone().endOf("month"),
      ]);
    }
  }, [filter, periodicMaintenances, dates, id]);

  useEffect(() => {
    getSummary({
      variables: {
        entityId: parseInt(id),
        from: month[0],
        to: month[1],
      },
    });
  }, [month]);
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
          from: dates[0],
          to: dates[1],
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
  }, [search, dates, id]);

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

  const pageInfo = data?.periodicMaintenances.pageInfo ?? {};

  const changeDate = (direction: "forward" | "back") => {
    if (direction === "forward") {
      setDates([
        dates[0].clone().add(1, "day"),
        dates[1].clone().add(1, "day"),
      ]);
    } else {
      setDates([
        dates[0].clone().subtract(1, "day"),
        dates[1].clone().subtract(1, "day"),
      ]);
    }
  };

  const changeDateButton = (direction: "forward" | "back") => (
    <Button
      onClick={() => changeDate(direction)}
      disabled={loading}
      style={
        direction === "forward"
          ? { marginLeft: ".5rem" }
          : { marginRight: ".5rem" }
      }
    >
      {direction === "forward" ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
    </Button>
  );

  const summaryMatch = (current: any) => {
    if (!summary) return null;
    const match = summary.periodicMaintenanceSummary.filter(
      (ps: PeriodicMaintenanceSummary) => {
        return current.clone().startOf("day").toISOString() === ps.from;
      }
    );
    if (match.length <= 0) {
      return null;
    }

    let allTaskCompletion = match.length;
    let someTaskCompletion = match.length;
    let readings = match.length;
    let verified = match.length;
    let observations = match.length;
    let remarks = match.length;

    for (const smry of match) {
      if (smry.taskCompletion === "all") {
        allTaskCompletion = allTaskCompletion - 1;
      } else if (smry.taskCompletion === "some") {
        someTaskCompletion = someTaskCompletion - 1;
      }
      if (smry.currentMeterReading) {
        readings = readings - 1;
      }
      if (smry.hasVerify) {
        verified = verified - 1;
      }
      if (smry.hasObservations) {
        observations = observations - 1;
      }
      if (smry.hasRemarks) {
        remarks = remarks - 1;
      }
    }
    const PeriodicMaintenancesStatusProps = {
      allTaskCompletion,
      someTaskCompletion,
      readings,
      verified,
      observations,
      remarks,
    };
    return (
      <PeriodicMaintenancesStatus summary={PeriodicMaintenancesStatusProps} />
    );
  };

  //find class length so id can be placed on this picker only
  const datePickerClasses = document.getElementsByClassName(
    "ant-picker-panel-container"
  );
  const datePickerClassesLength = datePickerClasses?.length;
  const onclick = () => {
    const dp = document.getElementsByClassName("ant-picker-panel-container");
    const idExist = document.getElementById("pmDatepicker");
    if (!idExist) {
      dp[datePickerClassesLength].id = "pmDatepicker";
    }
  };

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        <div className={classes["datepicker-wrapper"]}>
          {changeDateButton("back")}
          <RangePicker
            style={{ width: "100%" }}
            value={[dates[0], dates[1]]}
            onChange={(val) => {
              if (val) setDates([val[0], val[1]]);
            }}
            onClick={onclick}
            dropdownClassName={classes["dropdown"]}
            placement={"bottomRight"}
            allowClear={false}
            dateRender={(current) => (
              <div>
                <div className="ant-picker-cell-inner">{current.date()}</div>
                {summaryMatch(current)}
              </div>
            )}
          />
          {changeDateButton("forward")}
        </div>
        <div className={classes["calendar"]}>
          <PeriodicMaintenanceCalendar summary={summary} />
          <DownloadReport
              query={ALL_PERIODIC_MAINTENANCE}
              filter={filter}
              name="ReadyPM"
            />
        </div>
        
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      <div className={classes["content"]}>
        {data?.periodicMaintenances.edges.length > 0 ? (
          <div>
            {data?.periodicMaintenances.edges.map(
              (rec: { node: PeriodicMaintenance }) => {
                const periodicMaintenance = rec.node;
                const isOlderPeriodicMaintenance = moment(
                  periodicMaintenance.to
                ).isBefore(moment(), "second");
                return (
                  <PeriodicMaintenanceCard
                    key={periodicMaintenance.id}
                    periodicMaintenance={periodicMaintenance}
                    isDeleted={isDeleted}
                    isOlder={isOlderPeriodicMaintenance}
                    isCopy
                    summary={summary?.periodicMaintenanceSummary}
                    entity={entity}
                  />
                );
              }
            )}
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

export default ReadyPeriodicMaintenances;
