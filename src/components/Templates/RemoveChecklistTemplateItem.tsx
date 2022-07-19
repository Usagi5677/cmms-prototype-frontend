import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Spin } from "antd";
import React from "react";
import { REMOVE_CHECKLIST_TEMPLATE_ITEM } from "../../api/mutations";
import { errorMessage } from "../../helpers/gql";
import ChecklistTemplateItem from "../../models/ChecklistTemplateItem";
import Machine from "../../models/Machine";
import Transportation from "../../models/Transportation";

export interface RemoveChecklistTemplateItemProps {
  item: ChecklistTemplateItem;
  templateId?: number;
  entity?: Machine | Transportation;
  entityType?: "Machine" | "Transportation";
}

export const RemoveChecklistTemplateItem: React.FC<
  RemoveChecklistTemplateItemProps
> = ({ item, templateId, entity, entityType }) => {
  const [removeItem, { loading }] = useMutation(
    REMOVE_CHECKLIST_TEMPLATE_ITEM,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while removing item.");
      },
      refetchQueries: ["checklistTemplate", "entityChecklistTemplate"],
    }
  );

  let variables: any = {
    id: item.id,
  };

  if (entityType && entity && templateId) {
    variables = {
      id: item.id,
      templateId,
      entityType,
      entityId: entity.id,
    };
  }

  return loading ? (
    <Spin size="small" />
  ) : (
    <CloseCircleOutlined
      style={{ color: "red" }}
      onClick={() => {
        removeItem({
          variables,
        });
      }}
    />
  );
};
