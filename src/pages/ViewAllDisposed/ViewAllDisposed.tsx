import { Breadcrumb, Button, Empty, Result, Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PaginationArgs from "../../models/PaginationArgs";
import { errorMessage } from "../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import {
  ALL_ENTITY,
  GET_ALL_CHECKLIST_AND_PM_SUMMARY,
} from "../../api/queries";
import PaginationButtons from "../../components/common/PaginationButtons/PaginationButtons";
import classes from "./ViewAllDisposed.module.css";
import UserContext from "../../contexts/UserContext";
import { Entity } from "../../models/Entity/Entity";
import EntityCard from "../../components/EntityComponents/EntityCard/EntityCard";
import { hasPermissions } from "../../helpers/permissions";
import FilterOptions from "../../components/common/FilterOptions/FIlterOptions";
import {
  DefaultBooleanOptionProps,
  DefaultNumberArrayOptionProps,
  DefaultStringArrayOptionProps,
  EntityStatus,
  FilterOptionProps,
  SearchOptionProps,
  SearchReadingOptionProps,
  TypeSelectorOptionProps,
} from "../../models/Enums";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useLocalStorage } from "../../helpers/useLocalStorage";
import EntityStatusProgressBarV3 from "../../components/common/EntityStatusProgressBarV3/EntityStatusProgressBarV3";
import { NO_AUTH_MESSAGE_ONE } from "../../helpers/constants";

const ViewAllDisposed = () => {
  const getFilter = localStorage.getItem("disposeFilter");
  let getFilterObjects: any;
  if (getFilter) {
    getFilterObjects = JSON.parse(JSON.parse(getFilter));
  }
  const { user: self } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [timerId, setTimerId] = useState(null);
  const [search, setSearch] = useState(getFilterObjects?.search);
  const [locationIds, setLocationIds] = useState<number[]>(
    getFilterObjects?.locationIds
  );
  const [typeIds, setTypeIds] = useState<number[]>(getFilterObjects?.typeIds);
  const [zoneIds, setZoneIds] = useState<number[]>(getFilterObjects?.zoneIds);
  const [divisionIds, setDivisionIds] = useState<number[]>(
    getFilterObjects?.divisionIds
  );
  const [brandIds, setBrandIds] = useState<number[]>(
    getFilterObjects?.brandIds
  );
  const [engineIds, setEngineIds] = useState<number[]>(
    getFilterObjects?.engineIds
  );
  const [measurement, setMeasurement] = useState<string[]>(
    getFilterObjects?.measurement
  );
  const [isAssigned, setIsAssigned] = useState<boolean>(
    getFilterObjects?.isAssigned
  );
  //const [assignedToMe, setAssignedToMe] = useState<number | null>(null);
  const [lteInterService, setLteInterService] = useState(
    getFilterObjects?.lteInterService
  );
  const [gteInterService, setGteInterService] = useState(
    getFilterObjects?.gteInterService
  );
  const [isIncompleteChecklistTask, setIsIncompleteChecklistTask] =
    useState<boolean>(getFilterObjects?.isIncompleteChecklistTask);

  const [entityType, setEntityType] = useState<string[]>(
    getFilterObjects?.entityType
  );

  const [saveFilterOptions, setSaveFilterOptions] = useLocalStorage(
    "disposeFilter",
    JSON.stringify({
      first: 20,
      last: null,
      before: null,
      after: null,
      search: "",
      locationIds: [],
      status: ["Dispose"],
      entityType: [],
      typeIds: [],
      zoneIds: [],
      divisionIds: [],
      brandIds: [],
      engineIds: [],
      isAssigned: false,
      //assignedToId: null,
      measurement: [],
      lteInterService: "",
      gteInterService: "",
      isIncompleteChecklistTask: false,
    })
  );
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      status: EntityStatus[];
      locationIds: number[];
      entityType: string[];
      typeIds: number[];
      zoneIds: number[];
      divisionIds: number[];
      brandIds: number[];
      engineIds: number[];
      isAssigned: boolean;
      //assignedToId: number | null;
      measurement: string[];
      lteInterService: string;
      gteInterService: string;
      isIncompleteChecklistTask: boolean;
    }
  >({
    first: 20,
    last: null,
    before: null,
    after: null,
    search: JSON.parse(saveFilterOptions)?.search,
    locationIds: JSON.parse(saveFilterOptions)?.locationIds,
    status: ["Dispose" as EntityStatus],
    entityType: JSON.parse(saveFilterOptions)?.entityType,
    typeIds: JSON.parse(saveFilterOptions)?.typeIds,
    zoneIds: JSON.parse(saveFilterOptions)?.zoneIds,
    divisionIds: JSON.parse(saveFilterOptions)?.divisionIds,
    brandIds: JSON.parse(saveFilterOptions)?.brandIds,
    engineIds: JSON.parse(saveFilterOptions)?.engineIds,
    isAssigned: JSON.parse(saveFilterOptions)?.isAssigned,
    //assignedToId: null,
    measurement: JSON.parse(saveFilterOptions)?.measurement,
    lteInterService: JSON.parse(saveFilterOptions)?.lteInterService,
    gteInterService: JSON.parse(saveFilterOptions)?.gteInterService,
    isIncompleteChecklistTask:
      JSON.parse(saveFilterOptions)?.isIncompleteChecklistTask,
  });

  const [getAllEntityChecklistAndPMSummary, { data: summaryData }] =
    useLazyQuery(GET_ALL_CHECKLIST_AND_PM_SUMMARY, {
      onError: (err) => {
        errorMessage(err, "Error loading summary data.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    });

  const [getAllEntity, { data, loading }] = useLazyQuery(ALL_ENTITY, {
    onError: (err) => {
      errorMessage(err, "Error loading machines.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // Fetch when component mounts or when the filter object changes
  useEffect(() => {
    getAllEntity({ variables: filter });
    setSaveFilterOptions(JSON.stringify(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, getAllEntity]);

  // Debounce the search, meaning the search will only execute 500ms after the
  // last input. This prevents unnecessary API calls. useRef is used to prevent
  // this useEffect from running on the initial render (which would waste an API
  // call as well).
  const searchDebounced = (
    value: string,
    locationIdsValue: number[],
    typeIdsValue: number[],
    zoneIdsValue: number[],
    divisionIdsValue: number[],
    brandIdsValue: number[],
    engineIdsValue: number[],
    measurementValue: string[],
    isAssignedValue: boolean,
    //assignedToMeValue: number,
    lteInterServiceValue: string,
    gteInterServiceValue: string,
    isIncompleteChecklistTaskValue: boolean,
    entityTypeValue: string[]
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          locationIds: locationIdsValue,
          typeIds: typeIdsValue,
          zoneIds: zoneIdsValue,
          divisionIds: divisionIdsValue,
          brandIds: brandIdsValue,
          engineIds: engineIdsValue,
          measurement: measurementValue,
          isAssigned: isAssignedValue,
          //assignedToId: assignedToMeValue,
          lteInterService: lteInterServiceValue,
          gteInterService: gteInterServiceValue,
          isIncompleteChecklistTask: isIncompleteChecklistTaskValue,
          entityType: entityTypeValue,
          first: 20,
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
    searchDebounced(
      search,
      locationIds,
      typeIds,
      zoneIds,
      divisionIds,
      brandIds,
      engineIds,
      measurement,
      isAssigned,
      //assignedToMe!,
      lteInterService,
      gteInterService,
      isIncompleteChecklistTask,
      entityType
    );
    // eslint-disable-next-line
  }, [
    search,
    locationIds,
    typeIds,
    zoneIds,
    divisionIds,
    brandIds,
    engineIds,
    measurement,
    isAssigned,
    //assignedToMe,
    lteInterService,
    gteInterService,
    isIncompleteChecklistTask,
    entityType,
  ]);

  //Fetch all machine status count
  useEffect(() => {
    getAllEntityChecklistAndPMSummary();
  }, [filter, getAllEntityChecklistAndPMSummary]);

  // Pagination functions
  const next = () => {
    setFilter({
      ...filter,
      first: 20,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    });
    setPage(page + 1);
  };

  const back = () => {
    setFilter({
      ...filter,
      last: 20,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    });
    setPage(page - 1);
  };

  const pageInfo = data?.getAllEntity.pageInfo ?? {};

  const clearAll = () => {
    const clearFilter = {
      first: 20,
      last: null,
      before: null,
      after: null,
      search: "",
      locationIds: [],
      status: ["Dispose" as EntityStatus],
      entityType: [],
      typeIds: [],
      zoneIds: [],
      divisionIds: [],
      brandIds: [],
      engineIds: [],
      isAssigned: false,
      //assignedToId: null,
      measurement: [],
      lteInterService: "",
      gteInterService: "",
      isIncompleteChecklistTask: false,
    };
    setSaveFilterOptions(JSON.stringify(clearFilter));

    setSearch("");
    setLteInterService("");
    setGteInterService("");
    setLocationIds([]);
    setZoneIds([]);
    setDivisionIds([]);
    setBrandIds([]);
    setEngineIds([]);
    setMeasurement([]);
    setTypeIds([]);
    setIsAssigned(false);
    setIsIncompleteChecklistTask(false);
    setEntityType([]);
    //setAssignedToMe(null);
  };

  const searchOptions: SearchOptionProps = {
    searchValue: search,
    onChange: (e) => setSearch(e.target.value),
    onClick: () => setSearch(""),
    width: "100%",
  };
  const lteInterServiceOptions: SearchReadingOptionProps = {
    searchValue: lteInterService,
    onChange: (e) => setLteInterService(e.target.value),
    onClick: () => setLteInterService(""),
    width: "100%",
  };
  const gteInterServiceOptions: SearchReadingOptionProps = {
    searchValue: gteInterService,
    onChange: (e) => setGteInterService(e.target.value),
    onClick: () => setGteInterService(""),
    width: "100%",
  };
  const locationOptions: DefaultNumberArrayOptionProps = {
    setId: setLocationIds,
    currentId: locationIds,
    width: "100%",
  };
  const zoneOptions: DefaultNumberArrayOptionProps = {
    setId: setZoneIds,
    currentId: zoneIds,
    width: "100%",
  };
  const typeSelectorOptions: TypeSelectorOptionProps = {
    setTypeId: setTypeIds,
    currentId: typeIds,
    rounded: true,
    multiple: true,
    width: "100%",
  };
  const divisionOptions: DefaultNumberArrayOptionProps = {
    setId: setDivisionIds,
    currentId: divisionIds,
    width: "100%",
  };
  const brandOptions: DefaultNumberArrayOptionProps = {
    setId: setBrandIds,
    currentId: brandIds,
    width: "100%",
  };
  const engineOptions: DefaultNumberArrayOptionProps = {
    setId: setEngineIds,
    currentId: engineIds,
    width: "100%",
  };
  const measurementOptions: DefaultStringArrayOptionProps = {
    onChange: (measurement: string[]) => {
      setFilter({
        ...filter,
        measurement,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setMeasurement(measurement);
    },
    value: filter.measurement,
    width: "100%",
  };
  const assignedOptions: DefaultBooleanOptionProps = {
    onChange: (isAssigned: CheckboxChangeEvent) => {
      setFilter({
        ...filter,
        isAssigned: isAssigned?.target?.checked,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setIsAssigned(isAssigned?.target?.checked);
    },
    flag: filter.isAssigned,
    name: "Show all assigned entities",
  };
  const isIncompleteChecklistTaskOptions: DefaultBooleanOptionProps = {
    onChange: (isIncompleteChecklistTask: CheckboxChangeEvent) => {
      setFilter({
        ...filter,
        isIncompleteChecklistTask: isIncompleteChecklistTask?.target?.checked,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setIsIncompleteChecklistTask(isIncompleteChecklistTask?.target?.checked);
    },
    flag: filter.isIncompleteChecklistTask,
    name: "Show all entities with incomplete checklist",
  };

  const entityTypeOptions: DefaultStringArrayOptionProps = {
    onChange: (entityType: string[]) => {
      setFilter({
        ...filter,
        entityType,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setEntityType(entityType);
    },
    value: filter.entityType,
    width: "100%",
  };

  const filterOptions: FilterOptionProps = {
    searchOptions,
    locationOptions,
    typeSelectorOptions,
    zoneOptions,
    divisionOptions,
    brandOptions,
    engineOptions,
    measurementOptions,
    assignedOptions,
    lteInterServiceOptions,
    gteInterServiceOptions,
    isIncompleteChecklistTaskOptions,
    entityTypeOptions,
  };

  return !hasPermissions(self, ["VIEW_ALL_ENTITY"]) ? (
    <Result
      status="403"
      title="403"
      subTitle={NO_AUTH_MESSAGE_ONE}
      extra={
        <Button
          type="primary"
          onClick={() => `${window.open("https://helpdesk.mtcc.com.mv/")}`}
          style={{ borderRadius: 2 }}
        >
          Get Help
        </Button>
      }
    />
  ) : (
    <>
      <Breadcrumb style={{ marginBottom: 6 }}>
        <Breadcrumb.Item>
          <Link to={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Dispose</Breadcrumb.Item>
      </Breadcrumb>
      <EntityStatusProgressBarV3 name={"Dispose"} filter={filter} disposeView />
      <div className={classes["wrapper"]}>
        <div className={classes["container"]}>
          {loading && (
            <div>
              <Spin style={{ width: "100%", margin: "2rem auto" }} />
            </div>
          )}
          {data?.getAllEntity.edges.length > 0 ? (
            <div>
              {data?.getAllEntity.edges.map((rec: { node: Entity }) => {
                const entity = rec.node;
                return (
                  <EntityCard
                    entity={entity}
                    key={entity.id}
                    summaryData={summaryData?.getAllEntityChecklistAndPMSummary}
                  />
                );
              })}
            </div>
          ) : (
            <div
              style={{
                marginTop: 50,
              }}
            >
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          )}

          <PaginationButtons
            pageInfo={pageInfo}
            page={page}
            next={next}
            back={back}
            pageLimit={20}
          />
        </div>
        <FilterOptions
          options={filterOptions}
          onClick={clearAll}
          disposedView
        />
      </div>
    </>
  );
};

export default ViewAllDisposed;
