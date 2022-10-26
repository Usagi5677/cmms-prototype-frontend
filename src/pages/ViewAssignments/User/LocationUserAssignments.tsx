import { useLazyQuery } from "@apollo/client";
import { Checkbox, message, Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UNASSIGN_USER_FROM_LOCATION } from "../../../api/mutations";
import { LOCATION_ASSIGNMENTS } from "../../../api/queries";
import { DeleteListing } from "../../../components/common/DeleteListing";
import PaginationButtons from "../../../components/common/PaginationButtons/PaginationButtons";
import UserContext from "../../../contexts/UserContext";
import { DATETIME_FORMATS, PAGE_LIMIT } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import { hasPermissions } from "../../../helpers/permissions";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import User from "../../../models/User";
import moment from "moment";
import { SearchUsers } from "../../../components/common/SearchUsers";
import classes from "./DivisionUserAssignments.module.css";
import Location from "../../../models/Location";
import LocationAssign from "../../../models/LocationAssign";
import { LocationUserBulkAssignment } from "../../../components/Config/Location/LocationUserBulkAssignment";
import { SearchLocations } from "../../../components/common/SearchLocations";
import { LocationUserBulkUnassignment } from "../../../components/Config/Location/LocationUserBulkUnassignment";

export interface LocationUserAssignmentsProps {}

export const LocationUserAssignments: React.FC<
  LocationUserAssignmentsProps
> = ({}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasPermissions(user, ["ASSIGN_TO_ENTITY"])) {
      navigate("/");
      message.error("No permission to view assignments.");
    }
  }, []);

  const [page, setPage] = useState(1);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      locationIds: number[];
      userIds: number[];
      current: boolean;
    }
  >({
    ...DefaultPaginationArgs,
    locationIds: [],
    userIds: [],
    current: true,
  });

  const [getAssignments, { data, loading }] = useLazyQuery(
    LOCATION_ASSIGNMENTS,
    {
      onError: (err) => {
        errorMessage(err, "Error loading location assignments.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    getAssignments({ variables: filter });
  }, [filter, getAssignments]);

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

  const columns: ColumnsType<LocationAssign> = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user: User) => `${user.fullName} (${user.rcno})`,
      className: classes["font"],
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (location: Location) => `${location.name}`,
      className: classes["font"],
    },
    {
      title: "From",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        moment(createdAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR),
      className: classes["font"],
    },

    {
      title: "",
      dataIndex: "action",
      key: "action",
      className: classes["font"],
      render: (val, assignment: LocationAssign) =>
        assignment.removedAt ? null : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <DeleteListing
              id={assignment.id}
              mutation={UNASSIGN_USER_FROM_LOCATION}
              refetchQueries={["locationAssignments"]}
              tooltip="Unassign"
              title="Are you sure to unassign?"
              variables={{
                id: assignment.id,
              }}
            />
          </div>
        ),
    },
  ];

  if (!filter.current) {
    columns.splice(3, 0, {
      title: "To",
      dataIndex: "removedAt",
      key: "removedAt",
      className: classes["font"],
      render: (removedAt) =>
        removedAt
          ? moment(removedAt).format(DATETIME_FORMATS.DAY_MONTH_YEAR)
          : null,
    });
  }

  const pageInfo = data?.locationAssignments.pageInfo ?? {};

  const isSmallDevice = useIsSmallDevice(600, false);

  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem .5rem 0 0";

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

  return (
    <div>
      <div className={classes["options-wrapper"]}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: isSmallDevice ? "space-around" : undefined,
          }}
        >
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
            margin={filterMargin}
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
            margin={filterMargin}
          />

          <Checkbox
            style={{ margin: filterMargin }}
            checked={filter.current}
            onChange={(e) => {
              setFilter({ ...filter, current: e.target.checked });
              setPage(1);
            }}
          >
            Active assignments only
          </Checkbox>
        </div>
        <div className={classes["option"]}>
          <LocationUserBulkAssignment />
          <LocationUserBulkUnassignment />
        </div>
      </div>
      {selectedLocations.length > 0 && (
        <div
          style={{
            display: "flex",
            opacity: 0.7,
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
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
              style={{ marginRight: "1rem" }}
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
            opacity: 0.7,
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {selectedUsers.map((user) => (
            <Tag
              key={user.id}
              closable
              onClose={() =>
                setSelectedUsers(selectedUsers.filter((s) => s.id !== user.id))
              }
              style={{ marginRight: "1rem" }}
            >
              {user.fullName} ({user.rcno})
            </Tag>
          ))}
        </div>
      )}
      <Table
        rowKey="id"
        dataSource={data?.locationAssignments.edges.map(
          (edge: { node: Location }) => edge.node
        )}
        columns={columns}
        pagination={false}
        size="small"
        loading={loading}
        style={{ marginTop: "1rem", marginBottom: "1rem", overflowX:"auto" }}
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
