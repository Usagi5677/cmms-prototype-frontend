import { useLazyQuery } from "@apollo/client";
import { Checkbox, message, Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ALL_ENTITY } from "../../../api/queries";
import PaginationButtons from "../../../components/common/PaginationButtons/PaginationButtons";
import UserContext from "../../../contexts/UserContext";
import { PAGE_LIMIT } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import { hasPermissions } from "../../../helpers/permissions";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import classes from "./DivisionEntityAssignments.module.css";
import { Entity } from "../../../models/Entity/Entity";
import { EntityListing } from "../../../components/EntityComponents/EntityListing";
import { SearchEntities } from "../../../components/common/SearchEntitities";
import Location from "../../../models/Location";
import { SearchLocations } from "../../../components/common/SearchLocations";
import { LocationEntityBulkAssignment } from "../../../components/EntityComponents/EntityAssignment/LocationEntityBulkAssignment";
import EditEntityLocation from "./EditEntityLocation";

export interface LocationEntityAssignmentsProps {}

export const LocationEntityAssignments: React.FC<
  LocationEntityAssignmentsProps
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
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);
  const [locationExist, setLocationExist] = useState<boolean>(true);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      locationIds: number[];
      entityIds: number[];
      locationExist: boolean;
    }
  >({
    ...DefaultPaginationArgs,
    locationIds: [],
    entityIds: [],
    locationExist: locationExist,
  });

  const [getAllEntity, { data, loading }] = useLazyQuery(ALL_ENTITY, {
    onError: (err) => {
      errorMessage(err, "Error loading location assignments.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getAllEntity({ variables: filter });
  }, [filter, getAllEntity]);

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

  const columns: ColumnsType<Entity> = [
    {
      title: "Entity",
      dataIndex: "entity",
      key: "entity",
      render: (val, entity: Entity) => {
        return <EntityListing entity={entity} />
      },
      className: classes["font"]
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (val, entity: Entity) => `${entity?.type?.name}`,
      className: classes["font"],
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (val, entity: Entity) =>
        `${entity?.location?.name ? entity?.location?.name : ""}`,
      className: classes["font"],
    },

    {
      title: "",
      dataIndex: "action",
      key: "action",
      className: classes["font"],
      render: (val, entity: Entity) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <EditEntityLocation entity={entity} />
        </div>
      ),
    },
  ];

  const pageInfo = data?.getAllEntity.pageInfo ?? {};

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
      entityIds: selectedEntities.map((s) => s.id),
    });
    setPage(1);
  }, [selectedEntities]);

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
          <SearchEntities
            placeholder="Filter entity"
            rounded
            current={selectedEntities}
            onChange={(entity) => {
              const current = selectedEntities.map((s) => s.id);
              if (current.includes(entity.id)) return;
              setSelectedEntities([...selectedEntities, entity]);
            }}
            width={190}
            margin={filterMargin}
          />
          <Checkbox
            style={{ margin: filterMargin }}
            defaultChecked={locationExist}
            onChange={(e) => {
              setFilter({ ...filter, locationExist: e.target.checked });
              setPage(1);
            }}
          >
            Assigned only
          </Checkbox>
        </div>
        <div className={classes["option"]}>
          <LocationEntityBulkAssignment />
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
      {selectedEntities.length > 0 && (
        <div
          style={{
            display: "flex",
            opacity: 0.7,
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {selectedEntities.map((entity) => (
            <Tag
              key={entity.id}
              closable
              onClose={() =>
                setSelectedEntities(
                  selectedEntities.filter((s) => s.id !== entity.id)
                )
              }
              style={{ marginRight: "1rem" }}
            >
              {entity.machineNumber} ({entity.location?.name})
            </Tag>
          ))}
        </div>
      )}
      <Table
        rowKey="id"
        dataSource={data?.getAllEntity.edges.map(
          (edge: { node: Entity }) => edge.node
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
