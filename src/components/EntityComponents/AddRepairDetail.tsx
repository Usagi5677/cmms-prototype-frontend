import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router";
import { CREATE_REPAIR } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";

interface AddRepairDetailProps {
  breakdownId?: number;
  description?: string;
  isDeleted?: boolean;
}

export const AddRepairDetail: React.FC<AddRepairDetailProps> = ({
  breakdownId,
  description = "Add new repair",
  isDeleted,
}) => {
  const [details, setDetails] = useState("");
  const { id }: any = useParams();
  const [createRepair, { loading }] = useMutation(CREATE_REPAIR, {
    onCompleted: () => {
      setDetails("");
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while adding repair detail.");
    },
    refetchQueries: [
      "breakdowns",
      "repairs",
      "getAllHistoryOfEntity",
      "getAllEntityChecklistAndPMSummary",
      "periodicMaintenances",
    ],
  });

  const submit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") setDetails("");
    else if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();
      if (details.trim() === "") return;
      setDetails("");
      createRepair({
        variables: {
          createRepairInput: {
            entityId: parseInt(id),
            breakdownId,
            name: details,
          },
        },
      });
    }
  };
  return (
    <div>
      <input
        type="text"
        placeholder={loading ? "Adding..." : description}
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
