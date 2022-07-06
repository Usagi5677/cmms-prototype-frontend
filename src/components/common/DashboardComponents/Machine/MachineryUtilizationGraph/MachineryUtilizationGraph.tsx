import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import moment from "moment";
import { DatePicker, Spin } from "antd";
import { Chart, registerables } from "chart.js";
import { useParams } from "react-router";
import classes from "./MachineryUtilizationGraph.module.css";
import { GET_ALL_MACHINE_USAGE_HISTORY } from "../../../../../api/queries";
import { errorMessage } from "../../../../../helpers/gql";
import { DATETIME_FORMATS } from "../../../../../helpers/constants";
import { usageColors } from "../../../../../helpers/style";

Chart.register(...registerables);

const MachineryUtilizationGraph = () => {
  const { id }: any = useParams();
  const [dates, setDates] = useState<any>([
    moment().subtract(1, "day"),
    moment(),
  ]);
  const [allMachineUsageHistory, { data: history, loading }] = useLazyQuery(
    GET_ALL_MACHINE_USAGE_HISTORY,
    {
      onError: (err) => {
        errorMessage(err, "Error loading usage history.");
      },
    }
  );

  useEffect(() => {
    allMachineUsageHistory({
      variables: {
        machineId: parseInt(id),
        from: dates[0].toISOString(),
        to: dates[1].toISOString(),
      },
    });
  }, [dates, allMachineUsageHistory]);

  const labelData = [
    "Working hour",
    "Idle hour",
    "Breakdown hour",
    "Total hour",
    "Working percentage",
    "Idle percentage",
    "Breakdown percentage",
  ];

  let data = () => {
    let labels = history?.allMachineUsageHistory.map((rec: any) =>
      moment(rec.date).format(DATETIME_FORMATS.DAY_MONTH)
    );
    let datasets = labelData.map((label) => {
      const [color, bgColor] = usageColors(label);
      return {
        label,
        backgroundColor: bgColor,
        borderColor: color,
        borderWidth: 1,
        data: history?.allMachineUsageHistory.map((rec: any) => {
          if ("Working hour" === label) {
            return rec?.workingHour ? rec?.workingHour.toFixed(2) : 0;
          } else if ("Idle hour" === label) {
            return rec?.idleHour ? rec?.idleHour.toFixed(2) : 0;
          } else if ("Breakdown hour" === label) {
            return rec?.breakdownHour ? rec?.breakdownHour.toFixed(2) : 0;
          } else if ("Total hour" === label) {
            return rec?.totalHour ? rec?.totalHour.toFixed(2) : 0;
          } else if ("Working percentage" === label) {
            return rec?.workingPercentage
              ? rec?.workingPercentage.toFixed(2)
              : 0;
          } else if ("Idle percentage" === label) {
            return rec?.idlePercentage ? rec?.idlePercentage.toFixed(2) : 0;
          } else if ("Breakdown percentage" === label) {
            return rec?.breakdownPercentage
              ? rec?.breakdownPercentage.toFixed(2)
              : 0;
          }
        }),
      };
    });
    return {
      labels,
      datasets,
    };
  };

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
        <div>
          <Line
            data={data()}
            height={400}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MachineryUtilizationGraph;
