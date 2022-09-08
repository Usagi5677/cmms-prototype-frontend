import { useLazyQuery } from "@apollo/client";
import { Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { PAGE_LIMIT } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import PaginationButtons from "../../common/PaginationButtons/PaginationButtons";
import Search from "../../common/Search";
import type { ColumnsType } from "antd/es/table";
import { DeleteListing } from "../../common/DeleteListing";
import { DELETE_LOCATION } from "../../../api/mutations";
import { CreateLocation } from "./CreateLocation";
import { EditLocation } from "./EditLocation";
import { LOCATIONS } from "../../../api/queries";
import Location from "../../../models/Location";
import { ZoneSelector } from "../Zone/ZoneSelector";
import Zone from "../../../models/Zone";

export interface LocationsProps {}

export const Locations: React.FC<LocationsProps> = ({}) => {
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      name: string;
      zoneId: null | number;
    }
  >({
    ...DefaultPaginationArgs,
    name: "",
    zoneId: null,
  });

  const setZoneId = (zoneId: number) => {
    console.log(zoneId);
    setFilter({ ...filter, zoneId });
  };

  const [getLocations, { data, loading }] = useLazyQuery(LOCATIONS, {
    onError: (err) => {
      errorMessage(err, "Error loading locations.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getLocations({ variables: filter });
  }, [filter, getLocations]);

  const searchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          name: value,
          ...DefaultPaginationArgs,
        }));
        setPage(1);
      }, 500)
    );
  };
  const initialRender = useRef<boolean>(true);
  useEffect(() => {
    if (initialRender.current === true) {
      initialRender.current = false;
      return;
    }
    searchDebounced(search);
    // eslint-disable-next-line
  }, [search]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: PAGE_LIMIT,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: PAGE_LIMIT,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const columns: ColumnsType<Location> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, location) => (
        <div>
          <span>{name}</span>
          {location.zone && (
            <span style={{ marginLeft: "1rem", opacity: 0.7 }}>
              {location.zone.name}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (val, rec) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <EditLocation location={rec} />
          <DeleteListing
            id={rec.id}
            mutation={DELETE_LOCATION}
            refetchQueries={["locations"]}
          />
        </div>
      ),
    },
  ];

  const pageInfo = data?.locations.pageInfo ?? {};

  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: isSmallDevice ? "space-around" : undefined,
            margin: "-.5rem 1rem 0 0",
          }}
        >
          <Search
            searchValue={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch("")}
            margin={filterMargin}
          />
          <div
            style={{
              display: "flex",
              padding: "1px 5px 1px 5px",
              margin: filterMargin,
              alignItems: "center",
            }}
          >
            <ZoneSelector
              setZoneId={setZoneId}
              rounded={true}
              width={190}
              placeholder="Filter zone"
            />
          </div>
        </div>
        <CreateLocation />
      </div>
      <Table
        rowKey="id"
        dataSource={data?.locations.edges.map(
          (edge: { node: Location }) => edge.node
        )}
        columns={columns}
        pagination={false}
        size="small"
        showHeader={false}
        loading={loading}
        style={{ marginTop: "1rem", marginBottom: "1rem" }}
      />
      <PaginationButtons
        pageInfo={pageInfo}
        page={page}
        next={next}
        back={back}
      />
    </div>
  );
};
