import { Button, DatePicker, Divider, Empty, InputNumber, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { DATETIME_FORMATS } from "../../helpers/constants";
import { useLazyQuery } from "@apollo/client";
import { CHECKLIST_SUMMARIES, GET_CHECKLIST } from "../../api/queries";
import { errorMessage } from "../../helpers/gql";
import { ChecklistItem } from "./ChecklistItem";
import ChecklistItemModel from "../../models/ChecklistItem";
import { EditChecklistTemplate } from "../Templates/EditChecklistTemplate";
import { ChecklistComments } from "./ChecklistComments";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { ChecklistStatus } from "./ChecklistStatus";
import { Entity } from "../../models/Entity/Entity";
import { AddReading } from "./AddReading";
import { AddChecklistAttachment } from "./AddChecklistAttachment";
import { ChecklistAttachments } from "./ChecklistAttachments";
import { hasPermissions, isAssignedType } from "../../helpers/permissions";
import UserContext from "../../contexts/UserContext";
import ChecklistSummary from "../../models/ChecklistSummary";
import { AddDailyUsage } from "./AddDailyUsage";

export interface ChecklistsProps {
  entity: Entity;
  type: "Daily" | "Weekly";
}

export const Checklists: React.FC<ChecklistsProps> = ({ entity, type }) => {
  const { user } = useContext(UserContext);
  const [date, setDate] = useState(moment());
  const [month, setMonth] = useState([
    date.clone().startOf("month"),
    date.clone().endOf("month"),
  ]);

  const [getChecklist, { data, loading, refetch }] = useLazyQuery(
    GET_CHECKLIST,
    {
      onError: (err) => {
        errorMessage(err, "Error loading checklist.");
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [getSummary, { data: summary }] = useLazyQuery(CHECKLIST_SUMMARIES);

  useEffect(() => {
    if (entity) {
      getChecklist({
        variables: {
          input: {
            entityId: entity.id,
            type,
            date,
          },
        },
      });
    }
    if (!month[0].isSame(date, "month")) {
      setMonth([date.clone().startOf("month"), date.clone().endOf("month")]);
    }
  }, [date, entity]);

  useEffect(() => {
    if (entity) {
      getSummary({
        variables: {
          input: {
            entityId: entity.id,
            type,
            from: month[0],
            to: month[1],
          },
        },
      });
    }
  }, [month, entity]);

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
      disabled={loading}
      style={
        direction === "forward"
          ? { marginLeft: ".5rem" }
          : { marginRight: ".5rem" }
      }
    >
      {direction === "forward" ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
    </Button>
  );

  const summaryMatchCurrent = () => {
    if (!summary || !data?.checklist) return null;
    const match = summary.checklistSummary.find(
      (cs: ChecklistSummary) => cs.id === data?.checklist.id
    );
    if (!match) return null;
    return (
      <div style={{ marginLeft: "1rem" }}>
        <ChecklistStatus summary={match} entity={entity} />
      </div>
    );
  };

  const summaryMatch = (current: moment.Moment) => {
    if (!summary) return null;
    const match = summary.checklistSummary.find((cs: ChecklistSummary) => {
      if (type === "Daily") {
        return current.clone().startOf("day").toISOString() === cs.from;
      } else {
        return current.clone().startOf("week").toISOString() === cs.from;
      }
    });
    if (!match) return null;
    return <ChecklistStatus summary={match} size="small" entity={entity} />;
  };

  const isOlderChecklist =
    data &&
    data.checklist &&
    moment(data.checklist.to).isBefore(moment(), "second");

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignContent: "center",
          minHeight: 30,
        }}
      >
        <div style={{ fontWeight: 700, marginRight: ".5rem" }}>{type}</div>
        {(isAssignedType("Admin", entity, user) ||
          hasPermissions(user, ["MODIFY_TEMPLATES"])) && (
          <EditChecklistTemplate entity={entity} type={type} />
        )}
        {loading && <Spin style={{ marginLeft: ".5rem" }} />}
        {summaryMatchCurrent()}
        <div style={{ flex: 1 }}></div>
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
              <div className="ant-picker-cell-inner">{current.date()}</div>
              {summaryMatch(current)}
            </div>
          )}
        />
        {changeDateButton("forward")}
      </div>
      {/* {loading && <CenteredSpin />} */}
      {(data?.checklist === null ||
        (type === "Weekly" && data?.checklist.items.length === 0)) && (
        <Empty style={{ marginTop: "1rem" }} />
      )}
      {data?.checklist && (
        <>
          <div style={{ marginTop: ".5rem" }}>
            {type === "Daily" ? (
              <>
                {data?.checklist.currentMeterReading !== null && (
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: 1 }}>
                      <InputNumber
                        disabled
                        addonBefore="Meter Reading"
                        addonAfter={`${entity.measurement}`}
                        style={{ width: "100%", marginBottom: ".5rem" }}
                        value={data?.checklist.currentMeterReading}
                      />
                    </div>
                  </div>
                )}
                {data?.checklist.workingHour !== null &&
                  !data?.checklist.currentMeterReading !== null && (
                    <>
                      <span style={{ opacity: 0.7 }}>
                        Meter not available or broken
                      </span>
                      <div style={{ display: "flex" }}>
                        <div style={{ flex: 1 }}>
                          <InputNumber
                            disabled
                            addonBefore="Daily Reading"
                            addonAfter={`${entity.measurement}`}
                            style={{ width: "100%", marginBottom: ".5rem" }}
                            value={data?.checklist.workingHour}
                          />
                        </div>
                      </div>
                    </>
                  )}
                {data?.checklist.dailyUsageHours !== null && (
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: 1 }}>
                      <InputNumber
                        disabled
                        addonBefore={
                          <span style={{ paddingRight: 11 }}>Daily Usage</span>
                        }
                        addonAfter="hr"
                        style={{ width: "100%", marginBottom: ".5rem" }}
                        value={data?.checklist.dailyUsageHours}
                      />
                    </div>
                  </div>
                )}
                {!isOlderChecklist && (
                  <div
                    style={{
                      display: "flex",
                      marginTop: "1rem",
                    }}
                  >
                    {isAssignedType("any", entity, user) && (
                      <>
                        <div style={{ marginRight: "1rem" }}>
                          <AddReading
                            entity={entity}
                            checklist={data?.checklist}
                          />
                        </div>
                        {entity.measurement !== "hr" && (
                          <div style={{ marginRight: "1rem" }}>
                            <AddDailyUsage
                              entity={entity}
                              checklist={data?.checklist}
                            />
                          </div>
                        )}
                      </>
                    )}
                    <AddChecklistAttachment
                      entity={entity}
                      checklist={data?.checklist}
                      refetchChecklist={refetch}
                    />
                  </div>
                )}
              </>
            ) : (
              <div style={{ marginTop: "1rem" }}>
                <AddChecklistAttachment
                  entity={entity}
                  checklist={data?.checklist}
                  refetchChecklist={refetch}
                />
              </div>
            )}
            {data?.checklist.attachments.length > 0 && (
              <ChecklistAttachments checklist={data?.checklist} />
            )}
            <div style={{ marginTop: "1rem" }}>
              {data?.checklist.items.map((item: ChecklistItemModel) => (
                <ChecklistItem
                  checklist={data?.checklist}
                  item={item}
                  key={item.id}
                  disabled={isOlderChecklist}
                  isAssigned={isAssignedType("any", entity, user)}
                  readingDone={
                    data?.checklist.currentMeterReading !== null ||
                    data?.checklist.workingHour !== null ||
                    data?.checklist.dailyUsageHours
                  }
                />
              ))}
            </div>
          </div>
        </>
      )}
      {data?.checklist && (
        <>
          <Divider />
          <ChecklistComments checklist={data?.checklist} />
        </>
      )}
    </div>
  );
};
