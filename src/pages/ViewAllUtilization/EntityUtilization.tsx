import {
  Badge,
  Checkbox,
  Collapse,
  DatePicker,
  Empty,
  Spin,
  Switch,
  Table,
  Tooltip,
} from "antd";
import { memo, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import classes from "./EntityUtilization.module.css";
import { useLazyQuery } from "@apollo/client";
import {
  ALL_ENTITY_WITHOUT_PAGINATION,
  GET_ALL_CHECKLIST_AND_PM_SUMMARY,
  GET_ALL_ENTITY_USAGE_HISTORY,
} from "../../api/queries";
import { errorMessage } from "../../helpers/gql";
import { useIsSmallDevice } from "../../helpers/useIsSmallDevice";
import { Entity } from "../../models/Entity/Entity";
import { motion } from "framer-motion";
import { DATETIME_FORMATS } from "../../helpers/constants";
import moment from "moment";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { SwapOutlined } from "@ant-design/icons";
import { MeasurementSelector } from "../../components/common/MeasurementSelector";
import { LocationSelector } from "../../components/Config/Location/LocationSelector";
import { TypeSelector } from "../../components/Config/Type/TypeSelector";
import { ZoneSelector } from "../../components/Config/Zone/ZoneSelector";
import EntityCard from "../../components/EntityComponents/EntityCard/EntityCard";
import { useLocalStorage } from "../../helpers/useLocalStorage";
import Search from "../../components/common/Search";
import { FaArrowAltCircleRight } from "react-icons/fa";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

const EntityUtilization = ({
  clone,
  active,
  onClick,
}: {
  clone?: boolean;
  active?: boolean;
  onClick?: () => void;
}) => {
  const getFilter = localStorage.getItem("dashboardUtilizationFilter");
  let getFilterObjects: any;
  if (getFilter) {
    getFilterObjects = JSON.parse(JSON.parse(getFilter));
  }
  const [timerId, setTimerId] = useState(null);
  const [showEntity, setShowEntity] = useState(false);
  const { id }: any = useParams();
  const [search, setSearch] = useState(getFilterObjects?.search);
  const [locationIds, setLocationIds] = useState<number[]>(
    getFilterObjects?.locationIds
  );
  const [zoneIds, setZoneIds] = useState<number[]>(getFilterObjects?.zoneIds);
  const [typeIds, setTypeIds] = useState<number[]>(getFilterObjects?.typeIds);
  const [measurement, setMeasurement] = useState<string[]>(
    getFilterObjects?.measurement
  );
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
      measurement: [],
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
    measurement: string[];
  }>({
    search: JSON.parse(saveFilterOptions)?.search,
    locationIds: JSON.parse(saveFilterOptions)?.locationIds,
    zoneIds: JSON.parse(saveFilterOptions)?.zoneIds,
    typeIds: JSON.parse(saveFilterOptions)?.typeIds,
    measurement: JSON.parse(saveFilterOptions)?.measurement,
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
        measurement,
      },
    });
    const newfilter = {
      ...filter,
      from: dates[0].toISOString(),
      to: dates[1].toISOString(),
    };
    setSaveFilterOptions(JSON.stringify(newfilter));
  }, [
    dates,
    allEntityUsageHistory,
    search,
    locationIds,
    zoneIds,
    typeIds,
    measurement,
  ]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    locationIdsValue: number[],
    zoneIdsValue: number[],
    typeIdsValue: number[],
    measurementValue: string[]
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
          measurement: measurementValue,
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
    searchDebounced(search, locationIds, zoneIds, typeIds, measurement);
    // eslint-disable-next-line
  }, [search, locationIds, zoneIds, typeIds, measurement]);

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

  let options: any;
  if (history?.allEntityUsageHistory) {
    options = {
      title: {
        text: `Utilization (${history?.allEntityUsageHistory.length})`,
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
          text: "Amount (hr)",
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
        filename: `Utilization (${
          history?.allEntityUsageHistory.length
        }) (${moment(dates[0]).format(
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

  const work = () => {
    onClick!();
    //running after 0.3 second so that graph width adjust
    setTimeout(function () {
      Highcharts.charts.forEach(function (chart) {
        chart?.reflow();
      });
    }, 300);
  };

  const dataSource: any = [];
  history?.allEntityUsageHistory.map((h: any, index: number) => {
    dataSource.push({
      key: index,
      machineNumber: h.machineNumber,
      workingHour: h.workingHour,
      idleHour: h.idleHour,
      breakdownHour: h.breakdownHour,
      na: h.na,
      total: h.total,
      description: (
        <div className={classes["description"]}>
          <div className={classes["title-wrapper"]}>
            <div className={classes["title"]}>Working</div>
            <div className={classes["working"]}>
              {((h.workingHour / h.total) * 100).toFixed(0)}%
            </div>
          </div>
          <div className={classes["title-wrapper"]}>
            <div className={classes["title"]}>Idle</div>
            <div className={classes["idle"]}>
              {((h.idleHour / h.total) * 100).toFixed(0)}%
            </div>
          </div>
          <div className={classes["title-wrapper"]}>
            <div className={classes["title"]}>Breakdown</div>
            <div className={classes["breakdown"]}>
              {((h.breakdownHour / h.total) * 100).toFixed(0)}%
            </div>
          </div>
          <div className={classes["title-wrapper"]}>
            <div className={classes["title"]}>Na</div>
            <div className={classes["na"]}>
              {((h.na / h.total) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      ),
      action: (
        <Link to={"/entity/" + h.id}>
          <Tooltip title="Open">
            <FaArrowAltCircleRight className={classes["button"]} />
          </Tooltip>
        </Link>
      ),
    });
  });

  const columns = [
    {
      title: `Machine Number`,
      dataIndex: "machineNumber",
      key: "machineNumber",
      className: classes["font"],
    },
    {
      title: "Working",
      dataIndex: "workingHour",
      key: "workingHour",
      className: (classes["font"], classes["working"]),
    },
    {
      title: "Idle",
      dataIndex: "idleHour",
      key: "idleHour",
      className: (classes["font"], classes["idle"]),
    },
    {
      title: "Breakdown",
      dataIndex: "breakdownHour",
      key: "breakdownHour",
      className: (classes["font"], classes["breakdown"]),
    },
    {
      title: "Na",
      dataIndex: "na",
      key: "na",
      className: (classes["font"], classes["na"]),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      className: (classes["font"], classes["total"]),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      className: classes["font"],
    },
  ];

  const isSmallDevice = useIsSmallDevice(1200, true);

  return (
    <>
      <motion.div
        className={classes["container"]}
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
        style={{
          width: active && isSmallDevice ? "48%" : "100%",
          marginTop: active && clone && !isSmallDevice ? "20px" : 0,
        }}
      >
        <div
          className={classes["btn-wrapper"]}
          style={{
            visibility: clone ? "hidden" : "visible",
          }}
        >
          <div
            className={classes["btn"]}
            style={{
              backgroundColor: active ? "var(--ant-primary-color)" : "initial",
              color: active ? "white" : "var(--compare-btn-color)",
              borderColor: active
                ? "var(--compare-btn-active-border)"
                : "var(--compare-btn-border)",
            }}
            onClick={work}
          >
            <SwapOutlined style={{ fontSize: 22 }} />
          </div>
        </div>
        <div className={classes["options-wrapper"]}>
          <DatePicker.RangePicker
            defaultValue={dates}
            format={DATETIME_FORMATS.DAY_MONTH_YEAR}
            className={classes["datepicker"]}
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
        <div className={classes["option"]}>
          <LocationSelector
            setLocationId={setLocationIds}
            currentId={locationIds}
            rounded
            multiple
            width={"100%"}
          />
        </div>
        <div className={classes["option"]}>
          <ZoneSelector
            setZoneId={setZoneIds}
            currentId={zoneIds}
            rounded
            multiple
            width={"100%"}
          />
        </div>
        <div className={classes["option"]}>
          <MeasurementSelector
            onChange={(measurement: string[]) => {
              setFilter({
                ...filter,
                measurement,
              });
              setMeasurement(measurement);
            }}
            value={measurement}
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
        <motion.div
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
          className={classes["checkbox-wrapper"]}
        >
          <Checkbox
            defaultChecked={showEntity}
            onChange={(e) => setShowEntity(e.target.checked)}
            style={{ fontSize: !isSmallDevice ? 9 : 14 }}
          >
            Show Entity
          </Checkbox>
        </motion.div>
        <motion.div
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
          id={"custTable"}
        >
          {historyLoading ? (
            <Spin
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              size={"large"}
            />
          ) : (
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ margin: 0 }}>{record?.description}</div>
                ),
                columnWidth: 1,
              }}
            />
          )}
        </motion.div>
        {loading && showEntity ? (
          <div>
            <Spin style={{ width: "100%", margin: "2rem auto" }} />
          </div>
        ) : typeWithCountSorted.size > 0 && showEntity ? (
          <div style={{ marginTop: 20 }}>
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
                          smallView
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
              marginTop: showEntity ? 50 : 0,
            }}
          >
            {showEntity && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default memo(EntityUtilization);
