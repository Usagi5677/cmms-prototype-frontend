import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Checkbox, Col, Divider, message, Modal, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { ASSIGN_ENTITY_TO_LOCATION } from "../../../api/mutations";
import { ALL_ENTITY } from "../../../api/queries";
import { errorMessage } from "../../../helpers/gql";
import { Entity } from "../../../models/Entity/Entity";
import { CenteredSpin } from "../../common/CenteredSpin";
import { SearchEntities } from "../../common/SearchEntitities";
import { LocationSelector } from "../../Config/Location/LocationSelector";
import { ZoneSelector } from "../../Config/Zone/ZoneSelector";

export interface LocationEntityBulkAssignmentProps {}

export const LocationEntityBulkAssignment: React.FC<
  LocationEntityBulkAssignmentProps
> = ({}) => {
  const [visible, setVisible] = useState(false);
  const [flag, setFlag] = useState(false);
  const [locationIds, setLocationIds] = useState<number[]>([]);
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

  const [assignEntityToLocation, { loading: assigning }] = useMutation(
    ASSIGN_ENTITY_TO_LOCATION,
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
          Location
        </Divider>
        <LocationSelector
          setLocationId={setLocationIds}
          currentId={locationIds}
          width="100%"
          rounded={false}
        />
        <Checkbox
          defaultChecked={flag}
          onChange={(e) => setFlag(e.target.checked)}
          style={{ marginTop: 20, marginBottom: 10}}
        >
          Transition finished
        </Checkbox>
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
                locationIds?.length === 0 || selectedEntities?.length === 0
              }
              loading={assigning}
              className="primaryButton"
              onClick={() => {
                assignEntityToLocation({
                  variables: {
                    input: {
                      entityIds: selectedEntities.map((e) => e.id),
                      locationId: locationIds,
                      transit: flag,
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
