import { useMutation } from "@apollo/client";
import { message, Select } from "antd";
import { SET_MACHINE_SPARE_PR_STATUS } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { SparePRStatus } from "../../../models/Enums";
import SparePR from "../../../models/SparePR";
import SparePRStatusTag from "../../common/SparePRStatusTag";

const MachineSparePRStatus = ({ sparePR }: { sparePR: SparePR }) => {
  const [setMachineSparePRStatus, { loading: settingStatus }] = useMutation(
    SET_MACHINE_SPARE_PR_STATUS,
    {
      onCompleted: () => {
        message.success("Successfully updated spare PR status.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error occured.");
      },
      refetchQueries: ["getAllSparePROfMachine"],
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
        value={sparePR?.status}
        onChange={(status) =>
          setMachineSparePRStatus({
            variables: { id: sparePR?.id, status },
          })
        }
      >
        {(Object.keys(SparePRStatus) as Array<keyof typeof SparePRStatus>).map(
          (status: any) => (
            <Select.Option key={status} value={status}>
              <SparePRStatusTag status={status} />
            </Select.Option>
          )
        )}
      </Select>
    </div>
  );
};

export default MachineSparePRStatus;
