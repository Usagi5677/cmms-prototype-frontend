import { Button, DatePicker, Empty, InputNumber, Spin } from "antd";
import React, { useEffect, useState } from "react";
import Machine from "../../models/Machine";
import Transportation from "../../models/Transportation";
import moment from "moment";
import { DATETIME_FORMATS } from "../../helpers/constants";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_CHECKLIST } from "../../api/queries";
import { errorMessage } from "../../helpers/gql";
import { ChecklistItem } from "./ChecklistItem";
import ChecklistItemModel from "../../models/ChecklistItem";
import { CenteredSpin } from "../common/CenteredSpin";
import { LoadingOutlined } from "@ant-design/icons";
import {
  TOGGLE_CHECKLIST_ITEM,
  UPDATE_READING,
  UPDATE_WORKING_HOURS,
} from "../../api/mutations";
import { EditChecklistTemplate } from "../Templates/EditChecklistTemplate";

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

  const [updateReading, { loading: updatingReading }] = useMutation(
    UPDATE_READING,
    { refetchQueries: ["checklist"] }
  );

  const [updateWorkingHours, { loading: updatingHour }] = useMutation(
    UPDATE_WORKING_HOURS,
    { refetchQueries: ["checklist"] }
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
  }, [date, entity]);

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
        <div style={{ flex: 1 }}></div>
      </div>
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
      />
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
                      placeholder="Current running hrs"
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
                      placeholder="Working hour"
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
    </div>
  );
};
