import { useMutation } from "@apollo/client";
import { Input } from "antd";
import React, { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
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
  description = "Add Repair",
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
    else if (event.key === "Enter") {
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
  const onBtnClick = () => {
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
