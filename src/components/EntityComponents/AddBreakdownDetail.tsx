import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { ADD_BREAKDOWN_DETAIL } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";

interface AddBreakdownDetailProps {
  breakdownId?: number;
  description?: string;
}

export const AddBreakdownDetail: React.FC<AddBreakdownDetailProps> = ({
  breakdownId,
  description = "Add new breakdown detail",
}) => {
  const [details, setDetails] = useState("");

  const [addBreakdownDetail, { loading }] = useMutation(ADD_BREAKDOWN_DETAIL, {
    onCompleted: () => {
      setDetails("");
    },
    onError: (error) => {
      errorMessage(error, "Unexpected error while adding breakdown detail.");
    },
    refetchQueries: ["breakdowns", "getAllHistoryOfEntity"],
  });

  const submit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") setDetails("");
    else if (event.key === "Enter") {
      event.preventDefault();
      if (details.trim() === "") return;
      setDetails("");
      addBreakdownDetail({
        variables: {
          createBreakdownDetailInput: {
            breakdownId,
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
