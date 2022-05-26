import { Button, DatePicker, Form, message, Spin } from "antd";
import { useState } from "react";
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
  const [toDate, setToDate] = useState<any>();
  const [fromDate, setFromDate] = useState<any>();
  const [form] = useForm();
  const [getTransportationReport, { data, loading }] = useLazyQuery(
    GET_TRANSPORTATION_REPORT,
    {
      onCompleted: () => {
        message.success("Successfully retrieved report.");
      },
      onError: (err) => {
        errorMessage(err, "Error loading report.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setFromDate("");
    setToDate("");
  };

  const onFinish = async (values: any) => {
    const { fromDate, toDate } = values;

    if (!fromDate) {
      message.error("Please enter the 'to' date.");
      return;
    }
    if (!toDate) {
      message.error("Please enter the 'from' date.");
      return;
    }

    if (fromDate > toDate) {
      message.error("Please pick a date less than 'to' date.");
      return;
    }
    setFromDate(fromDate);
    setToDate(toDate);

    getTransportationReport({
      variables: {
        from: fromDate,
        to: toDate,
      },
    });
  };

  const isSmallDevice = useIsSmallDevice();

  return (
    <div className={classes["container"]}>
      <div className={classes["options-wrapper"]}>
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
          style={{ width: "100%" }}
        >
          <div className={classes["row"]}>
            <div className={classes["first-block"]}>
              <Form.Item label="From" name="fromDate" required={false}>
                <DatePicker
                  placeholder="Select from date"
                  style={{
                    width: 200,
                    marginRight: "1rem",
                  }}
                  allowClear={false}
                />
              </Form.Item>
              <Form.Item label="To" name="toDate" required={false}>
                <DatePicker
                  placeholder="Select to date"
                  style={{
                    width: 200,
                    marginRight: "1rem",
                  }}
                  allowClear={false}
                />
              </Form.Item>
            </div>

            <div className={classes["second-block"]}>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="ghost"
                  className={classes["custom-btn-secondary"]}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className={classes["custom-btn-primary"]}
                >
                  View
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      {fromDate || toDate ? (
        <div className={classes["heading"]}>
          Transportation summary between{" "}
          {moment(fromDate).format(DATETIME_FORMATS.DAY_MONTH_YEAR)} to{" "}
          {moment(toDate).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
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
          {toDate && (
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
  );
};

export default ViewTransportationReport;
