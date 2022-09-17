import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import { GET_USAGE_HISTORY_OF_ENTITY } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { DatePicker, Spin } from "antd";
import { Chart, registerables } from "chart.js";
import { useParams } from "react-router";
import classes from "./EntityUsageHistory.module.css";
import { usageColors } from "../../../helpers/style";

Chart.register(...registerables);

const EntityUsageHistory = () => {
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

  useEffect(() => {
    singleEntityUsageHistory({
      variables: {
        entityId: parseInt(id),
        from: dates[0].toISOString(),
        to: dates[1].toISOString(),
      },
    });
  }, [dates, singleEntityUsageHistory]);

  const labelData = ["Working hour", "Idle hour", "Breakdown hour"];

  let data = () => {
    let labels = history?.singleEntityUsageHistory.map((rec: any) =>
      moment(rec.date).format(DATETIME_FORMATS.DAY_MONTH)
    );
    let datasets = labelData.map((label) => {
      const [color, bgColor] = usageColors(label);
      return {
        label,
        backgroundColor: bgColor,
        borderColor: color,
        borderWidth: 1,
        data: history?.singleEntityUsageHistory.map((rec: any) => {
          if ("Working hour" === label) {
            return rec.workingHour;
          } else if ("Idle hour" === label) {
            return rec.idleHour;
          } else if ("Breakdown hour" === label) {
            return rec.breakdownHour;
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
                  max: 24,
                  min: 0,
                  suggestedMax: 24,
                  ticks: {
                    stepSize: 4,
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EntityUsageHistory;
