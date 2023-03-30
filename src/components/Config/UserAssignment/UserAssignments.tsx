import { useLazyQuery } from "@apollo/client";
import { Avatar, Table, Tag } from "antd";
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
import { SearchUsers } from "../../common/SearchUsers";
import User from "../../../models/User";
import Zone from "../../../models/Zone";
import Location from "../../../models/Location";
import AssignmentTypeSelector from "../../common/AssignmentTypeSelector";
import { SearchLocations } from "../../common/SearchLocations";
import { SearchZones } from "../../common/SearchZones";

export interface UserAssignmentsProps {}

export const UserAssignments: React.FC<UserAssignmentsProps> = ({}) => {
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [page, setPage] = useState(1);
  const isSmallDevice = useIsSmallDevice(600, true);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedUserTypes, setSelectedUserTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [selectedZones, setSelectedZones] = useState<Zone[]>([]);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string | null;
      types: string[];
      userIds: number[];
      locationIds: number[];
      zoneIds: number[];
    }
  >({
    ...DefaultPaginationArgs,
    search: null,
    types: [],
    userIds: [],
    locationIds: [],
    zoneIds: [],
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

  useEffect(() => {
    setFilter({
      ...filter,
      locationIds: selectedLocations.map((s) => s.id),
    });
    setPage(1);
  }, [selectedLocations]);

  useEffect(() => {
    setFilter({
      ...filter,
      userIds: selectedUsers.map((s) => s.id),
    });
    setPage(1);
  }, [selectedUsers]);

  useEffect(() => {
    setFilter({
      ...filter,
      types: selectedUserTypes.map((t) => t),
    });
    setPage(1);
  }, [selectedUserTypes]);

  useEffect(() => {
    setFilter({
      ...filter,
      zoneIds: selectedZones.map((z) => z.id),
    });
    setPage(1);
  }, [selectedZones]);

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
          <SearchUsers
            placeholder="Filter user"
            rounded
            current={selectedUsers}
            onChange={(user) => {
              const current = selectedUsers.map((s) => s.id);
              if (current.includes(user.id)) return;
              setSelectedUsers([...selectedUsers, user]);
            }}
            width={190}
          />
          <AssignmentTypeSelector
            width={190}
            value={selectedUserTypes[-1]}
            onChange={(userTypes) => {
              if (
                !selectedUserTypes.includes(userTypes!) &&
                userTypes !== undefined
              ) {
                setSelectedUserTypes([...selectedUserTypes, userTypes!]);
                setPage(1);
              }
            }}
          />
          <SearchLocations
            placeholder="Filter location"
            rounded
            current={selectedLocations}
            onChange={(location) => {
              const current = selectedLocations.map((s) => s.id);
              if (current.includes(location.id)) return;
              setSelectedLocations([...selectedLocations, location]);
            }}
            width={190}
          />
          <SearchZones
            placeholder="Filter zone"
            rounded
            current={selectedZones}
            onChange={(zone) => {
              const current = selectedZones.map((s) => s.id);
              if (current.includes(zone.id)) return;
              setSelectedZones([...selectedZones, zone]);
            }}
            width={190}
          />
        </div>
        <div className={classes["option"]}>
          <UserAssignmentBulkCreate />
          <UserAssignmentBulkRemove />
        </div>
      </div>
      {selectedLocations.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            opacity: 0.7,
            paddingTop: 10,
            gap: 10,
          }}
        >
          {selectedLocations.map((d) => (
            <Tag
              key={d.id}
              closable
              onClose={() =>
                setSelectedLocations(
                  selectedLocations.filter((s) => s.id !== d.id)
                )
              }
            >
              {d.name}
            </Tag>
          ))}
        </div>
      )}
      {selectedZones.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            opacity: 0.7,
            paddingTop: 10,
            gap: 10,
          }}
        >
          {selectedZones.map((d) => (
            <Tag
              key={d.id}
              closable
              onClose={() =>
                setSelectedZones(selectedZones.filter((s) => s.id !== d.id))
              }
            >
              {d.name}
            </Tag>
          ))}
        </div>
      )}
      {selectedUsers.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            opacity: 0.7,
            paddingTop: 10,
            gap: 10,
          }}
        >
          {selectedUsers.map((user) => (
            <Tag
              key={user.id}
              closable
              onClose={() =>
                setSelectedUsers(selectedUsers.filter((s) => s.id !== user.id))
              }
            >
              {user.fullName} ({user.rcno})
            </Tag>
          ))}
        </div>
      )}
      {selectedUserTypes.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            opacity: 0.7,
            paddingTop: 10,
            gap: 10,
          }}
        >
          {selectedUserTypes.map((userType) => (
            <Tag
              key={userType}
              closable
              onClose={() =>
                setSelectedUserTypes(
                  selectedUserTypes.filter((type) => type !== userType)
                )
              }
            >
              {userType}
            </Tag>
          ))}
        </div>
      )}
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
