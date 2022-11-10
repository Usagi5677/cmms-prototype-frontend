import { Collapse, Divider, Tooltip } from "antd";
import { useContext } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DELETE_ENTITY } from "../../../../api/mutations";
import { DeleteListing } from "../../../../components/common/DeleteListing";
import EntityStatusTag from "../../../../components/common/EntityStatusTag";
import EditEntity from "../../../../components/EntityComponents/EditEntity/EditEntity";
import EntityCard from "../../../../components/EntityComponents/EntityCard/EntityCard";
import UserContext from "../../../../contexts/UserContext";
import { isAssignedType } from "../../../../helpers/permissions";
import { useIsSmallDevice } from "../../../../helpers/useIsSmallDevice";
import { Entity } from "../../../../models/Entity/Entity";
import classes from "./ViewSubEntity.module.css";

const ViewSubEntity = ({
  entity,
  isDeleted,
}: {
  entity: Entity;
  isDeleted?: boolean;
}) => {
  return (
    <div id="subEntityCollapse">
      <Collapse
        ghost
        className={classes["container"]}
        defaultActiveKey={"subEntity"}
      >
        <Collapse.Panel
          key={"subEntity"}
          header={<div className={classes["header-title"]}>Sub Entity</div>}
        >
          <div className={classes["info-container"]}>
            {entity?.subEntities?.map((s: Entity, index: number) => (
              <EntityCard entity={s} key={s.id} />
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default ViewSubEntity;
