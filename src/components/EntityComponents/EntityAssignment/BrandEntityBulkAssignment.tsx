import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, Divider, message, Modal, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { BULK_ASSIGN_BRAND_TO_ENTITY } from "../../../api/mutations";
import { ALL_ENTITY } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import { Entity } from "../../../models/Entity/Entity";
import { CenteredSpin } from "../../common/CenteredSpin";
import { SearchEntities } from "../../common/SearchEntitities";
import { BrandSelector } from "../../Config/Brand/BrandSelector";
import { LocationSelector } from "../../Config/Location/LocationSelector";
import { TypeSelector } from "../../Config/Type/TypeSelector";
import { ZoneSelector } from "../../Config/Zone/ZoneSelector";

export interface BrandEntityBulkAssignmentProps {}

export const BrandEntityBulkAssignment: React.FC<
  BrandEntityBulkAssignmentProps
> = ({}) => {
  const [visible, setVisible] = useState(false);
  const [brandIds, setBrandIds] = useState<number[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);

  const [getEntities, { loading: loadingEntities }] = useLazyQuery(ALL_ENTITY, {
    onCompleted: (data) => {
      const currentIds = selectedEntities.map((e) => e.id);
      const entities: Entity[] = data.getAllEntity.edges.map(
        (edge: { node: Entity }) => edge.node
      );
      const newEntities = entities.filter((e) => !currentIds.includes(e.id));
      setSelectedEntities([...selectedEntities, ...newEntities]);
    },
    onError: (err) => {
      errorMessage(err, "Error loading entities.");
    },
  });

  const [bulkAssignBrandToEntity, { loading: assigning }] = useMutation(
    BULK_ASSIGN_BRAND_TO_ENTITY,
    {
      onCompleted: (data) => {
        message.success("Successfully assigned");
      },
      onError: (err) => {
        errorMessage(err, "Unexpected error during bulk assignment.");
      },
      refetchQueries: ["getAllEntity"],
    }
  );

  const handleCancel = () => {
    setSelectedEntities([]);
    setVisible(false);
  };

  useEffect(() => {
    setSelectedEntities([]);
  }, []);

  return (
    <div>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        className="primaryButton"
      >
        Bulk Assignment
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Bulk Assignment"
        bodyStyle={{ paddingTop: "1rem" }}
      >
        <Divider style={{ marginTop: 0 }} orientation="left">
          Brand
        </Divider>
        <BrandSelector
          setBrandId={setBrandIds}
          currentId={brandIds}
          width="100%"
          rounded={false}
        />
        <Divider orientation="left">
          Entities
          {selectedEntities.length > 0 && (
            <Tag
              style={{ marginLeft: "1rem", cursor: "pointer" }}
              closable
              onClick={() => setSelectedEntities([])}
              onClose={() => setSelectedEntities([])}
            >
              Clear all entities
            </Tag>
          )}
        </Divider>
        <SearchEntities
          placeholder="Select entity"
          current={selectedEntities}
          onChange={(entity) => {
            const current = selectedEntities.map((s) => s.id);
            if (current.includes(entity.id)) return;
            setSelectedEntities([...selectedEntities, entity]);
          }}
        />
        <div style={{ marginTop: ".5rem" }}>
          <TypeSelector
            onChange={(typeId, clear) => {
              getEntities({
                variables: { first: 1000, typeIds: [typeId] },
              });
              clear();
            }}
            placeholder="Select all from type"
            width="100%"
          />
        </div>
        <div style={{ marginTop: ".5rem" }}>
          <ZoneSelector
            onChange={(zoneId, clear) => {
              getEntities({
                variables: { first: 1000, zoneIds: [zoneId] },
              });
              clear();
            }}
            placeholder="Select all from zone"
            width="100%"
          />
        </div>
        <div style={{ marginTop: ".5rem" }}>
          <LocationSelector
            onChange={(locationId, clear) => {
              getEntities({
                variables: { first: 1000, locationIds: [locationId] },
              });
              clear();
            }}
            placeholder="Select all from location"
            width="100%"
          />
        </div>
        <div
          style={{
            display: "flex",
            opacity: 0.7,
            marginTop: 10,
            flexWrap: "wrap",
            maxHeight: 200,
            overflowY: "auto",
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
              style={{ marginRight: ".5rem", marginTop: ".3rem" }}
            >
              {entity.machineNumber} ({entity.location?.name})
            </Tag>
          ))}
          {loadingEntities && <CenteredSpin />}
        </div>

        <Row justify="end" gutter={16} style={{ marginTop: "1rem" }}>
          <Col>
            <Button
              type="ghost"
              onClick={handleCancel}
              className="secondaryButton"
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              disabled={
                brandIds?.length === 0 || selectedEntities?.length === 0
              }
              loading={assigning}
              className="primaryButton"
              onClick={() => {
                bulkAssignBrandToEntity({
                  variables: {
                    input: {
                      entityIds: selectedEntities.map((e) => e.id),
                      brandId: brandIds,
                    },
                  },
                });
              }}
            >
              Assign
            </Button>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
