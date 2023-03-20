import { useLazyQuery } from "@apollo/client";
import { Checkbox, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { PAGE_LIMIT } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
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
import classes from "./Locations.module.css";

export interface LocationsProps {}

export const Locations: React.FC<LocationsProps> = ({}) => {
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      name: string;
      zoneId: null | number;
      withSkipFriday: boolean;
    }
  >({
    ...DefaultPaginationArgs,
    name: "",
    zoneId: null,
    withSkipFriday: false,
  });

  const setZoneId = (zoneId: number) => {
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
      className: classes["font"],
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
      className: classes["font"],
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
  return (
    <div>
      <div className={classes["options-wrapper"]}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Search
            searchValue={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch("")}
          />
          <ZoneSelector
              setZoneId={setZoneId}
              rounded={true}
              width={190}
              placeholder="Filter zone"
            />
          <Checkbox
            checked={filter.withSkipFriday}
            onChange={(e) => {
              setFilter({ ...filter, withSkipFriday: e.target.checked });
              setPage(1);
            }}
          >
            Sites with skip friday
          </Checkbox>
        </div>
        <div className={classes["option"]}>
          <CreateLocation />
        </div>
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
