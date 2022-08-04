import { useMutation } from "@apollo/client";
import { message, Select } from "antd";
import { SET_ENTITY_REPAIR_STATUS } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import EntityRepair from "../../../models/Entity/EntityRepair";
import { RepairStatus } from "../../../models/Enums";
import RepairStatusTag from "../../common/RepairStatusTag";

const EntityRepairStatus = ({
  repair,
  isDeleted,
}: {
  repair: EntityRepair;
  isDeleted?: boolean | undefined;
}) => {
  const [setEntityRepairStatus, { loading: settingStatus }] =
    useMutation(SET_ENTITY_REPAIR_STATUS, {
      onCompleted: () => {
        message.success("Successfully updated repair status.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error occured.");
      },
      refetchQueries: [
        "getAllRepairOfEntity",
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
        value={repair?.status}
        onChange={(status) =>
          setEntityRepairStatus({
            variables: { id: repair?.id, status },
          })
        }
        disabled={isDeleted}
      >
        {(Object.keys(RepairStatus) as Array<keyof typeof RepairStatus>).map(
          (status: any) => (
            <Select.Option key={status} value={status}>
              <RepairStatusTag status={status} />
            </Select.Option>
          )
        )}
      </Select>
    </div>
  );
};

export default EntityRepairStatus;
