import { useMutation } from "@apollo/client";
import { message, Select } from "antd";
import { SET_MACHINE_BREAKDOWN_STATUS } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import Breakdown from "../../../models/Breakdown";
import { BreakdownStatus } from "../../../models/Enums";
import BreakdownStatusTag from "../../common/BreakdownStatusTag";

const MachineBreakdownStatus = ({ breakdown }: { breakdown: Breakdown }) => {
  const [setMachineBreakdownStatus, { loading: settingStatus }] = useMutation(
    SET_MACHINE_BREAKDOWN_STATUS,
    {
      onCompleted: () => {
        message.success("Successfully updated breakdown status.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error occured.");
      },
      refetchQueries: ["getAllBreakdownOfMachine", "getSingleMachine"],
    }
  );

  return (
    <div
      style={{
        display: "flex",
        border: "1px solid #ccc",
        borderRadius: 20,
        padding: "1px 5px 1px 5px",
        alignItems: "center",
        width: 150,
      }}
    >
      <Select
        showArrow
        loading={settingStatus}
        style={{ width: "100%" }}
        bordered={false}
        placeholder="Select status"
        value={breakdown?.status}
        onChange={(status) =>
          setMachineBreakdownStatus({
            variables: { id: breakdown?.id, status },
          })
        }
      >
        {(Object.keys(BreakdownStatus) as Array<keyof typeof BreakdownStatus>).map(
          (status: any) => (
            <Select.Option key={status} value={status}>
              <BreakdownStatusTag status={status} />
            </Select.Option>
          )
        )}
      </Select>
    </div>
  );
};

export default MachineBreakdownStatus;
