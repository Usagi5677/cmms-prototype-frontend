import { useMutation } from "@apollo/client";
import { message, Select } from "antd";
import { SET_ENTITY_BREAKDOWN_STATUS } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import EntityBreakdown from "../../../models/Entity/EntityBreakdown";
import { BreakdownStatus } from "../../../models/Enums";
import BreakdownStatusTag from "../../common/BreakdownStatusTag";

const EntityBreakdownStatus = ({
  breakdown,
  isDeleted,
}: {
  breakdown: EntityBreakdown;
  isDeleted?: boolean | undefined;
}) => {
  const [setEntityBreakdownStatus, { loading: settingStatus }] =
    useMutation(SET_ENTITY_BREAKDOWN_STATUS, {
      onCompleted: () => {
        message.success("Successfully updated breakdown status.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error occured.");
      },
      refetchQueries: [
        "getAllBreakdownOfEntity",
        "getSingleEntity",
        "getAllHistoryOfEntity",
      ],
    });

  return (
    <div
      style={{
        display: "flex",
        padding: "1px 5px 1px 5px",
        alignItems: "center",
        width: 150,
      }}
    >
      <Select
        showArrow
        loading={settingStatus}
        style={{ width: "100%" }}
        placeholder="Select status"
        value={breakdown?.status}
        onChange={(status) =>
          setEntityBreakdownStatus({
            variables: { id: breakdown?.id, status },
          })
        }
        disabled={isDeleted}
      >
        {(
          Object.keys(BreakdownStatus) as Array<keyof typeof BreakdownStatus>
        ).map((status: any) => (
          <Select.Option key={status} value={status}>
            <BreakdownStatusTag status={status} />
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default EntityBreakdownStatus;
