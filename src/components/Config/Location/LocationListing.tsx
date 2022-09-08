import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Spin } from "antd";
import React from "react";
import { EDIT_LOCATION } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import Location from "../../../models/Location";

export interface LocationListingProps {
  location: Location;
  selectedZoneId: number | null;
}

export const LocationListing: React.FC<LocationListingProps> = ({
  location,
  selectedZoneId,
}) => {
  const [edit, { loading }] = useMutation(EDIT_LOCATION, {
    onCompleted: () => {},
    onError: (error) => {
      errorMessage(error, "Unexpected error while updating location.");
    },
    refetchQueries: ["locations"],
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          !selectedZoneId && !location.zone ? "end" : "space-between",
        margin: ".2rem",
        padding: ".3rem",
        cursor: "pointer",
        borderRadius: 5,
        alignItems: "center",
      }}
      className="darkenOnHover"
      onClick={() => {
        if (loading) return;
        edit({
          variables: {
            input: {
              id: location.id,
              zoneId: location.zone ? null : selectedZoneId,
            },
          },
        });
      }}
    >
      {selectedZoneId && !location.zone && (
        <div>{loading ? <Spin size="small" /> : <ArrowLeftOutlined />}</div>
      )}
      {location.name}
      {location.zone && (
        <div>{loading ? <Spin size="small" /> : <ArrowRightOutlined />}</div>
      )}
    </div>
  );
};
