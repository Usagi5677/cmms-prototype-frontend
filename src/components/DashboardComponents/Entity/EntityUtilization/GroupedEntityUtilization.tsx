import { DatePicker, Empty, Spin, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import classes from "./EntityUtilization.module.css";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_GROUPED_ENTITY_USAGE } from "../../../../api/queries";
import { errorMessage } from "../../../../helpers/gql";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import Search from "../../../common/Search";
import { motion } from "framer-motion";
import { LocationSelector } from "../../../Config/Location/LocationSelector";
import { DATETIME_FORMATS } from "../../../../helpers/constants";
import moment from "moment";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { TypeSelector } from "../../../Config/Type/TypeSelector";
import { ZoneSelector } from "../../../Config/Zone/ZoneSelector";
import { useLocalStorage } from "../../../../helpers/useLocalStorage";
import { MeasurementSelector } from "../../../common/MeasurementSelector";
import { SwapOutlined } from "@ant-design/icons";
import { EntityType } from "../../../../models/Enums";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

const GroupedEntityUtilization = ({
  clone,
  active,
  onClick,
  entityType,
}: {
  clone?: boolean;
  active?: boolean;
  onClick?: () => void;
  entityType?: string;
}) => {
  const getFilter = localStorage.getItem(
    `dashboard${entityType}GroupedUtilizationFilter`
  );
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
  const [measurement, setMeasurement] = useState<string[]>(
    getFilterObjects?.measurement
  );
  const [entityTypes, setEntityTypes] = useState<string[]>([entityType!]);
  const [dates, setDates] = useState<any>([
    moment(getFilterObjects?.from),
    moment(getFilterObjects?.to),
  ]);
  const [saveFilterOptions, setSaveFilterOptions] = useLocalStorage(
    `dashboard${entityType}GroupedUtilizationFilter`,
    JSON.stringify({
      search: "",
      zoneIds: [],
      locationIds: [],
      typeIds: [],
      measurement: [],
      entityTypes: [],
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
    entityTypes: string[];
  }>({
    search: JSON.parse(saveFilterOptions)?.search,
    locationIds: JSON.parse(saveFilterOptions)?.locationIds,
    zoneIds: JSON.parse(saveFilterOptions)?.zoneIds,
    typeIds: JSON.parse(saveFilterOptions)?.typeIds,
    measurement: JSON.parse(saveFilterOptions)?.measurement,
    entityTypes: [entityType!],
  });

  const [getAllGroupedEntityUsage, { data: history, loading: historyLoading }] =
    useLazyQuery(GET_ALL_GROUPED_ENTITY_USAGE, {
      onError: (err) => {
        errorMessage(err, "Error loading usage history.");
      },
    });

  useEffect(() => {
    getAllGroupedEntityUsage({
      variables: {
        machineId: parseInt(id),
        from: dates[0].toISOString(),
        to: dates[1].toISOString(),
        search,
        locationIds,
        zoneIds,
        typeIds,
        measurement,
        entityTypes,
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
    getAllGroupedEntityUsage,
    search,
    locationIds,
    zoneIds,
    typeIds,
    measurement,
    entityTypes,
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
    measurementValue: string[],
    entityTypesValue: string[]
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
          entityTypes: entityTypesValue,
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
    searchDebounced(
      search,
      locationIds,
      zoneIds,
      typeIds,
      measurement,
      entityTypes
    );
    // eslint-disable-next-line
  }, [search, locationIds, zoneIds, typeIds, measurement, entityTypes]);

  useEffect(() => {
    const newfilter = {
      ...filter,
      from: dates[0].toISOString(),
      to: dates[1].toISOString(),
    };
    setSaveFilterOptions(JSON.stringify(newfilter));
  }, [filter]);

  let options: any;
  if (history?.getAllGroupedEntityUsage) {
    options = {
      title: {
        text: `${entityType} Utilization (${history?.getAllGroupedEntityUsage.length})`,
      },
      subtitle: {
        text: `${moment(dates[0]).format(
          DATETIME_FORMATS.DAY_MONTH_YEAR
        )} - ${moment(dates[1]).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}`,
      },
      chart: {
        type: "bar",
        height:
          history?.getAllGroupedEntityUsage.length * 43 < 600
            ? 600
            : history?.getAllGroupedEntityUsage.length * 43,
      },
      plotOptions: {
        series: {
          stacking: "normal",
        },
      },
      xAxis: {
        categories: history?.getAllGroupedEntityUsage.map(
          (rec: any) => `${rec?.name} (${rec?.count})`
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
        filename: `${entityType} Utilization (${
          history?.getAllGroupedEntityUsage.length
        }) (${moment(dates[0]).format(
          DATETIME_FORMATS.DAY_MONTH_YEAR
        )} - ${moment(dates[1]).format(DATETIME_FORMATS.DAY_MONTH_YEAR)})`,
        csv: {
          columnHeaderFormatter: function (item: any, key: any) {
            if (!item || item instanceof Highcharts.Axis) {
              return entityType;
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
          data: history?.getAllGroupedEntityUsage.map((rec: any) =>
            parseInt(rec?.na?.toFixed(0))
          ),
        },
        {
          name: "Breakdown",
          data: history?.getAllGroupedEntityUsage.map((rec: any) =>
            parseInt(rec?.breakdownHour?.toFixed(0))
          ),
        },
        {
          name: "Idle",
          data: history?.getAllGroupedEntityUsage.map((rec: any) =>
            parseInt(rec?.idleHour?.toFixed(0))
          ),
        },
        {
          name: "Working",
          data: history?.getAllGroupedEntityUsage.map((rec: any) =>
            parseInt(rec?.workingHour?.toFixed(0))
          ),
        },
      ],
    };
  }
  /*
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
  */
  const work = () => {
    onClick!();
    //running after 0.3 second so that graph width adjust
    setTimeout(function () {
      Highcharts.charts.forEach(function (chart) {
        chart?.reflow();
      });
    }, 300);
  };

  const isSmallDevice = useIsSmallDevice(1200, true);

  const dataSource: any = [];
  history?.getAllGroupedEntityUsage.map((h: any, index: number) => {
    dataSource.push({
      key: index,
      name: `${h.name} (${h.total})`,
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
    });
  });

  const columns = [
    {
      title: `${entityType}`,
      dataIndex: "name",
      key: "name",
      className: classes["font"],
      width: '40%',
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
  ];

  return (
    <>
      <motion.div
        className={classes["container"]}
        initial={{
          x: entityType === "Vehicle" || entityType === "Machine" ? -60 : 60,
          opacity: 0,
        }}
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
          width: entityType !== "Machine" && isSmallDevice ? "48%" : "100%",
          marginTop: "20px",
          marginLeft: entityType === "Machine" && isSmallDevice ? 10 : 0,
          marginRight: entityType === "Machine" && isSmallDevice ? 10 : 0
        }}
      >
        {/* hiding this btn */}
        {!entityType && (
          <div
            className={classes["btn-wrapper"]}
            style={{
              visibility: clone ? "hidden" : "visible",
            }}
          >
            <div
              className={classes["btn"]}
              style={{
                backgroundColor: active
                  ? "var(--ant-primary-color)"
                  : "initial",
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
        )}

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
            entityType={entityType! as EntityType}
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
            {history?.getAllGroupedEntityUsage.length > 0 ? (
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
      </motion.div>
    </>
  );
};

export default GroupedEntityUtilization;
