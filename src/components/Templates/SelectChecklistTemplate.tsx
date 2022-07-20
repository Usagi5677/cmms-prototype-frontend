import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, message, Modal, Row, Select, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { CHANGE_CHECKLIST_TEMPLATE } from "../../api/mutations";
import { CHECKLIST_TEMPLATES } from "../../api/queries";
import { errorMessage } from "../../helpers/gql";
import ChecklistTemplate from "../../models/ChecklistTemplate";
import Machine from "../../models/Machine";
import Transportation from "../../models/Transportation";

export interface SelectChecklistTemplateProps {
  entity: Machine | Transportation;
  entityType: "Machine" | "Transportation";
  type: "Daily" | "Weekly";
  value?: string;
}

export const SelectChecklistTemplate: React.FC<
  SelectChecklistTemplateProps
> = ({ entity, entityType, type, value = "" }) => {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const [searchChecklistTemplates, { loading }] = useLazyQuery(
    CHECKLIST_TEMPLATES,
    {
      onCompleted: (data) => {
        setTemplates(
          data?.checklistTemplates.edges.map(
            (edge: { node: ChecklistTemplate }) => edge.node
          )
        );
      },
      onError: (err) => {
        errorMessage(err, "Error while searching checklist templates.");
      },
    }
  );

  const [changeTemplate, { loading: changing }] = useMutation(
    CHANGE_CHECKLIST_TEMPLATE,
    {
      onCompleted: () => {
        message.success("Checklist updated.");
        handleCancel();
      },
      onError: (err) => {
        errorMessage(err, "Error updating checklist.");
      },
      refetchQueries: ["entityChecklistTemplate", "checklist"],
    }
  );

  useEffect(() => {
    if (visible) {
      fetchTemplates(value);
    }
  }, [visible]);

  useEffect(() => {
    //@ts-ignore
    if (value && templates?.find((template) => template?.id === value?.id)) {
      //@ts-ignore
      setTemplates((templates) => [...templates, value]);
    }
    // eslint-disable-next-line
  }, [value]);

  const fetchTemplates = (value: string) => {
    searchChecklistTemplates({
      variables: {
        search: value,
        type,
        first: 10,
      },
    });
  };

  const [timerId, setTimerId] = useState(null);

  const fetchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    //@ts-ignore
    setTimerId(setTimeout(() => fetchTemplates(value), 500));
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        className="primaryButton"
        shape="round"
        onClick={() => setVisible(true)}
      >
        Select From Template
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Select checklist template"
        destroyOnClose={true}
      >
        <Select
          showSearch
          value={selected}
          placeholder={"Select checklist template"}
          notFoundContent={loading ? <Spin size="small" /> : null}
          loading={loading}
          filterOption={false}
          onSearch={(value) => fetchDebounced(value)}
          onChange={(val) => setSelected(val)}
          style={{ width: "100%" }}
          allowClear
        >
          {templates
            ? templates.map((template: ChecklistTemplate) => (
                <Select.Option key={template.id} value={template.id}>
                  {template.name}
                </Select.Option>
              ))
            : null}
        </Select>
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
              loading={changing}
              className="primaryButton"
              onClick={() => {
                if (!selected) {
                  message.error("Please select a checklist template.");
                  return;
                }
                changeTemplate({
                  variables: {
                    input: {
                      entityId: entity.id,
                      entityType,
                      newChecklistId: selected,
                    },
                  },
                });
              }}
            >
              Select
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
