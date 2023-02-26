import { CloseCircleOutlined, ToolOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Badge, Divider, Tooltip } from "antd";
import { memo, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import {
  REMOVE_BREAKDOWN_COMMENT,
  REMOVE_BREAKDOWN_DETAIL,
} from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import BreakdownDetail from "../../../models/BreakdownDetails";
import Comment from "../../../models/Comment";
import Breakdown from "../../../models/Entity/Breakdown";
import { CommentCard } from "../../common/CommentCard/CommentCard";
import { AddBreakdownComment } from "../AddBreakdownComment";
import { HoverAddRepairDetail } from "../HoverAddRepairDetail";
import classes from "./BreakdownDetailCard.module.css";
const BreakdownDetailCard = ({
  index,
  breakdown,
  detail,
  isDeleted,
  hasPermission,
}: {
  index: number;
  breakdown: Breakdown;
  detail: BreakdownDetail;
  isDeleted?: boolean;
  hasPermission?: boolean;
}) => {
  const [removeBreakdownDetail, { loading }] = useMutation(
    REMOVE_BREAKDOWN_DETAIL,
    {
      onError: (error) => {
        errorMessage(
          error,
          "Unexpected error while removing breakdown detail."
        );
      },
      refetchQueries: ["breakdowns", "getAllHistoryOfEntity"],
    }
  );
  return (
    <div className={classes["container"]}>
      <div className={classes["level-one"]}>
        <div className={classes["detail-wrapper"]}>
          {detail?.repairs?.length! > 0 && (
            <Tooltip
              color="var(--dot-tooltip)"
              title={
                <div>
                  <Badge color={"#52c41a"} text={"Repair added"} />
                </div>
              }
            >
              <Badge color={"#52c41a"} />
            </Tooltip>
          )}
          <div style={{ fontSize: 14 }}>{detail?.description}</div>
        </div>
        <div className={classes["actions"]}>
          <AddBreakdownComment
            breakdown={breakdown}
            detail={detail}
            isDeleted={isDeleted}
          />
          {hasPermission && (
            <HoverAddRepairDetail
            breakdownId={breakdown?.id}
            detail={detail}
            isDeleted={isDeleted}
          />
          )}
          {hasPermission && (
            <CloseCircleOutlined
              style={{ color: "red" }}
              onClick={() => {
                removeBreakdownDetail({
                  variables: {
                    id: detail?.id,
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
          title={`Breakdown Detail: ${detail?.id}`}
        >
          <ToolOutlined />
          <div className={classes["text"]}>{detail?.id}</div>
        </div>
        <Divider className={classes["divider"]} type="vertical" />
        <div className={classes["icon-text"]} title={"Created By"}>
          <FaRegUser />
          <div className={classes["text"]}>
            {detail?.createdBy?.fullName} ({detail?.createdBy?.rcno})
          </div>
        </div>
      </div>
      {detail?.comments?.map((remark: Comment) => (
        <CommentCard
          comment={remark}
          isRemark
          key={remark?.id}
          isDeleted={isDeleted}
          mutation={REMOVE_BREAKDOWN_COMMENT}
          refetchQueries={["breakdowns", "getAllHistoryOfEntity"]}
        />
      ))}
    </div>
  );
};

export default memo(BreakdownDetailCard);
