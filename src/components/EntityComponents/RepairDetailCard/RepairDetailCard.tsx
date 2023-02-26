import { CloseCircleOutlined, ToolOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Divider, Tooltip } from "antd";
import { memo, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { REMOVE_REPAIR, REMOVE_REPAIR_COMMENT } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import Comment from "../../../models/Comment";
import Repair from "../../../models/Entity/Repair";
import { CommentCard } from "../../common/CommentCard/CommentCard";

import { AddRepairComment } from "../AddRepairComment";
import classes from "./RepairDetailCard.module.css";
const RepairDetailCard = ({
  index,
  repair,
  isDeleted,
  hasPermission,
}: {
  index: number;
  repair: Repair;
  isDeleted?: boolean;
  hasPermission?: boolean;
}) => {
  const [removeRepair, { loading }] = useMutation(REMOVE_REPAIR, {
    onError: (error) => {
      errorMessage(error, "Unexpected error while removing repair detail.");
    },
    refetchQueries: ["repairs", "breakdowns", "getAllHistoryOfEntity"],
  });
  return (
    <div className={classes["container"]}>
      <div className={classes["level-one"]}>
        <div className={classes["detail-wrapper"]}>
          <div style={{ fontSize: 14 }}>{repair?.name}</div>
        </div>
        <div className={classes["actions"]}>
          <AddRepairComment repair={repair} isDeleted={isDeleted} />
          {hasPermission && (
            <CloseCircleOutlined
              style={{ color: "red" }}
              onClick={() => {
                removeRepair({
                  variables: {
                    id: repair?.id,
                  },
                });
              }}
            />
          )}
        </div>
      </div>

      <div className={classes["level-two"]}>
        <div
          className={classes["icon-text"]}
          title={`Breakdown Detail: ${repair?.breakdownDetail?.id}`}
        >
          <ToolOutlined />
          <div className={classes["text"]}>{repair?.id}</div>
        </div>
        <Divider className={classes["divider"]} type="vertical" />
        <div className={classes["icon-text"]} title={"Created By"}>
          <FaRegUser />
          <div className={classes["text"]}>
            {repair?.createdBy?.fullName} ({repair?.createdBy?.rcno})
          </div>
        </div>
      </div>
      {repair?.comments?.map((c: Comment) => (
        <CommentCard
          comment={c}
          isRemark
          key={c.id}
          isDeleted={isDeleted}
          mutation={REMOVE_REPAIR_COMMENT}
          refetchQueries={["repairs", "getAllHistoryOfEntity", "breakdowns"]}
        />
      ))}
    </div>
  );
};

export default memo(RepairDetailCard);
