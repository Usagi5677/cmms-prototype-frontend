import React, { useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Tag,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaList } from "react-icons/fa";
import {
  ASSIGN_PERIODIC_MAINTENANCE_TEMPLATE,
  BULK_ASSIGN_PERIODIC_MAINTENANCE_TEMPLATE,
  DELETE_PERIODIC_MAINTENANCE,
  EDIT_PERIODIC_MAINTENANCE,
} from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import { ALL_ENTITY, ALL_TEMPLATE_OF_ORIGIN_PM } from "../../api/queries";
import { ArrowRightOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { SearchEntities } from "../common/SearchEntitities";
import { EntityIcon } from "../common/EntityIcon";
import { Entity } from "../../models/Entity/Entity";
import PeriodicMaintenance from "../../models/PeriodicMaintenance/PeriodicMaintenance";
import { AddPeriodicMaintenanceTask } from "../common/AddPeriodicMaintenanceTask";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { TypeSelector } from "../Config/Type/TypeSelector";
import { CenteredSpin } from "../common/CenteredSpin";
import PeriodicMaintenanceTaskList from "../common/PeriodicMaintenanceTaskList/PeriodicMaintenanceTaskList";

export interface PeriodicMaintenanceProps {
  periodicMaintenance: PeriodicMaintenance;
}

export const PeriodicMaintenanceTemplateDetails: React.FC<
  PeriodicMaintenanceProps
> = ({ periodicMaintenance }) => {
  const [visible, setVisible] = useState(false);
  const [checkbox, setCheckbox] = useState(periodicMaintenance?.recur);
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);
  const [form] = useForm();

  const [editPeriodicMaintenance, { loading }] = useMutation(
    EDIT_PERIODIC_MAINTENANCE,
    {
      onCompleted: () => {
        message.success("Successfully updated origin periodic maintenance.");
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while updating origin periodic maintenance."
        );
      },
      refetchQueries: ["periodicMaintenances", "getAllTemplatesOfOriginPM"],
    }
  );

  const [assignTemplate, { loading: assigning }] = useMutation(
    ASSIGN_PERIODIC_MAINTENANCE_TEMPLATE,
    {
      onCompleted: () => {
        message.success("Periodic maintenance template assigned.");
      },
      onError: (err) => {
        errorMessage(err, "Error while assigning template.");
      },
      refetchQueries: ["periodicMaintenances", "getAllTemplatesOfOriginPM"],
    }
  );

  const [bulkAssignTemplate, { loading: assigningTwo }] = useMutation(
    BULK_ASSIGN_PERIODIC_MAINTENANCE_TEMPLATE,
    {
      onCompleted: () => {
        message.success("Periodic maintenance template assigned.");
      },
      onError: (err) => {
        errorMessage(err, "Error while assigning template.");
      },
      refetchQueries: ["periodicMaintenances", "getAllTemplatesOfOriginPM"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    setSelectedEntities([]);
  };

  const [deletePeriodicMaintenance, { loading: deleting }] = useMutation(
    DELETE_PERIODIC_MAINTENANCE,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while deleting template.");
      },
      onCompleted: () => {
        message.success("Successfully removed template.");
      },
      refetchQueries: [
        "getAllHistoryOfEntity",
        "getAllEntityChecklistAndPMSummary",
        "periodicMaintenances",
        "getAllTemplatesOfOriginPM",
      ],
    }
  );

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

  const [getAllTemplatesOfOriginPM, { data, loading: loadingTemplate }] =
    useLazyQuery(ALL_TEMPLATE_OF_ORIGIN_PM, {
      onError: (err) => {
        errorMessage(err, "Error loading machinery/transports using template.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  useEffect(() => {
    if (visible) {
      getAllTemplatesOfOriginPM({ variables: { id: periodicMaintenance.id } });
    }
  }, [visible]);

  const onFinish = async (values: any) => {
    const { name, measurement, value, recur } = values;

    editPeriodicMaintenance({
      variables: {
        id: periodicMaintenance.id,
        name,
        measurement,
        value,
        recur,
      },
    });
  };

  const getUsedBy = (): Entity[] => {
    const used: any = [];
    if (data?.getAllTemplatesOfOriginPM) {
      data?.getAllTemplatesOfOriginPM?.map((pm: PeriodicMaintenance) => {
        used.push(pm.entity);
      });
    }
    return used;
  };

  const usedBy = getUsedBy();

  const onchange = (e: CheckboxChangeEvent) => {
    setCheckbox(e.target.checked);
  };

  return (
    <>
      <Button
        className="editButton"
        shape="round"
        onClick={() => setVisible(true)}
        size="small"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: ".5rem", fontSize: "90%" }}>Details</span>
          <FaList />
        </div>
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Periodic Maintenance Template: ${periodicMaintenance.name}`}
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
          preserve={false}
        >
          <Form.Item
            label={"Name"}
            name="name"
            required={false}
            initialValue={periodicMaintenance.name}
            rules={[
              {
                required: true,
                message: "Please enter the name.",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Measurement"
            name="measurement"
            required={false}
            initialValue={periodicMaintenance.measurement}
            rules={[
              {
                required: true,
                message: "Please select the measurement.",
              },
            ]}
          >
            <Select
              className="notRounded"
              showArrow
              placeholder="Select measurement"
              allowClear={true}
            >
              {["Hour", "Kilometer", "Day", "Week", "Month"].map(
                (measurement: string) => (
                  <Select.Option key={measurement} value={measurement}>
                    {measurement}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="recur"
            required={false}
            initialValue={periodicMaintenance?.recur}
            valuePropName="checked"
          >
            <Checkbox onChange={(e) => onchange(e)}>Recur</Checkbox>
          </Form.Item>
          {checkbox && (
            <Form.Item
              label={
                <>
                  Value
                  <span style={{ paddingLeft: 10, opacity: 0.5 }}>
                    For example, value = 3 will be every 3 hour / 3 km
                  </span>
                </>
              }
              name="value"
              required={false}
              initialValue={periodicMaintenance.value}
              rules={[
                {
                  required: true,
                  message: "Please enter the value.",
                },
              ]}
            >
              <InputNumber
                placeholder="Value"
                style={{ width: "100%" }}
                min={0}
              />
            </Form.Item>
          )}
          <Row justify="end" gutter={16}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="primaryButton"
              >
                Save
              </Button>
            </Form.Item>
          </Row>
        </Form>
        <Divider orientation="left">Tasks</Divider>
        <div style={{ maxHeight: 200, overflowY: "auto" }}>
          <PeriodicMaintenanceTaskList
            periodicMaintenance={periodicMaintenance}
            tasks={periodicMaintenance?.tasks!}
            level={0}
          />
        </div>
        <div style={{ marginTop: ".5rem", fontSize: 14 }}>
          <AddPeriodicMaintenanceTask
            periodicMaintenance={periodicMaintenance}
          />
        </div>

        <Divider orientation="left">Used By</Divider>
        {data?.getAllTemplatesOfOriginPM?.length === 0 ? (
          "No machines or transportation are using this template."
        ) : (
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {data?.getAllTemplatesOfOriginPM?.map((u: PeriodicMaintenance) => (
              <div
                key={u?.id}
                className="underlineOnHover"
                style={{ display: "flex", alignItems: "center" }}
              >
                <EntityIcon entityType={u?.entity?.type?.entityType} />
                <a
                  target="_blank"
                  href={`/entity/${u?.entity?.id}`}
                  style={{ marginLeft: ".5rem", flex: 1 }}
                >
                  {" "}
                  {u?.entity?.machineNumber} ({u?.entity?.location?.zone?.name}{" "}
                  - {u?.entity?.location?.name}) <ArrowRightOutlined />
                </a>
                <div>
                  <CloseCircleOutlined
                    onClick={() => {
                      deletePeriodicMaintenance({
                        variables: {
                          id: u.id,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: "1rem" }}>
          <SearchEntities
            changing={assigning}
            onChange={(entity) => {
              assignTemplate({
                variables: {
                  entityId: entity.id,
                  originId: periodicMaintenance.id,
                },
              });
            }}
            current={usedBy}
          />
        </div>
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
        <Row justify="end" gutter={16} style={{ marginTop: "1rem" }}>
          <Button
            type="ghost"
            onClick={handleCancel}
            className="secondaryButton"
          >
            Close
          </Button>
          <Col>
            <Button
              type="primary"
              loading={assigningTwo}
              className="primaryButton"
              onClick={() => {
                bulkAssignTemplate({
                  variables: {
                    entityIds: selectedEntities.map((e) => e.id),
                    originId: periodicMaintenance.id,
                  },
                });
              }}
            >
              Assign
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
