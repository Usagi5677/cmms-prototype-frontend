import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Badge, Button, DatePicker, Empty } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  INCOMPLETE_CHECKLISTS,
  INCOMPLETE_CHECKLIST_SUMMARY,
} from "../../api/queries";
import { generateSummary } from "../../helpers/checklist";
import { DATETIME_FORMATS } from "../../helpers/constants";
import { errorMessage } from "../../helpers/gql";
import Checklist from "../../models/Checklist";
import { Entity } from "../../models/Entity/Entity";
import IncompleteChecklistSummary from "../../models/IncompleteChecklistSummary";
import { ChecklistStatus } from "../Checklists/ChecklistStatus";
import { CenteredSpin } from "../common/CenteredSpin";
import { EntityListing } from "../EntityComponents/EntityListing";

export interface IncompleteChecklistProps {
  type: string;
}

export const IncompleteChecklist: React.FC<IncompleteChecklistProps> = ({
  type,
}) => {
  const [date, setDate] = useState(moment());
  const [month, setMonth] = useState([
    date.clone().startOf("month"),
    date.clone().endOf("month"),
  ]);

  const [getIncompleteChecklists, { data, loading, refetch }] = useLazyQuery(
    INCOMPLETE_CHECKLISTS,
    {
      onError: (err) => {
        errorMessage(err, "Error loading checklist.");
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [getSummary, { data: monthSummary }] = useLazyQuery(
    INCOMPLETE_CHECKLIST_SUMMARY
  );

  useEffect(() => {
    getIncompleteChecklists({
      variables: {
        input: {
          type,
          date,
        },
      },
    });
    if (!month[0].isSame(date, "month")) {
      setMonth([date.clone().startOf("month"), date.clone().endOf("month")]);
    }
  }, [date]);

  useEffect(() => {
    getSummary({
      variables: {
        input: {
          type,
          from: month[0],
          to: month[1],
        },
      },
    });
  }, [month]);

  const changeDate = (direction: "forward" | "back") => {
    if (direction === "forward") {
      if (type === "Daily") setDate(date.clone().add(1, "day"));
      else setDate(date.clone().add(1, "week"));
    } else {
      if (type === "Daily") setDate(date.clone().subtract(1, "day"));
      else setDate(date.clone().subtract(1, "week"));
    }
  };

  const changeDateButton = (direction: "forward" | "back") => (
    <Button
      onClick={() => changeDate(direction)}
      // disabled={loading}
      style={
        direction === "forward"
          ? { marginLeft: ".5rem" }
          : { marginRight: ".5rem" }
      }
    >
      {direction === "forward" ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
    </Button>
  );

  const summaryMatch = (current: moment.Moment) => {
    if (!monthSummary) return null;
    const match: IncompleteChecklistSummary =
      monthSummary.incompleteChecklistSummary.find(
        (cs: IncompleteChecklistSummary) => {
          if (type === "Daily") {
            return current
              .clone()
              .startOf("day")
              .isSame(moment(cs.date), "day");
          } else {
            return current
              .clone()
              .startOf("week")
              .isSame(moment(cs.date), "week");
          }
        }
      );
    if (!match) return null;
    return match.count;
  };

  return (
    <div style={{ width: "100%" }}>
      <div id="noZIndexBadge">
        <Badge count={data?.incompleteChecklists.length}>
          <div style={{ paddingRight: ".6rem" }}>{type}</div>
        </Badge>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {changeDateButton("back")}
        <DatePicker
          style={{ width: "100%" }}
          value={date}
          onChange={(val) => {
            if (val) setDate(val);
          }}
          format={
            type === "Weekly"
              ? (value) =>
                  `${moment(value)
                    .startOf("week")
                    .format(DATETIME_FORMATS.DAY_MONTH_YEAR)} - ${moment(value)
                    .endOf("week")
                    .format(DATETIME_FORMATS.DAY_MONTH_YEAR)}`
              : DATETIME_FORMATS.DAY_MONTH_YEAR
          }
          allowClear={false}
          picker={type === "Weekly" ? "week" : undefined}
          dateRender={(current) => (
            <div>
              <Badge count={summaryMatch(current)} size="small">
                <div className="ant-picker-cell-inner">{current.date()}</div>
              </Badge>
            </div>
          )}
        />
        {changeDateButton("forward")}
      </div>
      {loading && <CenteredSpin />}
      <div style={{ marginTop: "1rem" }}>
        {data?.incompleteChecklists.length === 0 && <Empty />}
        {data?.incompleteChecklists.map((checklist: Checklist) => (
          <div key={checklist.id} style={{ display: "flex" }}>
            <div style={{ marginRight: ".5rem" }}>
              <ChecklistStatus
                summary={generateSummary(checklist)}
                entity={checklist.entity as Entity}
              />
            </div>
            <EntityListing entity={checklist.entity} />
          </div>
        ))}
      </div>
    </div>
  );
};
