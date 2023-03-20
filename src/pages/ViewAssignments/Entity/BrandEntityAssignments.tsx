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
import DefaultPaginationArgs from "../../../models/DefaultPaginationArgs";
import PaginationArgs from "../../../models/PaginationArgs";
import classes from "./DivisionEntityAssignments.module.css";
import { Entity } from "../../../models/Entity/Entity";
import { EntityListing } from "../../../components/EntityComponents/EntityListing";
import { SearchEntities } from "../../../components/common/SearchEntitities";
import Brand from "../../../models/Brand";
import { SearchBrands } from "../../../components/common/SearchBrands";
import EditEntityBrand from "./EditEntityBrand";
import { BrandEntityBulkAssignment } from "../../../components/EntityComponents/EntityAssignment/BrandEntityBulkAssignment";

export interface BrandEntityAssignmentsProps {}

export const BrandEntityAssignments: React.FC<
  BrandEntityAssignmentsProps
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
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);
  const [brandExist, setBrandExist] = useState<boolean>(true);
  const [filter, setFilter] = useState<
    PaginationArgs & {
      brandIds: number[];
      entityIds: number[];
      brandExist: boolean;
    }
  >({
    ...DefaultPaginationArgs,
    brandIds: [],
    entityIds: [],
    brandExist: brandExist,
  });

  const [getAllEntity, { data, loading }] = useLazyQuery(ALL_ENTITY, {
    onError: (err) => {
      errorMessage(err, "Error loading brand assignments.");
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
        return <EntityListing entity={entity} />;
      },
      className: classes["font"],
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (val, entity: Entity) => `${entity?.type?.name}`,
      className: classes["font"],
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (val, entity: Entity) =>
        `${entity?.brand?.name ? entity?.brand?.name : ""}`,
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
          <EditEntityBrand entity={entity} />
        </div>
      ),
    },
  ];

  const pageInfo = data?.getAllEntity.pageInfo ?? {};

  useEffect(() => {
    setFilter({
      ...filter,
      brandIds: selectedBrands.map((b) => b.id),
    });
    setPage(1);
  }, [selectedBrands]);

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
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <SearchBrands
            placeholder="Filter brand"
            rounded
            current={selectedBrands}
            onChange={(brand) => {
              const current = selectedBrands.map((s) => s.id);
              if (current.includes(brand.id)) return;
              setSelectedBrands([...selectedBrands, brand]);
            }}
            width={190}
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
          />
          <Checkbox
            defaultChecked={brandExist}
            onChange={(e) => {
              setFilter({ ...filter, brandExist: e.target.checked });
              setPage(1);
            }}
          >
            Assigned only
          </Checkbox>
        </div>
        <div className={classes["option"]}>
          <BrandEntityBulkAssignment />
        </div>
      </div>
      {selectedBrands.length > 0 && (
        <div
          style={{
            display: "flex",
            opacity: 0.7,
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {selectedBrands.map((d) => (
            <Tag
              key={d.id}
              closable
              onClose={() =>
                setSelectedBrands(selectedBrands.filter((s) => s.id !== d.id))
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
        style={{ marginTop: "1rem", marginBottom: "1rem", overflowX: "auto" }}
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
