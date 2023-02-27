import { useMutation } from "@apollo/client";
import { Input } from "antd";
import React, { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { ADD_SPARE_PR_DETAIL } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";

interface AddSparePRDetailProps {
  sparePRId?: number;
  description?: string;
}

export const AddSparePRDetail: React.FC<AddSparePRDetailProps> = ({
  sparePRId,
  description = "Add Detail",
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
    else if (event.key === "Enter") {
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
  const onBtnClick = () => {
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
  };
  return (
    <Input.Group compact style={{ display: "flex" }}>
      <Input
        type="text"
        placeholder={loading ? "Adding..." : description}
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
