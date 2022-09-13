import { ArrowRightOutlined, CloseCircleOutlined } from "@ant-design/icons";
import React from "react";
import { Entity } from "../../models/Entity/Entity";
import { EntityIcon } from "../common/EntityIcon";

export interface EntityListingProps {
  entity?: Entity;
  noLink?: boolean;
  onClose?: () => void;
  style?: React.CSSProperties;
}

export const EntityListing: React.FC<EntityListingProps> = ({
  entity,
  noLink = false,
  onClose,
  style,
}) => {
  return (
    <div
      className={noLink ? undefined : "underlineOnHover"}
      style={{ ...style, display: "flex", alignItems: "center" }}
    >
      <EntityIcon entityType={entity?.type?.entityType} />
      {noLink ? (
        <span style={{ marginLeft: ".5rem" }}>
          {" "}
          {entity?.machineNumber} ({entity?.location?.name}){" "}
          <CloseCircleOutlined
            style={{ cursor: "pointer" }}
            onClick={onClose}
          />
        </span>
      ) : (
        <a
          target="_blank"
          href={`/entity/${entity?.id}`}
          style={{ marginLeft: ".5rem" }}
        >
          {" "}
          {entity?.machineNumber} ({entity?.location?.name}){" "}
          <ArrowRightOutlined />
        </a>
      )}
    </div>
  );
};
