import { useLazyQuery } from "@apollo/client";
import { Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { DATETIME_FORMATS, PAGE_LIMIT } from "../../helpers/constants";
import { errorMessage } from "../../helpers/gql";
import { useIsSmallDevice } from "../../helpers/useIsSmallDevice";
import DefaultPaginationArgs from "../../models/DefaultPaginationArgs";
import PaginationArgs from "../../models/PaginationArgs";
import PaginationButtons from "../common/PaginationButtons/PaginationButtons";
import Search from "../common/Search";
import type { ColumnsType } from "antd/es/table";
import { DeleteListing } from "../common/DeleteListing";
import { DEACTIVATE_KEY } from "../../api/mutations";
import { API_KEYS } from "../../api/queries";
import { CreateApiKey } from "./CreateApiKey";
import ApiKey from "../../models/ApiKey";
import { FaCheck } from "react-icons/fa";
import moment from "moment";
import { EditApiKey } from "./EditApiKey";

export interface ApiKeysProps {}

export const ApiKeys: React.FC<ApiKeysProps> = ({}) => {
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
    }
  >({
    ...DefaultPaginationArgs,
    search: "",
  });

  const [getKeys, { data, loading }] = useLazyQuery(API_KEYS, {
    onError: (err) => {
      errorMessage(err, "Error loading API keys.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getKeys({ variables: filter });
  }, [filter, getKeys]);

  const searchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
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

  const columns: ColumnsType<ApiKey> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Starts with",
      dataIndex: "apiKeyStart",
      key: "apiKeyStart",
    },
    {
      title: "Calls",
      dataIndex: "calls",
      key: "calls",
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active) => (active ? <FaCheck /> : null),
    },
    {
      title: "Expiration",
      dataIndex: "expiresAt",
      key: "expiresAt",
      render: (expiresAt) =>
        expiresAt
          ? moment(expiresAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR)
          : null,
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (val, rec) =>
        rec.active ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <EditApiKey apiKey={rec} />
            <DeleteListing
              id={rec.id}
              mutation={DEACTIVATE_KEY}
              refetchQueries={["apiKeys"]}
              tooltip="Deactivate"
              title="Are you sure to deactivate?"
            />
          </div>
        ) : null,
    },
  ];

  const pageInfo = data?.apiKeys.pageInfo ?? {};

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
          ></div>
        </div>
        <CreateApiKey />
      </div>
      <Table
        rowKey="id"
        dataSource={data?.apiKeys.edges.map(
          (edge: { node: ApiKey }) => edge.node
        )}
        columns={columns}
        pagination={false}
        size="small"
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
