import { Button, DatePicker, Divider, Empty, InputNumber, Spin } from "antd";
import React, { useEffect, useState } from "react";
import Machine from "../../models/Machine";
import Transportation from "../../models/Transportation";
import moment from "moment";
import { DATETIME_FORMATS } from "../../helpers/constants";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CHECKLIST_SUMMARIES, GET_CHECKLIST } from "../../api/queries";
import { errorMessage } from "../../helpers/gql";
import { ChecklistItem } from "./ChecklistItem";
import ChecklistItemModel from "../../models/ChecklistItem";
import { UPDATE_READING, UPDATE_WORKING_HOURS } from "../../api/mutations";
import { EditChecklistTemplate } from "../Templates/EditChecklistTemplate";
import { ChecklistComments } from "./ChecklistComments";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { ChecklistStatus, ChecklistSummary } from "./ChecklistStatus";

export interface ChecklistsProps {
  entity: Machine | Transportation;
  entityType: "Machine" | "Transportation";
  type: "Daily" | "Weekly";
}

export const Checklists: React.FC<ChecklistsProps> = ({
  entity,
  entityType,
  type,
}) => {
  const [date, setDate] = useState(moment());
  const [month, setMonth] = useState([
    date.clone().startOf("month"),
    date.clone().endOf("month"),
  ]);
  const [hours, setHours] = useState<null | number>(null);
  const [reading, setReading] = useState<null | number>(null);

  const [getChecklist, { data, loading }] = useLazyQuery(GET_CHECKLIST, {
    onCompleted: (data) => {
      if (data.checklist) {
        setHours(data.checklist.workingHour);
        setReading(data.checklist.currentMeterReading);
      }
    },
    onError: (err) => {
      errorMessage(err, "Error loading checklist.");
    },
    notifyOnNetworkStatusChange: true,
  });

  const [getSummary, { data: summary }] = useLazyQuery(CHECKLIST_SUMMARIES);

  const [updateReading, { loading: updatingReading }] = useMutation(
    UPDATE_READING,
    {
      refetchQueries: [
        "checklist",
        "getSingleMachine",
        "getSingleTransportation",
        "checklistSummary",
      ],
    }
  );

  const [updateWorkingHours, { loading: updatingHour }] = useMutation(
    UPDATE_WORKING_HOURS,
    { refetchQueries: ["checklist", "checklistSummary"] }
  );

  useEffect(() => {
    if (entity) {
      getChecklist({
        variables: {
          input: {
            entityType,
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
            entityType,
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
    console.log(direction);
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
        <ChecklistStatus summary={match} />
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
    return <ChecklistStatus summary={match} size="small" />;
  };

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
        <EditChecklistTemplate
          entity={entity}
          entityType={entityType}
          type={type}
        />
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
            {type === "Daily" && (
              <>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    <InputNumber
                      addonBefore="Current Reading"
                      addonAfter={`${entity.measurement}`}
                      placeholder={`Enter ${entity.measurement}`}
                      style={{ width: "100%", marginBottom: ".5rem" }}
                      //@ts-ignore
                      value={reading}
                      onChange={(val: number) => {
                        setReading(val);
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      style={{ marginLeft: ".5rem" }}
                      loading={updatingReading}
                      disabled={reading === data?.checklist.currentMeterReading}
                      onClick={() => {
                        updateReading({
                          variables: {
                            id: data?.checklist.id,
                            reading: reading,
                          },
                        });
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    <InputNumber
                      addonBefore="Working Hours&nbsp;&nbsp;"
                      placeholder="Enter hours"
                      style={{ width: "100%", marginBottom: ".5rem" }}
                      //@ts-ignore
                      value={hours}
                      onChange={(val: number) => {
                        setHours(val);
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      style={{ marginLeft: ".5rem" }}
                      loading={updatingHour}
                      disabled={hours === data?.checklist.workingHour}
                      onClick={() => {
                        updateWorkingHours({
                          variables: {
                            id: data?.checklist.id,
                            newHrs: hours,
                          },
                        });
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </>
            )}
            {data?.checklist.items.map((item: ChecklistItemModel) => (
              <ChecklistItem item={item} key={item.id} />
            ))}
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
