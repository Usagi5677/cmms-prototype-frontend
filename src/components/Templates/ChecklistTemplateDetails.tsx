import React, { useEffect, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { FaList } from "react-icons/fa";
import ChecklistTemplate from "../../models/ChecklistTemplate";
import {
  ADD_CHECKLIST_TEMPLATE_ITEM,
  CHANGE_CHECKLIST_TEMPLATE,
  EDIT_CHECKLIST_TEMPLATE,
} from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import { CHECKLIST_TEMPLATE_DETAILS } from "../../api/queries";
import ChecklistTemplateItem from "../../models/ChecklistTemplateItem";
import { RemoveChecklistTemplateItem } from "./RemoveChecklistTemplateItem";
import Machine from "../../models/Machine";
import Transportation from "../../models/Transportation";
import { ArrowRightOutlined } from "@ant-design/icons";
import { SearchEntities } from "../common/SearchEntitities";
import Entity from "../../models/Entity";
import { EntityIcon } from "../common/EntityIcon";

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

  const getUsedBy = (): [Machine[], Transportation[]] => {
    const usedMachines = [];
    const usedTransports = [];
    if (details) {
      const template = details.checklistTemplate;
      if (template.machinesDaily) usedMachines.push(...template.machinesDaily);
      if (template.machinesWeekly)
        usedMachines.push(...template.machinesWeekly);
      if (template.transportationsDaily)
        usedTransports.push(...template.transportationsDaily);
      if (template.transportationsWeekly)
        usedTransports.push(...template.transportationsWeekly);
    }
    return [usedMachines, usedTransports];
  };
  const usedBy = getUsedBy();

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
            <input
              ref={newItemInput}
              type="text"
              placeholder={addingItem ? "Adding..." : "Add new item"}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={submitNewItem}
              disabled={addingItem}
              style={{
                border: "solid 1px #e5e5e5",
                borderRadius: 5,
                padding: ".5rem",
                width: "100%",
              }}
            />
            <Divider orientation="left">Used By</Divider>
            {[...usedBy[0], ...usedBy[1]].length === 0 ? (
              "No machines or transportation are using this template."
            ) : (
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {usedBy[0].map((u) => (
                  <div
                    key={u.id}
                    className="underlineOnHover"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <EntityIcon entityType="Machine" />
                    <a
                      target="_blank"
                      href={`/machine/${u.id}`}
                      style={{ marginLeft: ".5rem" }}
                    >
                      {" "}
                      {u.machineNumber} ({u.zone} - {u.location}){" "}
                      <ArrowRightOutlined />
                    </a>
                  </div>
                ))}
                {usedBy[1].map((u) => (
                  <div
                    key={u.id}
                    className="underlineOnHover"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <EntityIcon
                      entityType="Transportation"
                      transportationType={u.transportType}
                    />
                    <a
                      target="_blank"
                      href={`/transportation/${u.id}`}
                      style={{ marginLeft: ".5rem" }}
                    >
                      {" "}
                      {u.machineNumber} ({u.location}) <ArrowRightOutlined />
                    </a>
                  </div>
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
                        entityId: entity.entityId,
                        entityType: entity.entityType,
                        newChecklistId: checklistTemplate.id,
                      },
                    },
                  });
                }}
                current={(() => {
                  const [machines, transports] = usedBy;
                  const entities: Entity[] = [];
                  for (const machine of machines) {
                    entities.push({
                      entityId: machine.id,
                      entityType: "Machine",
                      entityNo: machine.machineNumber,
                      machine: machine,
                    });
                  }
                  for (const transport of transports) {
                    entities.push({
                      entityId: transport.id,
                      entityType: "Transportation",
                      entityNo: transport.machineNumber,
                      transportation: transport,
                      transportationType: transport.transportType,
                    });
                  }
                  return entities;
                })()}
              />
            </div>
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
        </Row>
      </Modal>
    </>
  );
};
