import { useLazyQuery } from "@apollo/client";
import { Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { GET_ALL_SPARE_PR_OF_MACHINE } from "../../../../api/queries";
import PaginationButtons from "../../../../components/common/PaginationButtons/PaginationButtons";
import AddMachineSparePR from "../../../../components/MachineComponents/AddMachineSparePR/AddMachineSparePR";
import MachineSparePRCard from "../../../../components/MachineComponents/MachineSparePRCard/MachineSparePRCard";
import { errorMessage } from "../../../../helpers/gql";
import PaginationArgs from "../../../../models/PaginationArgs";
import SparePR from "../../../../models/Machine/MachineSparePR";
import classes from "./ViewSparePR.module.css";
import UserContext from "../../../../contexts/UserContext";

const ViewSparePR = ({
  machineID,
  isDeleted,
}: {
  machineID: number;
  isDeleted: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      machineId: number;
    }
  >({
    first: 3,
    last: null,
    before: null,
    after: null,
    search: "",
    machineId: machineID,
  });

  const [getAllSparePROfMachine, { data, loading }] = useLazyQuery(
    GET_ALL_SPARE_PR_OF_MACHINE,
    {
      onError: (err) => {
        errorMessage(err, "Error loading spare PR.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch spare pr when component mounts or when the filter object changes
  useEffect(() => {
    getAllSparePROfMachine({ variables: filter });
  }, [filter, getAllSparePROfMachine]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          first: 3,
          last: null,
          before: null,
          after: null,
        }));
        setPage(1);
      }, 500)
    );
  };
  const initialRender = useRef<boolean>(true);
  useEffect(() => {
    if (initialRender.current === true) {
      initialRender.current = false;
      return;
    }
    searchDebounced(search);
    // eslint-disable-next-line
  }, [search]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: 3,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 3,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.getAllSparePROfMachine.pageInfo ?? {};

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        {self.assignedPermission.hasMachineSparePRAdd && !isDeleted ?  (
          <AddMachineSparePR machineID={machineID} />
        ) : null}
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      <div className={classes["content"]}>
        {data?.getAllSparePROfMachine.edges.map((rec: { node: SparePR }) => {
          const sparePR = rec.node;
          return <MachineSparePRCard key={sparePR.id} sparePR={sparePR} isDeleted={isDeleted} />;
        })}
      </div>

      <PaginationButtons
        pageInfo={pageInfo}
        page={page}
        next={next}
        back={back}
        pageLimit={3}
      />
    </div>
  );
};

export default ViewSparePR;
