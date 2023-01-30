import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { ADD_SPARE_PR_DETAIL } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";

interface AddSparePRDetailProps {
  sparePRId?: number;
  description?: string;
}

export const AddSparePRDetail: React.FC<AddSparePRDetailProps> = ({
  sparePRId,
  description = "Add new detail",
}) => {
  const [details, setDetails] = useState("");

  const [addSparePRDetail, { loading }] = useMutation(ADD_SPARE_PR_DETAIL, {
    onCompleted: () => {
      setDetails("");
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while adding breakdown detail.");
    },
    refetchQueries: ["sparePRs", "getAllHistoryOfEntity"],
  });

  const submit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") setDetails("");
    else if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();
      if (details.trim() === "") return;
      setDetails("");
      addSparePRDetail({
        variables: {
          createSparePRDetailInput: {
            sparePRId,
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
        placeholder={loading ? "Adding..." : description}
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
