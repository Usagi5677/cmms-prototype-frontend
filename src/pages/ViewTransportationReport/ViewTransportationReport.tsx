import { Button, DatePicker, Form, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { errorMessage } from "../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import { GET_TRANSPORTATION_REPORT } from "../../api/queries";
import { DATETIME_FORMATS } from "../../helpers/constants";
import classes from "./ViewTransportationReport.module.css";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { useIsSmallDevice } from "../../helpers/useIsSmallDevice";
import TransportationReport from "../../models/Transportation/TransportationReport";
import TransportationReportCard from "../../components/TransportationComponents/TransportationReportCard/TransportationReportCard";

const ViewTransportationReport = () => {
  const [dates, setDates] = useState<any>([
    moment().subtract(1, "month"),
    moment(),
  ]);
  const [getTransportationReport, { data, loading }] = useLazyQuery(
    GET_TRANSPORTATION_REPORT,
    {
      onError: (err) => {
        errorMessage(err, "Error loading report.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    getTransportationReport({
      variables: {
        from: dates[0].toISOString(),
        to: dates[1].toISOString(),
      },
    });
  }, [dates, getTransportationReport]);

  const isSmallDevice = useIsSmallDevice();

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
          {dates[0] || dates[1] ? (
            <div className={classes["heading"]}>
              Transportation summary between{" "}
              {moment(dates[0]).format(DATETIME_FORMATS.DAY_MONTH_YEAR)} to{" "}
              {moment(dates[1]).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
            </div>
          ) : null}
          {isSmallDevice ? (
            <div>
              {data?.getTransportationReport.map(
                (report: TransportationReport, index: number) => {
                  return (
                    <TransportationReportCard
                      key={index}
                      report={report}
                      index={index}
                    />
                  );
                }
              )}
            </div>
          ) : (
            <div className={classes["table-row"]}>
              {dates[1] && (
                <table className={classes["table"]}>
                  <tbody>
                    <tr>
                      <th>No</th>
                      <th>Type</th>
                      <th>Total</th>
                      <th>Working</th>
                      <th>Breakdown</th>
                      <th>Working %</th>
                    </tr>
                    {data?.getTransportationReport.map(
                      (report: TransportationReport, index: number) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{report.type}</td>
                            <td>{report.working + report.breakdown}</td>
                            <td>{report.working}</td>
                            <td>{report.breakdown}</td>
                            <td>
                              {(report.working /
                                (report.working + report.breakdown)) *
                                100}
                              %
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewTransportationReport;