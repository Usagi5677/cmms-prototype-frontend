import { Button, DatePicker, Form, message, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import { errorMessage } from "../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import { GET_MACHINE_REPORT } from "../../api/queries";
import { DATETIME_FORMATS } from "../../helpers/constants";
import classes from "./ViewMachineReport.module.css";
import MachineReport from "../../models/Machine/MachineReport";
import { useForm } from "antd/lib/form/Form";
import MachineReportCard from "../../components/MachineComponents/MachineReportCard/MachineReportCard";
import moment from "moment";
import { useIsSmallDevice } from "../../helpers/useIsSmallDevice";
import UserContext from "../../contexts/UserContext";
import { useNavigate } from "react-router";

const ViewMachineReport = () => {
  const { user: self } = useContext(UserContext);
  const navigate = useNavigate();
  const [dates, setDates] = useState<any>([
    moment().subtract(1, "month"),
    moment(),
  ]);
  const [form] = useForm();
  const [getMachineReport, { data, loading }] = useLazyQuery(
    GET_MACHINE_REPORT,
    {
      onError: (err) => {
        errorMessage(err, "Error loading report.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    if (!self.assignedPermission.hasViewMachineryReport) {
      navigate("/");
      message.error("No permission to view machinery report.");
    }
    getMachineReport({
      variables: {
        from: dates[0].toISOString(),
        to: dates[1].toISOString(),
      },
    });
  }, [dates, getMachineReport]);

  const isSmallDevice = useIsSmallDevice();

  return (
    <div className={classes["container"]}>
      <div className={classes["datepicker"]}>
        {self.assignedPermission.hasViewMachineryReport ? (
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
        ) : null}
      </div>
      {loading ? (
        <div className={classes["loading"]}>
          <Spin size="large" />
        </div>
      ) : (
        <div>
          {dates[0] || dates[1] ? (
            <div className={classes["heading"]}>
              Machinery summary between{" "}
              {moment(dates[0]).format(DATETIME_FORMATS.DAY_MONTH_YEAR)} to{" "}
              {moment(dates[1]).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
            </div>
          ) : null}
          {isSmallDevice ? (
            <div>
              {data?.getMachineReport.map(
                (report: MachineReport, index: number) => {
                  return (
                    <MachineReportCard
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
                    {data?.getMachineReport.map(
                      (report: MachineReport, index: number) => {
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

export default ViewMachineReport;
/*

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
          Machinery summary between{" "}
          {moment(fromDate).format(DATETIME_FORMATS.DAY_MONTH_YEAR)} to{" "}
          {moment(toDate).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}
        </div>
      ) : null}
      {isSmallDevice ? (
        <div>
          {data?.getMachineReport.map(
            (report: MachineReport, index: number) => {
              return (
                <MachineReportCard key={index} report={report} index={index} />
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
                {data?.getMachineReport.map(
                  (report: MachineReport, index: number) => {
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
<div className={classes["table-row"]}>
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
            {data?.getMachineReport.map(
              (report: MachineReport, index: number) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{report.type}</td>
                    <td>{report.working + report.breakdown}</td>
                    <td>{report.working}</td>
                    <td>{report.breakdown}</td>
                    <td>
                      {( report.working / (report.working + report.breakdown)) *
                        100}%
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
*/
