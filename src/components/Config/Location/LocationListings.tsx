import { useLazyQuery } from "@apollo/client";
import { Empty, Input } from "antd";
import React, { useEffect, useState } from "react";
import { LOCATIONS } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import Location from "../../../models/Location";
import { CenteredSpin } from "../../common/CenteredSpin";
import { LocationListing } from "./LocationListing";

const { Search } = Input;

export interface LocationListingsProps {
  zoneId: number | null;
  selectedZoneId: number | null;
}

export const LocationListings: React.FC<LocationListingsProps> = ({
  zoneId,
  selectedZoneId,
}) => {
  const [search, setSearch] = useState("");
  const [getLocations, { data, loading }] = useLazyQuery(LOCATIONS, {
    onError: (err) => {
      errorMessage(err, "Error loading locations.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getLocations({
      variables: {
        zoneId,
        first: 200,
        showOnlyUnzoned: zoneId ? undefined : true,
      },
    });
  }, [zoneId]);

  const filtered = data?.locations.edges.filter((edge: { node: Location }) =>
    edge.node.name.toLowerCase().includes(search)
  );

  return (
    <div>
      {loading && <CenteredSpin />}
      {data?.locations.edges.length === 0 && <Empty />}
      {data?.locations.edges.length > 0 && (
        <Search
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          allowClear
        />
      )}
      {filtered?.map((edge: { node: Location }) => (
        <LocationListing
          key={edge.node.id}
          location={edge.node}
          selectedZoneId={selectedZoneId}
        />
      ))}
    </div>
  );
};
