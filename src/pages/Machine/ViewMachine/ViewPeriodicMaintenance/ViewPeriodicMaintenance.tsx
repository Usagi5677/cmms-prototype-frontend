import { useLazyQuery } from "@apollo/client";
import { Spin } from "antd";
import { useEffect, useRef, useState } from "react";

import { GET_ALL_PERIODIC_MAINTENANCE_OF_MACHINE } from "../../../../api/queries";
import PaginationButtons from "../../../../components/common/PaginationButtons/PaginationButtons";
import AddMachinePeriodicMaintenance from "../../../../components/MachineComponents/AddMachinePeriodicMaintenance/AddMachinePeriodicMaintenance";
import MachinePeriodicMaintenanceCard from "../../../../components/MachineComponents/MachinePeriodicMaintenanceCard/MachinePeriodicMaintenanceCard";

import { errorMessage } from "../../../../helpers/gql";
import DefaultPaginationArgs from "../../../../models/DefaultPaginationArgs";

import PaginationArgs from "../../../../models/PaginationArgs";
import PeriodicMaintenance from "../../../../models/PeriodicMaintenance";
import classes from "./ViewPeriodicMaintenance.module.css";

const ViewPeriodicMaintenance = ({ machineID }: { machineID: number }) => {
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

  const [getAllPeriodicMaintenanceOfMachine, { data, loading }] = useLazyQuery(
    GET_ALL_PERIODIC_MAINTENANCE_OF_MACHINE,
    {
      onError: (err) => {
        errorMessage(err, "Error loading periodic maintenance.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch periodic maintenance when component mounts or when the filter object changes
  useEffect(() => {
    getAllPeriodicMaintenanceOfMachine({ variables: filter });
  }, [filter, getAllPeriodicMaintenanceOfMachine]);

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

  const pageInfo = data?.getAllPeriodicMaintenanceOfMachine.pageInfo ?? {};

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        <AddMachinePeriodicMaintenance machineID={machineID} />
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      <div className={classes["content"]}>
        {data?.getAllPeriodicMaintenanceOfMachine.edges.map(
          (rec: { node: PeriodicMaintenance }) => {
            const periodicMaintenance = rec.node;
            return (
              <MachinePeriodicMaintenanceCard
                key={periodicMaintenance.id}
                periodicMaintenance={periodicMaintenance}
              />
            );
          }
        )}
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

export default ViewPeriodicMaintenance;
