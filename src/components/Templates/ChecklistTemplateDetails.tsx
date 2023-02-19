import React, { useEffect, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Tag,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaList, FaLocationArrow } from "react-icons/fa";
import ChecklistTemplate from "../../models/ChecklistTemplate";
import {
  ADD_CHECKLIST_TEMPLATE_ITEM,
  BULK_ASSIGN_CHECKLIST_TEMPLATE,
  CHANGE_CHECKLIST_TEMPLATE,
  EDIT_CHECKLIST_TEMPLATE,
} from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import { ALL_ENTITY, CHECKLIST_TEMPLATE_DETAILS } from "../../api/queries";
import ChecklistTemplateItem from "../../models/ChecklistTemplateItem";
import { RemoveChecklistTemplateItem } from "./RemoveChecklistTemplateItem";
import { SearchEntities } from "../common/SearchEntitities";
import { Entity } from "../../models/Entity/Entity";
import { EntityListing } from "../EntityComponents/EntityListing";
import { TypeSelector } from "../Config/Type/TypeSelector";
import { CenteredSpin } from "../common/CenteredSpin";

export interface ChecklistTemplateDetailsProps {
  checklistTemplate: ChecklistTemplate;
}

export const ChecklistTemplateDetails: React.FC<
  ChecklistTemplateDetailsProps
> = ({ checklistTemplate }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [newItem, setNewItem] = useState("");
  const newItemInput = useRef<any>(null);
  const [newItemAdded, setNewItemAdded] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);

  useEffect(() => {
    if (visible) {
      getTemplateDetails({ variables: { id: checklistTemplate.id } });
    }
  }, [visible]);

  const [getTemplateDetails, { loading: loadingDetails, data: details }] =
    useLazyQuery(CHECKLIST_TEMPLATE_DETAILS, {
      onCompleted: () => {
        if (newItemAdded) {
          newItemInput.current.focus();
          setNewItemAdded(false);
        }
      },
      onError: (error) => {
        errorMessage(error, "Error loading template details.");
      },
      notifyOnNetworkStatusChange: true,
    });

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

  const [editChecklistTemplate, { loading }] = useMutation(
    EDIT_CHECKLIST_TEMPLATE,
    {
      onCompleted: () => {
        message.success("Successfully updated checklist template.");
      },
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while updating checklist template."
        );
      },
      refetchQueries: ["checklistTemplates"],
    }
  );

  const [addItem, { loading: addingItem }] = useMutation(
    ADD_CHECKLIST_TEMPLATE_ITEM,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while adding item.");
      },
      refetchQueries: ["checklistTemplate"],
    }
  );

  const submitNewItem = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") setNewItem("");
    else if (event.key === "Enter") {
      setNewItemAdded(true);
      event.preventDefault();
      if (newItem.trim() === "") return;
      setNewItem("");
      addItem({
        variables: {
          id: checklistTemplate.id,
          name: newItem,
        },
      });
    }
  };
  const onBtnClick = () => {
    if (newItem.trim() === "") return;
    setNewItem("");
    addItem({
      variables: {
        id: checklistTemplate.id,
        name: newItem,
      },
    });
  };
  const [changeTemplate, { loading: changing }] = useMutation(
    CHANGE_CHECKLIST_TEMPLATE,
    {
      onCompleted: () => {
        message.success("Checklist template updated.");
      },
      onError: (err) => {
        errorMessage(err, "Error updating checklist.");
      },
      refetchQueries: ["checklistTemplate"],
    }
  );

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    setSelectedEntities([]);
  };

  const onFinish = async (values: any) => {
    const { name, type } = values;

    editChecklistTemplate({
      variables: {
        input: {
          id: checklistTemplate.id,
          name,
          type,
        },
      },
    });
  };

  const getUsedBy = (): Entity[] => {
    const used = [];
    if (details) {
      const template = details.checklistTemplate;
      if (template.entitiesDaily) used.push(...template.entitiesDaily);
      if (template.entitiesWeekly) used.push(...template.entitiesWeekly);
    }
    return used;
  };
  const usedBy = getUsedBy();

  const [bulkAssignChecklistTemplate, { loading: assigning }] = useMutation(
    BULK_ASSIGN_CHECKLIST_TEMPLATE,
    {
      onCompleted: (data) => {
        message.success(data.bulkAssignChecklistTemplate);
      },
      onError: (err) => {
        errorMessage(err, "Unexpected error during bulk assignment.");
      },
      refetchQueries: ["checklistTemplate"],
    }
  );

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
        title={`Checklist Template: ${checklistTemplate.name}`}
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
            label="Name"
            name="name"
            required={false}
            initialValue={checklistTemplate.name}
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
            label="Type"
            name="type"
            required={false}
            initialValue={checklistTemplate.type}
            rules={[
              {
                required: true,
                message: "Please select a type.",
              },
            ]}
          >
            <Select
              className="notRounded"
              showArrow
              placeholder="Select type"
              allowClear={true}
            >
              {["Daily", "Weekly"].map((type: string) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
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
        {loadingDetails ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Spin />
          </div>
        ) : (
          <>
            <Divider orientation="left">Items</Divider>
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {details?.checklistTemplate.items.map(
                (item: ChecklistTemplateItem) => (
                  <div key={item.id} style={{ marginBottom: ".25rem" }}>
                    <RemoveChecklistTemplateItem item={item} /> {item.name}
                  </div>
                )
              )}
            </div>

            <Input.Group compact style={{ display: "flex" }}>
              <Input
                ref={newItemInput}
                type="text"
                placeholder={addingItem ? "Adding..." : "Add new item"}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={submitNewItem}
                disabled={addingItem}
                style={{
                  borderRadius: 5,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              />
              <div
                style={{
                  backgroundColor: "var(--ant-primary-color)",
                  color: "white",
                  height: 36,
                  width: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: loading ? "not-allowed" : "pointer",
                  borderRadius: 5,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                onClick={() => onBtnClick()}
              >
                <FaLocationArrow />
              </div>
            </Input.Group>
            <Divider orientation="left">Used By</Divider>
            {usedBy.length === 0 ? (
              "No machines or transportation are using this template."
            ) : (
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {usedBy.map((u: Entity) => (
                  <EntityListing key={u.id} entity={u} />
                ))}
              </div>
            )}
            <div style={{ marginTop: "1rem" }}>
              <SearchEntities
                changing={changing}
                onChange={(entity) => {
                  changeTemplate({
                    variables: {
                      input: {
                        entityId: entity.id,
                        newChecklistId: checklistTemplate.id,
                      },
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
          </>
        )}
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
              loading={assigning}
              className="primaryButton"
              onClick={() => {
                bulkAssignChecklistTemplate({
                  variables: {
                    entityIds: selectedEntities.map((e) => e.id),
                    newChecklistId: checklistTemplate.id,
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
