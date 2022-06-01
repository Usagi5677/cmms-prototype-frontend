import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import moment from "moment";
import { GET_USAGE_HISTORY_OF_MACHINE } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { DatePicker, Spin } from "antd";
import { Chart, registerables } from "chart.js";
import { useParams } from "react-router";
import classes from "./MachineUsageHistory.module.css";

Chart.register(...registerables);

const MachineUsageHistory = () => {
  const { id }: any = useParams();
  const [dates, setDates] = useState<any>([
    moment().subtract(1, "week"),
    moment(),
  ]);
  const [singleMachineUsageHistory, { data: history, loading }] = useLazyQuery(
    GET_USAGE_HISTORY_OF_MACHINE,
    {
      onError: (err) => {
        errorMessage(err, "Error loading usage history.");
      },
    }
  );

  useEffect(() => {
    singleMachineUsageHistory({
      variables: {
        machineId: parseInt(id),
        from: dates[0].toISOString(),
        to: dates[1].toISOString(),
      },
    });
  }, [dates, singleMachineUsageHistory]);

  const labelData = [
    "Current running hrs",
    "Last service hrs",
    "Inter service hrs",
  ];

  let data = () => {
    let labels = history?.singleMachineUsageHistory.map((rec: any) =>
      moment(rec.date).format(DATETIME_FORMATS.DAY_MONTH)
    );
    let datasets = labelData.map((label) => {
      return {
        label,
        borderWidth: 1,
        data: history?.singleMachineUsageHistory.map((rec: any) => {
          if ("Current running hrs" === label) {
            return rec.currentRunningHrs;
          } else if ("Last service hrs" === label) {
            return rec.lastServiceHrs;
          } else if ("Inter service hrs" === label) {
            return rec.interServiceHrs;
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
      <div
        className={classes["datepicker"]}
      >
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
          <Bar
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

export default MachineUsageHistory;
