import { useMutation } from "@apollo/client";
import { message, Select } from "antd";
import { SET_TRANSPORTATION_SPARE_PR_STATUS } from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import { SparePRStatus } from "../../../models/Enums";
import SparePR from "../../../models/Transportation/TransportationSparePR";
import SparePRStatusTag from "../../common/SparePRStatusTag";

const TransportationSparePRStatus = ({
  sparePR,
  isDeleted,
}: {
  sparePR: SparePR;
  isDeleted: boolean | undefined;
}) => {
  const [setTransportationSparePRStatus, { loading: settingStatus }] =
    useMutation(SET_TRANSPORTATION_SPARE_PR_STATUS, {
      onCompleted: () => {
        message.success("Successfully updated spare PR status.");
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error occured.");
      },
      refetchQueries: [
        "getAllSparePROfTransportation",
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
        value={sparePR?.status}
        onChange={(status) =>
          setTransportationSparePRStatus({
            variables: { id: sparePR?.id, status },
          })
        }
        disabled={isDeleted}
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

export default TransportationSparePRStatus;
