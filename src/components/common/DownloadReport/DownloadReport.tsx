import { DocumentNode, useLazyQuery } from "@apollo/client";
import { Button, Tooltip } from "antd";
import React, { memo, useEffect, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import moment from "moment";
import { errorMessage } from "../../../helpers/gql";
import PeriodicMaintenance from "../../../models/PeriodicMaintenance/PeriodicMaintenance";
import { DATETIME_FORMATS } from "../../../helpers/constants";

export interface DownloadReportProps {
  query: DocumentNode;
  filter: {
    search: string;
    from: any;
    to: any;
  };
  name: string;
}

const DownloadReport: React.FC<DownloadReportProps> = ({
  query,
  filter,
  name,
}) => {
  const [loading, setLoading] = useState(false);
  const [getReport] = useLazyQuery(query, {
    onCompleted: (data) => {
      const rows: any = [];
      //@ts-ignore
      Object.values(data)[0].edges.forEach(
        (rec: { node: PeriodicMaintenance }) => {
          const pm = rec.node;
          const progressPercentage = Math.round(
            (pm?.tasks!.filter((task) => task.completedAt !== null).length /
              pm?.tasks!.length) *
              100
          );
          const flattenedTasks = pm?.tasks!.flatMap((task: any) =>
            task?.subTasks
              ? [
                  task,
                  ...task?.subTasks?.flatMap((st: any) =>
                    st.subTasks ? [st, ...st.subTasks] : st
                  ),
                ]
              : task
          );
          rows.push([
            pm.id,
            moment(pm.createdAt).format("YYYY-MM-DDTHH:mm:ss"),
            pm?.entityId,
            pm?.name,
            `"${pm?.value !== null ? pm?.value : "null"}"`,
            `"${pm?.measurement !== null ? pm?.measurement : "null"}"`,
            `"${
              pm?.currentMeterReading !== null
                ? pm?.currentMeterReading
                : "null"
            }"`,
            pm?.status,
            `"${
              pm.verifiedAt !== null
                ? moment(pm.verifiedAt).format("YYYY-MM-DDTHH:mm:ss")
                : "null"
            }"`,
            `"${
              pm.verifiedAt !== null
                ? `${pm?.verifiedBy?.fullName} (${pm?.verifiedBy?.rcno})`
                : "null"
            }"`,
            `"${flattenedTasks
              ?.map((task) => task?.name)
              .join(", ")
              .trim()}"`,
            `"${progressPercentage.toFixed(0)}%"`,
          ]);
        }
      );
      let csv =
        "ID,Created At,Entity ID,Name,Value,Measurement,Current Meter Reading,Status,VerifiedAt,Verified By,Tasks,Task Progress\n";
      rows.forEach((row: any, i: number) => {
        csv += row.join(",");
        if (i !== rows.length - 1) csv += "\n";
      });
      if (loading) {
        const anchor = document.createElement("a");
        anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
        anchor.target = "_blank";
        anchor.download = `CMMS_${name}_${moment(filter?.from).format(
          DATETIME_FORMATS.DAY_MONTH_YEAR
        )} - ${moment(filter?.to).format(DATETIME_FORMATS.DAY_MONTH_YEAR)}.csv`;
        anchor.click();
      }

      setLoading(false);
    },
    notifyOnNetworkStatusChange: true,
    onError: (err) => {
      errorMessage(err, "Error loading report");
      setLoading(false);
    },
  });

  return (
    <div>
      <Tooltip title="Download as CSV">
        <Button
          loading={loading}
          onClick={() => {
            if (loading) return;
            setLoading(true);
            getReport({ variables: filter });
          }}
        >
          <DownloadOutlined />
        </Button>
      </Tooltip>
    </div>
  );
};

export default memo(DownloadReport);
