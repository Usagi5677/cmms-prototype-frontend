import { useLazyQuery } from "@apollo/client";
import { Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { GET_ALL_PERIODIC_MAINTENANCE_OF_ENTITY } from "../../../../api/queries";
import PaginationButtons from "../../../../components/common/PaginationButtons/PaginationButtons";
import { errorMessage } from "../../../../helpers/gql";
import PaginationArgs from "../../../../models/PaginationArgs";
import classes from "./ViewPeriodicMaintenance.module.css";
import UserContext from "../../../../contexts/UserContext";
import AddEntityPeriodicMaintenance from "../../../../components/EntityComponents/AddEntityPeriodicMaintenance/AddEntityPeriodicMaintenance";
import EntityPeriodicMaintenanceCard from "../../../../components/EntityComponents/EntityPeriodicMaintenanceCard/EntityPeriodicMaintenanceCard";
import EntityPeriodicMaintenance from "../../../../models/Entity/EntityPeriodicMaintenance";
import { useParams } from "react-router";

const ViewPeriodicMaintenance = ({

  value,
  measurement,
  isDeleted,
}: {

  value?: number;
  measurement?: string;
  isDeleted?: boolean | undefined;
}) => {
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  const { id }: any = useParams();
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      entityId: number;
    }
  >({
    first: 5,
    last: null,
    before: null,
    after: null,
    search: "",
    entityId: parseInt(id),
  });

  const [getAllPeriodicMaintenanceOfEntity, { data, loading }] = useLazyQuery(
    GET_ALL_PERIODIC_MAINTENANCE_OF_ENTITY,
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
    getAllPeriodicMaintenanceOfEntity({ variables: filter });
  }, [filter, getAllPeriodicMaintenanceOfEntity]);

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
          first: 5,
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
      first: 5,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 5,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.getAllPeriodicMaintenanceOfEntity.pageInfo ?? {};

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}>
        {self.assignedPermission?.hasEntityPeriodicMaintenanceAdd &&
        !isDeleted ? (
          <AddEntityPeriodicMaintenance
            entityID={parseInt(id)}
            value={value}
            measurement={measurement}
          />
        ) : null}
      </div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      <div className={classes["content"]}>
        {data?.getAllPeriodicMaintenanceOfEntity.edges.map(
          (rec: { node: EntityPeriodicMaintenance }) => {
            const periodicMaintenance = rec.node;
            return (
              <EntityPeriodicMaintenanceCard
                key={periodicMaintenance.id}
                periodicMaintenance={periodicMaintenance}
                isDeleted={isDeleted}
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
        pageLimit={5}
      />
    </div>
  );
};

export default ViewPeriodicMaintenance;
