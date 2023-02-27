import { CloseCircleOutlined, ToolOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Divider, Tooltip } from "antd";
import moment from "moment";
import { FaRegClock, FaRegUser } from "react-icons/fa";
import { REMOVE_SPARE_PR_DETAIL } from "../../../api/mutations";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import { errorMessage } from "../../../helpers/gql";
import SparePRDetail from "../../../models/SparePRDetails";

import classes from "./SparePRDetailCard.module.css";
const SparePRDetailCard = ({
  sparePRDetail,
  isDeleted,
  hasPermission,
}: {
  sparePRDetail: SparePRDetail;
  isDeleted?: boolean;
  hasPermission?: boolean;
}) => {
  const [removeSparePRDetail, { loading }] = useMutation(
    REMOVE_SPARE_PR_DETAIL,
    {
      onError: (error) => {
        errorMessage(error, "Unexpected error while removing spare pr detail.");
      },
      refetchQueries: ["sparePRs", "getAllHistoryOfEntity"],
    }
  );
  return (
    <div className={classes["container"]}>
      <div className={classes["level-one"]}>
        <div style={{ fontSize: 14 }}>{sparePRDetail?.description}</div>
        {hasPermission && !isDeleted && (
          <CloseCircleOutlined
            style={{ color: "red" }}
            onClick={() => {
              removeSparePRDetail({
                variables: {
                  id: sparePRDetail?.id,
                },
              });
            }}
          />
        )}
      </div>
      <div className={classes["level-two"]}>
        <div
          className={classes["icon-text"]}
          title={`Breakdown Detail: ${sparePRDetail?.id}`}
        >
          <ToolOutlined />
          <div>{sparePRDetail?.id}</div>
        </div>
        <Divider className={classes["divider"]} type="vertical" />
        <div className={classes["icon-text"]} title={"Created By"}>
          <FaRegUser />
          <div>
            {sparePRDetail?.createdBy?.fullName} (
            {sparePRDetail?.createdBy?.rcno})
          </div>
        </div>
        <Divider className={classes["divider"]} type="vertical" />
        <div className={classes["icon-text"]} title="Created At">
            <FaRegClock />
            <span>
              {moment(sparePRDetail?.createdAt).format(DATETIME_FORMATS.SHORT)}
            </span>
          </div>
      </div>
    </div>
  );
};

export default SparePRDetailCard;
