import { useMutation } from "@apollo/client";
import React, { useState } from "react";
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
        "getAllPeriodicMaintenanceOfEntity",
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
  return (
    <div>
      <input
        type="text"
        placeholder={loading ? "Adding..." : text}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        onKeyDown={submit}
        disabled={loading}
        style={{
          border: "solid 1px var(--border-2)",
          borderRadius: 5,
          padding: ".5rem",
          width: "100%",
        }}
      />
    </div>
  );
};
