import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { ADD_PERIODIC_MAINTENANCE_COMMENT } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import PeriodicMaintenance from "../../models/PeriodicMaintenance/PeriodicMaintenance";

export interface AddPeriodicMaintenanceObservationProps {
  periodicMaintenance: PeriodicMaintenance;
  type: string;
  text?: string;
  isDeleted?: boolean;
  isOlder?: boolean;
  isCopy?: boolean;
}

export const AddPeriodicMaintenanceObservation: React.FC<
  AddPeriodicMaintenanceObservationProps
> = ({
  periodicMaintenance,
  type,
  text = "Add new observation",
  isDeleted,
  isOlder,
  isCopy
}) => {
  const [details, setDetails] = useState("");

  const [create, { loading }] = useMutation(ADD_PERIODIC_MAINTENANCE_COMMENT, {
    onCompleted: () => {
      setDetails("");
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while adding observation.");
    },
    refetchQueries: ["periodicMaintenances", "periodicMaintenanceSummary"],
  });

  const submit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") setDetails("");
    else if (event.key === "Enter") {
      event.preventDefault();
      if (details.trim() === "") return;
      setDetails("");
      create({
        variables: {
          periodicMaintenanceId: periodicMaintenance.id,
          type,
          text: details,
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
        disabled={loading || isDeleted || isOlder || !isCopy}
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
