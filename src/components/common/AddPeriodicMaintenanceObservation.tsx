import { useMutation } from "@apollo/client";
import { Input } from "antd";
import React, { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { ADD_PERIODIC_MAINTENANCE_COMMENT } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";

export interface PMObservationProps {
  periodicMaintenanceId: number;
  type: string;
  placeholder?: string;
  isDeleted?: boolean;
  isVerified?: boolean;
  isCopy?: boolean;
}

export const AddPeriodicMaintenanceObservation: React.FC<
  PMObservationProps
> = ({
  periodicMaintenanceId,
  type,
  placeholder,
  isDeleted,
  isVerified,
  isCopy,
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
          periodicMaintenanceId,
          type,
          description: details,
        },
      });
    }
  };
  const onBtnClick = () => {
    if (details.trim() === "") return;
    setDetails("");
    create({
      variables: {
        periodicMaintenanceId,
        type,
        description: details,
      },
    });
  };
  return (
    <Input.Group compact style={{ display: "flex" }}>
      <Input
        type="text"
        placeholder={loading ? "Adding..." : placeholder}
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
