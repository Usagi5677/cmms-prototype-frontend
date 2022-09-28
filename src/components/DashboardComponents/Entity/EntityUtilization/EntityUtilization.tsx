import { Badge, Collapse, DatePicker, Empty, Spin, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import classes from "./EntityUtilization.module.css";
import {
  FaArrowAltCircleRight,
  FaMapMarkerAlt,
  FaTractor,
  FaTruck,
} from "react-icons/fa";
import { useLazyQuery } from "@apollo/client";
import {
  ALL_ENTITY_WITHOUT_PAGINATION,
  GET_ALL_CHECKLIST_AND_PM_SUMMARY,
  GET_ALL_ENTITY_USAGE_HISTORY,
} from "../../../../api/queries";
import { errorMessage } from "../../../../helpers/gql";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import PaginationArgs from "../../../../models/PaginationArgs";
import PaginationButtons from "../../../common/PaginationButtons/PaginationButtons";
import Search from "../../../common/Search";
import EntityUtilizationGraph from "../EntityUtilizationGraph/EntityUtilizationGraph";
import { Entity } from "../../../../models/Entity/Entity";
import { motion } from "framer-motion";
import { RiSailboatFill } from "react-icons/ri";
import { LocationSelector } from "../../../Config/Location/LocationSelector";
import ApexChart from "react-apexcharts";
import { DATETIME_FORMATS } from "../../../../helpers/constants";
import moment from "moment";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { TypeSelector } from "../../../Config/Type/TypeSelector";
import EntityCard from "../../../EntityComponents/EntityCard/EntityCard";
import { ZoneSelector } from "../../../Config/Zone/ZoneSelector";
import { useLocalStorage } from "../../../../helpers/useLocalStorage";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

const EntityUtilization = () => {
  const getFilter = localStorage.getItem("dashboardUtilizationFilter");
  let getFilterObjects: any;
  if (getFilter) {
    getFilterObjects = JSON.parse(JSON.parse(getFilter));
  }
  const [timerId, setTimerId] = useState(null);
  const { id }: any = useParams();
  const [search, setSearch] = useState(getFilterObjects?.search);
  const [locationIds, setLocationIds] = useState<number[]>(
    getFilterObjects?.locationIds
  );
  const [zoneIds, setZoneIds] = useState<number[]>(getFilterObjects?.zoneIds);
  const [typeIds, setTypeIds] = useState<number[]>(getFilterObjects?.typeIds);
  const [dates, setDates] = useState<any>([
    moment(getFilterObjects?.from),
    moment(getFilterObjects?.to),
  ]);
  const [saveFilterOptions, setSaveFilterOptions] = useLocalStorage(
    "dashboardUtilizationFilter",
    JSON.stringify({
      search: "",
      zoneIds: [],
      locationIds: [],
      typeIds: [],
      from: moment().subtract(1, "day"),
      to: moment(),
    })
  );

  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<{
    search: string;
    locationIds: number[];
    zoneIds: number[];
    typeIds: number[];
  }>({
    search: JSON.parse(saveFilterOptions)?.search,
    locationIds: JSON.parse(saveFilterOptions)?.locationIds,
    zoneIds: JSON.parse(saveFilterOptions)?.zoneIds,
    typeIds: JSON.parse(saveFilterOptions)?.typeIds,
  });

  const [allEntityUsageHistory, { data: history, loading: historyLoading }] =
    useLazyQuery(GET_ALL_ENTITY_USAGE_HISTORY, {
      onError: (err) => {
        errorMessage(err, "Error loading usage history.");
      },
    });

  useEffect(() => {
    allEntityUsageHistory({
      variables: {
        machineId: parseInt(id),
        from: dates[0].toISOString(),
        to: dates[1].toISOString(),
        search,
        locationIds,
        zoneIds,
        typeIds,
      },
    });
    const newfilter = {
      ...filter,
      from: dates[0].toISOString(),
      to: dates[1].toISOString(),
    };
    setSaveFilterOptions(JSON.stringify(newfilter));
  }, [dates, allEntityUsageHistory, search, locationIds, zoneIds, typeIds]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    locationIdsValue: number[],
    zoneIdsValue: number[],
    typeIdsValue: number[]
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          locationIds: locationIdsValue,
          zoneIds: zoneIdsValue,
          typeIds: typeIdsValue,
        }));
      }, 500)
    );
  };
  const initialRender = useRef<boolean>(true);
  useEffect(() => {
    if (initialRender.current === true) {
      initialRender.current = false;
      return;
    }
    searchDebounced(search, locationIds, zoneIds, typeIds);
    // eslint-disable-next-line
  }, [search, locationIds, zoneIds, typeIds]);

  const [getAllEntityWithoutPagination, { data, loading }] = useLazyQuery(
    ALL_ENTITY_WITHOUT_PAGINATION,
    {
      onError: (err) => {
        errorMessage(err, "Error loading entity.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );
  const [getAllEntityChecklistAndPMSummary, { data: summaryData }] =
    useLazyQuery(GET_ALL_CHECKLIST_AND_PM_SUMMARY, {
      onError: (err) => {
        errorMessage(err, "Error loading summary data.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  useEffect(() => {
    getAllEntityWithoutPagination({ variables: filter });
    getAllEntityChecklistAndPMSummary();
    const newfilter = {
      ...filter,
      from: dates[0].toISOString(),
      to: dates[1].toISOString(),
    };
    setSaveFilterOptions(JSON.stringify(newfilter));
  }, [filter, getAllEntityWithoutPagination]);

  const isSmallDevice = useIsSmallDevice(1290);
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  let options: any;
  if (history?.allEntityUsageHistory) {
    options = {
      title: {
        text: "Utilization",
      },
      subtitle: {
        text: `${moment(dates[0]).format(
          DATETIME_FORMATS.DAY_MONTH_YEAR
        )} - ${moment(dates[1]).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}`,
      },
      chart: {
        type: "bar",
        height:
          history?.allEntityUsageHistory.length * 43 < 600
            ? 600
            : history?.allEntityUsageHistory.length * 43,
      },
      plotOptions: {
        series: {
          stacking: "normal",
        },
      },
      xAxis: {
        categories: history?.allEntityUsageHistory.map(
          (rec: any) => rec?.machineNumber
        ),
      },
      yAxis: {
        min: 0,
        title: {
          text: "Amount",
        },
      },
      exporting: {
        buttons: {
          contextButton: {
            menuItems: [
              "viewFullscreen",
              "separator",
              "downloadSVG",
              "separator",
              "downloadCSV",
              "downloadXLS",
            ],
          },
        },
        filename: `Utilization (${moment(dates[0]).format(
          DATETIME_FORMATS.DAY_MONTH_YEAR
        )} - ${moment(dates[1]).format(DATETIME_FORMATS.DAY_MONTH_YEAR)})`,
        csv: {
          columnHeaderFormatter: function (item: any, key: any) {
            if (!item || item instanceof Highcharts.Axis) {
              return "Machine Number";
            } else {
              return item.name;
            }
          },
        },
      },
      legend: {
        reversed: true,
      },
      colors: [
        "rgba(166, 166, 166)",
        "rgba(235, 64, 52)",
        "rgba(252, 186, 3)",
        "rgba(8, 151, 156)",
      ],
      series: [
        {
          name: "NA",
          data: history?.allEntityUsageHistory.map((rec: any) =>
            parseInt(rec?.na?.toFixed(0))
          ),
        },
        {
          name: "Breakdown",
          data: history?.allEntityUsageHistory.map((rec: any) =>
            parseInt(rec?.breakdownHour?.toFixed(0))
          ),
        },
        {
          name: "Idle",
          data: history?.allEntityUsageHistory.map((rec: any) =>
            parseInt(rec?.idleHour?.toFixed(0))
          ),
        },
        {
          name: "Working",
          data: history?.allEntityUsageHistory.map((rec: any) =>
            parseInt(rec?.workingHour?.toFixed(0))
          ),
        },
      ],
    };
  }
  let uniqueType: any = [];
  let typeWithCountSorted: any = new Map([]);
  if (data?.getAllEntityWithoutPagination) {
    const data2 = data?.getAllEntityWithoutPagination;
    const typeWithCount = new Map([]);
    const type = data2?.map((e: Entity) => {
      let count: any = typeWithCount.get(e?.type?.name);
      if (count) {
        typeWithCount.set(e?.type?.name, count + 1);
      } else {
        typeWithCount.set(e?.type?.name, 1);
      }
      return e?.type?.name;
    });

    const type2 = [...new Set(type)];
    uniqueType = type2.filter(function (e) {
      return e !== undefined;
    });

    uniqueType.sort((a: any, b: any) => a.localeCompare(b));
    typeWithCount.delete(undefined);
    typeWithCountSorted = new Map(
      [...typeWithCount].sort((a: any, b: any) =>
        String(a[0]).localeCompare(b[0])
      )
    );
  }

  return (
    <>
      <motion.div
        className={classes["container"]}
        initial={{ x: 60, opacity: 0 }}
        whileInView={{
          x: 0,
          opacity: 1,
          transition: {
            ease: "easeOut",
            duration: 0.3,
            delay: 0.3,
          },
        }}
        viewport={{ once: true }}
      >
        <div className={classes["options-wrapper"]}>
          <DatePicker.RangePicker
            defaultValue={dates}
            format={DATETIME_FORMATS.DAY_MONTH_YEAR}
            className={classes["datepicker"]}
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
          <div className={classes["search"]}>
            <Search
              searchValue={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={() => setSearch("")}
            />
          </div>
        </div>
        <div
          style={{
            width: "100%",
            paddingRight: 10,
            paddingLeft: 10,
          }}
        >
          <TypeSelector
            setTypeId={setTypeIds}
            currentId={typeIds}
            rounded
            multiple
            width={"100%"}
          />
        </div>
        <div
          style={{
            marginTop: 10,
            width: "100%",
            paddingRight: 10,
            paddingLeft: 10,
          }}
        >
          <LocationSelector
            setLocationId={setLocationIds}
            currentId={locationIds}
            rounded
            multiple
            width={"100%"}
          />
        </div>
        <div
          style={{
            marginTop: 10,
            width: "100%",
            paddingRight: 10,
            paddingLeft: 10,
          }}
        >
          <ZoneSelector
            setZoneId={setZoneIds}
            currentId={zoneIds}
            rounded
            multiple
            width={"100%"}
          />
        </div>
        {historyLoading ? (
          <Spin style={{ marginTop: 140, marginBottom: 140 }} size={"large"} />
        ) : (
          <div>
            {history?.allEntityUsageHistory.length > 0 ? (
              <HighchartsReact highcharts={Highcharts} options={options} />
            ) : (
              <div
                style={{
                  marginTop: 140,
                }}
              >
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            )}
          </div>
        )}
        {loading ? (
          <div>
            <Spin style={{ width: "100%", margin: "2rem auto" }} />
          </div>
        ) : typeWithCountSorted.size > 0 ? (
          <div>
            {[...typeWithCountSorted].map((key: any) => (
              <Collapse ghost style={{ marginBottom: ".5rem" }} key={key[0]}>
                <Collapse.Panel
                  header={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span>{key[0]}</span>
                      <Badge
                        count={key[1]}
                        style={{
                          color: "black",
                          backgroundColor: "#e5e5e5",
                          marginLeft: ".5rem",
                        }}
                      />
                    </div>
                  }
                  key={key[0]}
                >
                  {data?.getAllEntityWithoutPagination.map((rec: Entity) => {
                    const entity = rec;
                    if (entity?.type?.name === key[0]) {
                      return (
                        <EntityCard
                          entity={entity}
                          key={entity.id}
                          summaryData={
                            summaryData?.getAllEntityChecklistAndPMSummary
                          }
                        />
                      );
                    }
                  })}
                </Collapse.Panel>
              </Collapse>
            ))}
          </div>
        ) : (
          <div
            style={{
              marginTop: 50,
            }}
          >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </motion.div>
    </>
  );
};

export default EntityUtilization;
