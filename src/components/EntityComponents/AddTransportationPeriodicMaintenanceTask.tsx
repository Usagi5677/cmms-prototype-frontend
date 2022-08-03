import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { ADD_TRANSPORTATION_PERIODIC_MAINTENANCE_TASK } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import TransportationPeriodicMaintenance from "../../models/Transportation/TransportationPeriodicMaintenance";

export interface AddTransportationPeriodicMaintenanceTaskProps {
  periodicMaintenance: TransportationPeriodicMaintenance;
  parentTaskId?: number;
  text?: string;
}

export const AddTransportationPeriodicMaintenanceTask: React.FC<
AddTransportationPeriodicMaintenanceTaskProps
> = ({ periodicMaintenance, parentTaskId, text = "Add new task" }) => {
  const [details, setDetails] = useState("");

  const [addPeriodicMaintenanceTask, { loading }] = useMutation(
    ADD_TRANSPORTATION_PERIODIC_MAINTENANCE_TASK,
    {
      onCompleted: () => {
        setDetails("");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while adding task.");
      },
      refetchQueries: [
        "getAllPeriodicMaintenanceOfTransportation",
        "getAllHistoryOfTransportation",
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
          border: "solid 1px #e5e5e5",
          borderRadius: 5,
          padding: ".5rem",
          width: "100%",
        }}
      />
    </div>
  );
};
