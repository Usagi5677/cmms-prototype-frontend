import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import moment from "moment";
import { GET_USAGE_HISTORY_OF_ENTITY } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { DatePicker, Spin } from "antd";
import { useParams } from "react-router";
import classes from "./EntityUsageHistory.module.css";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Entity } from "../../../models/Entity/Entity";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

const EntityUsageHistory = ({ entity }: { entity?: Entity }) => {
  const { id }: any = useParams();
  const [dates, setDates] = useState<any>([
    moment().subtract(1, "day"),
    moment(),
  ]);
  const [singleEntityUsageHistory, { data: history, loading }] = useLazyQuery(
    GET_USAGE_HISTORY_OF_ENTITY,
    {
      onError: (err) => {
        errorMessage(err, "Error loading usage history.");
      },
    }
  );
//test
  useEffect(() => {
    singleEntityUsageHistory({
      variables: {
        entityId: parseInt(id),
        from: dates[0].toISOString(),
        to: dates[1].toISOString(),
      },
    });
  }, [dates, singleEntityUsageHistory]);

  let options: any;
  if (history?.singleEntityUsageHistory) {
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
          history?.singleEntityUsageHistory.length * 43 < 600
            ? 600
            : history?.singleEntityUsageHistory.length * 43,
      },
      plotOptions: {
        series: {
          stacking: "normal",
        },
      },
      xAxis: {
        categories: history?.singleEntityUsageHistory.map((rec: any) =>
          moment(rec?.date).format(DATETIME_FORMATS.DAY_MONTH)
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
        filename: `Utilization of ${
          entity?.machineNumber ? entity?.machineNumber : `Entity (${id})`
        } (${moment(dates[0]).format(
          DATETIME_FORMATS.DAY_MONTH_YEAR
        )} - ${moment(dates[1]).format(DATETIME_FORMATS.DAY_MONTH_YEAR)})`,
        csv: {
          columnHeaderFormatter: function (item: any, key: any) {
            if (!item || item instanceof Highcharts.Axis) {
              return "Date";
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
          data: history?.singleEntityUsageHistory.map((rec: any) =>
            parseInt(rec?.na?.toFixed(0))
          ),
        },
        {
          name: "Breakdown",
          data: history?.singleEntityUsageHistory.map((rec: any) =>
            parseInt(rec?.breakdownHour?.toFixed(0))
          ),
        },
        {
          name: "Idle",
          data: history?.singleEntityUsageHistory.map((rec: any) =>
            parseInt(rec?.idleHour?.toFixed(0))
          ),
        },
        {
          name: "Working",
          data: history?.singleEntityUsageHistory.map((rec: any) =>
            parseInt(rec?.workingHour?.toFixed(0))
          ),
        },
      ],
    };
  }

  return (
    <div className={classes["container"]}>
      <div className={classes["datepicker"]}>
        <DatePicker.RangePicker
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
      {loading ? (
        <div className={classes["loading"]}>
          <Spin size="large" />
        </div>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
};

export default EntityUsageHistory;
