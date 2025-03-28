import { useLazyQuery } from "@apollo/client";
import { Empty, Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { ALL_PERIODIC_MAINTENANCE } from "../../../../../api/queries";
import PaginationButtons from "../../../../../components/common/PaginationButtons/PaginationButtons";
import { errorMessage } from "../../../../../helpers/gql";
import PaginationArgs from "../../../../../models/PaginationArgs";
import classes from "./TemplatePeriodicMaintenances.module.css";
import UserContext from "../../../../../contexts/UserContext";
import { useParams } from "react-router";
import PeriodicMaintenance from "../../../../../models/PeriodicMaintenance/PeriodicMaintenance";
import PeriodicMaintenanceCard from "../../../../../components/EntityComponents/PeriodicMaintenanceCard/PeriodicMaintenanceCard";
import { Entity } from "../../../../../models/Entity/Entity";

const TemplatePeriodicMaintenances = ({
  isDeleted,
  entity,
}: {
  isDeleted?: boolean | undefined;
  entity: Entity;
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
      type: string;
    }
  >({
    first: 5,
    last: null,
    before: null,
    after: null,
    search: "",
    entityId: parseInt(id),
    type: "Template",
  });

  const [periodicMaintenances, { data, loading }] = useLazyQuery(
    ALL_PERIODIC_MAINTENANCE,
    {
      onError: (err) => {
        errorMessage(err, "Error loading template periodic maintenances.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  // Fetch periodic maintenance when component mounts or when the filter object changes
  useEffect(() => {
    periodicMaintenances({ variables: filter });
  }, [filter, periodicMaintenances, id]);

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
          entityId: parseInt(id),
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
  }, [search, id]);

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

  const pageInfo = data?.periodicMaintenances.pageInfo ?? {};

  return (
    <div className={classes["container"]}>
      <div className={classes["options"]}></div>
      {loading && (
        <div>
          <Spin style={{ width: "100%", margin: "2rem auto" }} />
        </div>
      )}
      <div className={classes["content"]}>
        {data?.periodicMaintenances.edges.length > 0 ? (
          <div>
            {data?.periodicMaintenances.edges.map(
              (rec: { node: PeriodicMaintenance }) => {
                const periodicMaintenance = rec.node;
                return (
                  <PeriodicMaintenanceCard
                    key={periodicMaintenance.id}
                    periodicMaintenance={periodicMaintenance}
                    isDeleted={isDeleted}
                    entity={entity}
                  />
                );
              }
            )}
          </div>
        ) : (
          <Empty />
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

export default TemplatePeriodicMaintenances;
