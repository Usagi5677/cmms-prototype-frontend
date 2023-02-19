import { useMutation } from "@apollo/client";
import { Input } from "antd";
import React, { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { ADD_PERIODIC_MAINTENANCE_TASK } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import PeriodicMaintenance from "../../models/PeriodicMaintenance/PeriodicMaintenance";

export interface AddPeriodicMaintenanceTaskProps {
  periodicMaintenance: PeriodicMaintenance;
  parentTaskId?: number;
  text?: string;
}

export const AddPeriodicMaintenanceTask: React.FC<
  AddPeriodicMaintenanceTaskProps
> = ({ periodicMaintenance, parentTaskId, text = "Add new task" }) => {
  const [details, setDetails] = useState("");

  const [addPeriodicMaintenanceTask, { loading }] = useMutation(
    ADD_PERIODIC_MAINTENANCE_TASK,
    {
      onCompleted: () => {
        setDetails("");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while adding task.");
      },
      refetchQueries: [
        "getAllHistoryOfEntity",
        "getAllEntityChecklistAndPMSummary",
        "periodicMaintenances"
      ],
    }
  );

  const submit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") setDetails("");
    else if (event.key === "Enter") {
      event.preventDefault();
      if (details.trim() === "") return;
      setDetails("");
      addPeriodicMaintenanceTask({
        variables: {
          parentTaskId: parentTaskId,
          periodicMaintenanceId: periodicMaintenance.id,
          name: details,
        },
      });
    }
  };
  const onBtnClick = () => {
    if (details.trim() === "") return;
    setDetails("");
    addPeriodicMaintenanceTask({
      variables: {
        parentTaskId: parentTaskId,
        periodicMaintenanceId: periodicMaintenance.id,
        name: details,
      },
    });
  };
  return (
    <Input.Group compact style={{ display: "flex" }}>
      <Input
        type="text"
        placeholder={loading ? "Adding..." : text}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        onKeyDown={submit}
        disabled={loading}
        style={{
          borderRadius: 5,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      />
      <div
        style={{
          backgroundColor: "var(--ant-primary-color)",
          color: "white",
          height: 36,
          width: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: loading ? "not-allowed" : "pointer",
          borderRadius: 5,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        onClick={() => onBtnClick()}
      >
        <FaLocationArrow />
      </div>
    </Input.Group>
  );
};
