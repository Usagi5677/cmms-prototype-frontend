import { useLazyQuery } from "@apollo/client";
import { Avatar, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useState, useEffect, useRef } from "react";
import { DELETE_USER_ASSIGNMENT } from "../../../api/mutations";
import { USER_ASSIGNMENTS } from "../../../api/queries";
import { PAGE_LIMIT } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import { DeleteListing } from "../../common/DeleteListing";
import PaginationButtons from "../../common/PaginationButtons/PaginationButtons";
import classes from "./UserAssignments.module.css";
import Search from "../../common/Search";
import UserAssignment from "../../../models/UserAssignment";
import { EditUserAssignment } from "./EditUserAssignment";
import SizeableTag from "../../common/SizeableTag/SizeableTag";
import DivisionUser from "../../../models/DivisionUser";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import UserAvatar from "../../common/UserAvatar";
import { stringToColor } from "../../../helpers/style";
import { UserAssignmentBulkCreate } from "./UserAssignmentBulkCreate";
import { UserAssignmentBulkRemove } from "./UserAssignmentBulkRemove";

export interface UserAssignmentsProps {}

export const UserAssignments: React.FC<UserAssignmentsProps> = ({}) => {
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [page, setPage] = useState(1);
  const isSmallDevice = useIsSmallDevice(600, true);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      type: string;
    }
  >({
    ...DefaultPaginationArgs,
    type: "",
  });

  const [getUserAssignments, { data, loading }] = useLazyQuery(
    USER_ASSIGNMENTS,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while loading user assignments.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    getUserAssignments({ variables: filter });
  }, [filter]);

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

  const columns: ColumnsType<UserAssignment> = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: "25%",
      className: classes["font"],
      render: (user, rec) => (
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          {isSmallDevice && (
            <Avatar
              style={{
                backgroundColor: stringToColor(user?.fullName ?? " "),
              }}
            >
              {user?.fullName
                .match(/^\w|\b\w(?=\S+$)/g)
                ?.join()
                .replace(",", "")
                .toUpperCase()}
            </Avatar>
          )}

          <div
            style={{
              marginLeft: isSmallDevice ? 10 : 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>{rec?.user?.fullName}</span>
            <span style={{ opacity: 0.5 }}>{rec?.user?.rcno}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "15%",
      className: classes["font"],
    },
    {
      title: "Division",
      dataIndex: "divisionUsers",
      key: "divisionUsers",
      width: "15%",
      className: classes["font"],
      render: (divisionUsers, rec: any) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              rowGap: 4,
            }}
          >
            {rec?.user?.divisionUsers?.map((du: DivisionUser) => (
              <SizeableTag
                name={du?.division?.name!}
                nameColor
                fontSize={isSmallDevice ? 12 : 6}
                height={isSmallDevice ? 18 : 10}
                title={"Division"}
                oppositeMargin
                key={du?.id}
              />
            ))}
          </div>
        );
      },
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: "25%",
      className: classes["font"],
      render: (location, rec) => (
        <span title={"Location"}>{rec?.location?.name}</span>
      ),
    },
    {
      title: "Zone",
      dataIndex: "zone",
      key: "zone",
      width: "25%",
      className: classes["font"],
      render: (zone, rec) => <span title={"zone"}>{rec?.zone?.name}</span>,
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      className: classes["font"],
      // width: "33%",
      render: (val, rec) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <EditUserAssignment userAssignment={rec} />
          <DeleteListing
            id={rec.id}
            mutation={DELETE_USER_ASSIGNMENT}
            refetchQueries={["userAssignments"]}
          />
        </div>
      ),
    },
  ];

  const pageInfo = data?.userAssignments.pageInfo ?? {};

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
          <UserAssignmentBulkCreate/>
          <UserAssignmentBulkRemove/>
        </div>
      </div>
      <Table
        rowKey="id"
        dataSource={data?.userAssignments.edges.map(
          (edge: { node: UserAssignment }) => edge.node
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
