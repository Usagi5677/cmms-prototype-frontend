import { ArrowRightOutlined } from "@ant-design/icons";
import React from "react";
import { Entity } from "../../models/Entity/Entity";
import { EntityIcon } from "../common/EntityIcon";

export interface EntityListingProps {
  entity?: Entity;
}

export const EntityListing: React.FC<EntityListingProps> = ({ entity }) => {
  return (
    <div
      className="underlineOnHover"
      style={{ display: "flex", alignItems: "center" }}
    >
      <EntityIcon entityType={entity?.type?.entityType} />
      <a
        target="_blank"
        href={`/entity/${entity?.id}`}
        style={{ marginLeft: ".5rem" }}
      >
        {" "}
        {entity?.machineNumber} ({entity?.zone} - {entity?.location?.name}){" "}
        <ArrowRightOutlined />
      </a>
    </div>
  );
};
