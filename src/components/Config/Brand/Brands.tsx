import { useLazyQuery } from "@apollo/client";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useState, useEffect, useRef } from "react";
import { DELETE_BRAND } from "../../../api/mutations";
import { BRANDS } from "../../../api/queries";
import { PAGE_LIMIT } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import { DeleteListing } from "../../common/DeleteListing";
import PaginationButtons from "../../common/PaginationButtons/PaginationButtons";
import { EditBrand } from "./EditBrand";
import classes from "./Brands.module.css";
import Brand from "../../../models/Brand";
import Search from "../../common/Search";
import { CreateBrand } from "./CreateBrand";

export interface BrandsProps {}

export const Brands: React.FC<BrandsProps> = ({}) => {
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

  const [getBrands, { data, loading }] = useLazyQuery(BRANDS, {
    onError: (err) => {
      errorMessage(err, "Error loading brands.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getBrands({ variables: filter });
  }, [filter, getBrands]);

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

  const columns: ColumnsType<Brand> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "100%",
      className: classes["font"],
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      className: classes["font"],
      // width: "33%",
      render: (val, rec) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <EditBrand brand={rec} />
          <DeleteListing
            id={rec.id}
            mutation={DELETE_BRAND}
            refetchQueries={["brands"]}
          />
        </div>
      ),
    },
  ];

  const pageInfo = data?.brands.pageInfo ?? {};

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
          <CreateBrand />
        </div>
      </div>
      <Table
        rowKey="id"
        dataSource={data?.brands.edges.map(
          (edge: { node: Brand }) => edge.node
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
