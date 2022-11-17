import { DatePicker, Empty, Spin, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import classes from "./GroupedTypeRepairStats.module.css";
import { useLazyQuery } from "@apollo/client";
import { motion } from "framer-motion";
import moment from "moment";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { GET_ALL_GROUPED_TYPE_REPAIR_STATS } from "../../../../api/queries";
import { DATETIME_FORMATS } from "../../../../helpers/constants";
import { errorMessage } from "../../../../helpers/gql";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import { useLocalStorage } from "../../../../helpers/useLocalStorage";
import { EntityTypeSelector } from "../../../common/EntityTypeSelector";
import { MeasurementSelector } from "../../../common/MeasurementSelector";
import { DivisionSelector } from "../../../Config/Division/DivisionSelector";
import { LocationSelector } from "../../../Config/Location/LocationSelector";
import { TypeSelector } from "../../../Config/Type/TypeSelector";
import { ZoneSelector } from "../../../Config/Zone/ZoneSelector";
import Search from "../../../common/Search";

require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

const GroupedTypeRepairStats = ({
  clone,
  active,
  onClick,
}: {
  clone?: boolean;
  active?: boolean;
  onClick?: () => void;
}) => {
  const getFilter = localStorage.getItem(`groupedTypeRepairStatsFilter`);
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
  const [divisionIds, setDivisionIds] = useState<number[]>(
    getFilterObjects?.divisionIds
  );
  const [measurement, setMeasurement] = useState<string[]>(
    getFilterObjects?.measurement
  );
  const [entityType, setEntityType] = useState<string[]>(
    getFilterObjects?.entityType
  );
  const [dates, setDates] = useState<any>([
    moment(getFilterObjects?.from),
    moment(getFilterObjects?.to),
  ]);
  const [saveFilterOptions, setSaveFilterOptions] = useLocalStorage(
    `groupedTypeRepairStatsFilter`,
    JSON.stringify({
      search: "",
      divisionIds: [],
      zoneIds: [],
      locationIds: [],
      typeIds: [],
      measurement: [],
      entityType: [],
      from: moment().subtract(1, "day"),
      to: moment(),
    })
  );

  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<{
    search: string;
    divisionIds: number[];
    locationIds: number[];
    zoneIds: number[];
    typeIds: number[];
    measurement: string[];
    entityType: string[];
  }>({
    search: JSON.parse(saveFilterOptions)?.search,
    divisionIds: JSON.parse(saveFilterOptions)?.divisionIds,
    locationIds: JSON.parse(saveFilterOptions)?.locationIds,
    zoneIds: JSON.parse(saveFilterOptions)?.zoneIds,
    typeIds: JSON.parse(saveFilterOptions)?.typeIds,
    measurement: JSON.parse(saveFilterOptions)?.measurement,
    entityType: JSON.parse(saveFilterOptions)?.entityType,
  });

  const [
    getAllGroupedTypeRepairStats,
    { data: history, loading: historyLoading },
  ] = useLazyQuery(GET_ALL_GROUPED_TYPE_REPAIR_STATS, {
    onError: (err) => {
      errorMessage(err, "Error loading repair statistics.");
    },
  });

  useEffect(() => {
    getAllGroupedTypeRepairStats({
      variables: {
        machineId: parseInt(id),
        from: dates[0].toISOString(),
        to: dates[1].toISOString(),
        search,
        divisionIds,
        locationIds,
        zoneIds,
        typeIds,
        measurement,
        entityType,
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
    getAllGroupedTypeRepairStats,
    search,
    divisionIds,
    locationIds,
    zoneIds,
    typeIds,
    measurement,
    entityType,
  ]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    divisionIdsValue: number[],
    locationIdsValue: number[],
    zoneIdsValue: number[],
    typeIdsValue: number[],
    measurementValue: string[],
    entityTypeValue: string[]
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          divisionIds: divisionIdsValue,
          locationIds: locationIdsValue,
          zoneIds: zoneIdsValue,
          typeIds: typeIdsValue,
          measurement: measurementValue,
          entityType: entityTypeValue,
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
      divisionIds,
      locationIds,
      zoneIds,
      typeIds,
      measurement,
      entityType
    );
    // eslint-disable-next-line
  }, [
    search,
    divisionIds,
    locationIds,
    zoneIds,
    typeIds,
    measurement,
    entityType,
  ]);

  useEffect(() => {
    const newfilter = {
      ...filter,
      from: dates[0].toISOString(),
      to: dates[1].toISOString(),
    };
    setSaveFilterOptions(JSON.stringify(newfilter));
  }, [filter]);

  let options: any;
  if (history?.getAllGroupedTypeRepairStats) {
    options = {
      title: {
        text: `Repair Statistics (${history?.getAllGroupedTypeRepairStats.length})`,
      },
      subtitle: {
        text: `${moment(dates[0]).format(
          DATETIME_FORMATS.DAY_MONTH_YEAR
        )} - ${moment(dates[1]).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}`,
      },
      chart: {
        type: "bar",
        height:
          history?.getAllGroupedTypeRepairStats.length * 43 < 600
            ? 600
            : history?.getAllGroupedTypeRepairStats.length * 43,
      },
      plotOptions: {
        series: {
          stacking: "normal",
        },
      },
      xAxis: {
        categories: history?.getAllGroupedTypeRepairStats.map(
          (rec: any) => `${rec?.name} (${rec?.count})`
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
        filename: `Repair Statistics (${
          history?.getAllGroupedTypeRepairStats.length
        }) (${moment(dates[0]).format(
          DATETIME_FORMATS.DAY_MONTH_YEAR
        )} - ${moment(dates[1]).format(DATETIME_FORMATS.DAY_MONTH_YEAR)})`,
        csv: {
          columnHeaderFormatter: function (item: any, key: any) {
            if (!item || item instanceof Highcharts.Axis) {
              return "Type";
            } else {
              return item.name;
            }
          },
        },
      },
      legend: {
        reversed: true,
      },
      colors: ["rgba(235, 64, 52)", "rgba(8, 151, 156)"],
      series: [
        {
          name: "Mean",
          data: history?.getAllGroupedTypeRepairStats.map((rec: any) =>
            parseInt(rec?.mean)
          ),
        },
        {
          name: "Average",
          data: history?.getAllGroupedTypeRepairStats.map((rec: any) =>
            parseInt(rec?.averageTimeOfRepair)
          ),
        },
      ],
    };
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

  const isSmallDevice = useIsSmallDevice(1200, true);

  const dataSource: any = [];
  history?.getAllGroupedTypeRepairStats.map((h: any, index: number) => {
    dataSource.push({
      key: index,
      name: `${h.name} (${h.count})`,
      averageTimeOfRepair: h.averageTimeOfRepair,
      mean: h.mean,
      total: h.total,
      description: (
        <div className={classes["description"]}>
          <div className={classes["title-wrapper"]}>
            <div className={classes["title"]}>Average time of repair</div>
            <div className={classes["working"]}>
              {((h.averageTimeOfRepair / h.total) * 100).toFixed(0)}%
            </div>
          </div>
          <div className={classes["title-wrapper"]}>
            <div className={classes["title"]}>Mean</div>
            <div className={classes["breakdown"]}>
              {((h.mean / h.total) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      ),
    });
  });

  const columns = [
    {
      title: "Type",
      dataIndex: "name",
      key: "name",
      className: classes["font"],
    },
    {
      title: "Average time for repair (hr)",
      dataIndex: "averageTimeOfRepair",
      key: "averageTimeOfRepair",
      className: (classes["font"], classes["working"]),
    },
    {
      title: "Mean distance between repair",
      dataIndex: "mean",
      key: "mean",
      className: (classes["font"], classes["breakdown"]),
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
          width: "100%",
          marginTop: "20px",
        }}
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
            paddingBottom: 10,
          }}
        >
          <EntityTypeSelector
            onChange={(entityType: string[]) => {
              setFilter({
                ...filter,
                entityType,
              });
              setEntityType(entityType);
            }}
            value={entityType}
            rounded
            multiple
            width={"100%"}
          />
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
          <DivisionSelector
            setDivisionId={setDivisionIds}
            currentId={divisionIds}
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
            {history?.getAllGroupedTypeRepairStats.length > 0 ? (
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

export default GroupedTypeRepairStats;
