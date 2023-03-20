import { useLazyQuery } from "@apollo/client";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useState, useEffect, useRef } from "react";
import { DELETE_INTER_SERVICE_COLOR } from "../../../api/mutations";
import { INTER_SERVICE_COLORS } from "../../../api/queries";
import { PAGE_LIMIT } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import { DeleteListing } from "../../common/DeleteListing";
import PaginationButtons from "../../common/PaginationButtons/PaginationButtons";
import { EditInterServiceColor } from "./EditInterServiceColor";
import classes from "./InterServiceColor.module.css";
import Search from "../../common/Search";
import { CreateInterServiceColor } from "./CreateInterServiceColor";
import InterServiceColor from "../../../models/InterServiceColor";

export interface InterServiceColorsProps {}

export const InterServiceColors: React.FC<InterServiceColorsProps> = ({}) => {
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      name: string;
    }
  >({
    ...DefaultPaginationArgs,
    name: "",
  });

  const [getInterServiceColors, { data, loading }] = useLazyQuery(
    INTER_SERVICE_COLORS,
    {
      onError: (err) => {
        errorMessage(err, "Error loading inter service colors.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    getInterServiceColors({ variables: filter });
  }, [filter, getInterServiceColors]);

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

  const columns: ColumnsType<InterServiceColor> = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "25%",
      className: classes["font"],
      render: (type, rec) => (
        <div>
          <span>{rec?.type?.name}</span>
        </div>
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      width: "25%",
      className: classes["font"],
      render: (brand, rec) => (
        <div>
          <span>{rec?.brand?.name}</span>
        </div>
      ),
    },
    {
      title: "Greater Than",
      dataIndex: "greaterThan",
      key: "greaterThan",
      width: "25%",
      className: classes["font"],
      render: (greaterThan, rec) => (
        <div>
          <span>{greaterThan}</span>
          <span style={{ marginLeft: "0.3rem", opacity: 0.7 }}>
            ({rec.measurement})
          </span>
        </div>
      ),
    },
    {
      title: "Less Than",
      dataIndex: "lessThan",
      key: "lessThan",
      width: "25%",
      className: classes["font"],
      render: (lessThan, rec) => (
        <div>
          <span>{lessThan}</span>
          <span style={{ marginLeft: "0.3rem", opacity: 0.7 }}>
            ({rec.measurement})
          </span>
        </div>
      ),
    },

    {
      title: "",
      dataIndex: "action",
      key: "action",
      className: classes["font"],
      width: "25%",
      render: (val, rec) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <EditInterServiceColor interServiceColor={rec} />
          <DeleteListing
            id={rec.id}
            mutation={DELETE_INTER_SERVICE_COLOR}
            refetchQueries={["interServiceColors"]}
          />
        </div>
      ),
    },
  ];

  const pageInfo = data?.interServiceColors.pageInfo ?? {};

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
        </div>
        <div className={classes["option"]}>
          <CreateInterServiceColor />
        </div>
      </div>
      <Table
        rowKey="id"
        dataSource={data?.interServiceColors.edges.map(
          (edge: { node: InterServiceColor }) => edge.node
        )}
        columns={columns}
        pagination={false}
        size="small"
        showHeader={true}
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
