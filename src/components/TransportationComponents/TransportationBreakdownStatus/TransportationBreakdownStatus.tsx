import { useMutation } from "@apollo/client";
import { message, Select } from "antd";
import { SET_TRANSPORTATION_BREAKDOWN_STATUS } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import Breakdown from "../../../models/Transportation/TransportationBreakdown";
import { BreakdownStatus } from "../../../models/Enums";
import BreakdownStatusTag from "../../common/BreakdownStatusTag";

const TransportationBreakdownStatus = ({
  breakdown,
  isDeleted,
}: {
  breakdown: Breakdown;
  isDeleted: boolean | undefined;
}) => {
  const [setTransportationBreakdownStatus, { loading: settingStatus }] =
    useMutation(SET_TRANSPORTATION_BREAKDOWN_STATUS, {
      onCompleted: () => {
        message.success("Successfully updated breakdown status.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error occured.");
      },
      refetchQueries: [
        "getAllBreakdownOfTransportation",
        "getSingleTransportation",
        "getAllHistoryOfTransportation",
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
          setTransportationBreakdownStatus({
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

export default TransportationBreakdownStatus;
