import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { ADD_REPAIR_COMMENT } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";

export interface RepairObservationProps {
  repairId: number;
  type: string;
  placeholder?: string;
  isDeleted?: boolean;
}

export const AddRepairObservation: React.FC<RepairObservationProps> = ({
  repairId,
  type,
  placeholder,
  isDeleted,
}) => {
  const [details, setDetails] = useState("");

  const [create, { loading }] = useMutation(ADD_REPAIR_COMMENT, {
    onCompleted: () => {
      setDetails("");
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while adding observation.");
    },
    refetchQueries: ["repairs", "getAllHistoryOfEntity"],
  });

  const submit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") setDetails("");
    else if (event.key === "Enter") {
      event.preventDefault();
      if (details.trim() === "") return;
      setDetails("");
      create({
        variables: {
          createRepairCommentInput: {
            repairId,
            type,
            description: details,
          },
        },
      });
    }
  };
  return (
    <div>
      <input
        type="text"
        placeholder={loading ? "Adding..." : placeholder}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        onKeyDown={submit}
        disabled={loading || isDeleted}
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
