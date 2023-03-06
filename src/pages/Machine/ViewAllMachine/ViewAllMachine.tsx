import { Empty, message, Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginationArgs from "../../../models/PaginationArgs";
import { errorMessage } from "../../../helpers/gql";
import { useLazyQuery } from "@apollo/client";
import {
  ALL_ENTITY,
  GET_ALL_CHECKLIST_AND_PM_SUMMARY,
  GET_ALL_ENTITY_STATUS_COUNT,
} from "../../../api/queries";
import PaginationButtons from "../../../components/common/PaginationButtons/PaginationButtons";
import classes from "./ViewAllMachine.module.css";
import { useIsSmallDevice } from "../../../helpers/useIsSmallDevice";
import UserContext from "../../../contexts/UserContext";
import StatusCard from "../../../components/common/StatusCard/StatusCard";
import { FaCarCrash, FaTractor } from "react-icons/fa";
import AddEntity from "../../../components/EntityComponents/AddEntity/AddEntity";
import { Entity } from "../../../models/Entity/Entity";
import EntityCard from "../../../components/EntityComponents/EntityCard/EntityCard";
import { hasPermissions } from "../../../helpers/permissions";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import FilterOptions from "../../../components/common/FilterOptions/FIlterOptions";
import {
  DefaultBooleanOptionProps,
  DefaultNumberArrayOptionProps,
  DefaultStringArrayOptionProps,
  EntityStatus,
  EntityStatusOptionProps,
  FilterOptionProps,
  SearchOptionProps,
  SearchReadingOptionProps,
  TypeSelectorOptionProps,
} from "../../../models/Enums";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { WarningOutlined } from "@ant-design/icons";
import { useLocalStorage } from "../../../helpers/useLocalStorage";
import EntityStatusProgressBar from "../../../components/common/EntityStatusProgressBar/EntityStatusProgressBar";

const Machinery = () => {
  const getFilter = localStorage.getItem("machineryFilter");
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
  const [status, setStatus] = useState<EntityStatus[]>(
    getFilterObjects?.status
  );
  const [zoneIds, setZoneIds] = useState<number[]>(getFilterObjects?.zoneIds);
  const [divisionIds, setDivisionIds] = useState<number[]>(
    getFilterObjects?.divisionIds
  );
  const [brandIds, setBrandIds] = useState<number[]>(
    getFilterObjects?.brandIds
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
  const navigate = useNavigate();

  const [saveFilterOptions, setSaveFilterOptions] = useLocalStorage(
    "machineryFilter",
    JSON.stringify({
      first: 20,
      last: null,
      before: null,
      after: null,
      search: "",
      locationIds: [],
      status: [],
      entityType: ["Machine"],
      typeIds: [],
      zoneIds: [],
      divisionIds: [],
      brandIds: [],
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
    status: JSON.parse(saveFilterOptions)?.status,
    entityType: ["Machine"],
    typeIds: JSON.parse(saveFilterOptions)?.typeIds,
    zoneIds: JSON.parse(saveFilterOptions)?.zoneIds,
    divisionIds: JSON.parse(saveFilterOptions)?.divisionIds,
    brandIds: JSON.parse(saveFilterOptions)?.brandIds,
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
    if (
      self?.machineAssignments.length === 0 &&
      !hasPermissions(self, ["VIEW_ALL_ENTITY"]) &&
      !hasPermissions(self, ["VIEW_ALL_MACHINERY"]) &&
      !hasPermissions(self, ["VIEW_ALL_DIVISION_ENTITY"])
    ) {
      navigate("/");
      message.error(
        "You don't have permission to view all machinery and you're not assigned to a machine."
      );
    }

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
    statusValue: EntityStatus[],
    zoneIdsValue: number[],
    divisionIdsValue: number[],
    brandIdsValue: number[],
    measurementValue: string[],
    isAssignedValue: boolean,
    //assignedToMeValue: number,
    lteInterServiceValue: string,
    gteInterServiceValue: string,
    isIncompleteChecklistTaskValue: boolean
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
          status: statusValue,
          zoneIds: zoneIdsValue,
          divisionIds: divisionIdsValue,
          brandIds: brandIdsValue,
          measurement: measurementValue,
          isAssigned: isAssignedValue,
          //assignedToId: assignedToMeValue,
          lteInterService: lteInterServiceValue,
          gteInterService: gteInterServiceValue,
          isIncompleteChecklistTask: isIncompleteChecklistTaskValue,
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
      status,
      zoneIds,
      divisionIds,
      brandIds,
      measurement,
      isAssigned,
      //assignedToMe!,
      lteInterService,
      gteInterService,
      isIncompleteChecklistTask
    );
    // eslint-disable-next-line
  }, [
    search,
    locationIds,
    typeIds,
    status,
    zoneIds,
    divisionIds,
    brandIds,
    measurement,
    isAssigned,
    //assignedToMe,
    lteInterService,
    gteInterService,
    isIncompleteChecklistTask,
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
  const isSmallDevice = useIsSmallDevice();
  const filterMargin = isSmallDevice ? ".5rem 0 0 0" : ".5rem 0 0 .5rem";

  const clearAll = () => {
    const clearFilter = {
      first: 20,
      last: null,
      before: null,
      after: null,
      search: "",
      locationIds: [],
      status: [],
      entityType: ["Machine"],
      typeIds: [],
      zoneIds: [],
      divisionIds: [],
      brand: [],
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
    setStatus([]);
    setLocationIds([]);
    setZoneIds([]);
    setDivisionIds([]);
    setBrandIds([]);
    setMeasurement([]);
    setTypeIds([]);
    setIsAssigned(false);
    setIsIncompleteChecklistTask(false);
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
    entityType: "Machine",
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
    name: "Show all assigned machinery",
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
    name: "Show all machinery with incomplete checklist",
  };
  /*
  const assignedToMeOptions: DefaultBooleanOptionProps = {
    onChange: (assignedToMe: CheckboxChangeEvent) => {
      setFilter({
        ...filter,
        assignedToId: assignedToMe?.target?.checked ? self?.id : null,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setAssignedToMe(assignedToMe?.target?.checked ? self?.id : null);
    },
    name: "Show all machinery assigned to me",
  };
  */
  const entityStatusOptions: EntityStatusOptionProps = {
    onChange: (status) => {
      setFilter({
        ...filter,
        status: status,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setStatus(status);
    },
    value: filter.status,
    width: "100%",
  };

  const filterOptions: FilterOptionProps = {
    searchOptions,
    locationOptions,
    entityStatusOptions,
    typeSelectorOptions,
    zoneOptions,
    divisionOptions,
    brandOptions,
    measurementOptions,
    assignedOptions,
    //assignedToMeOptions,
    lteInterServiceOptions,
    gteInterServiceOptions,
    isIncompleteChecklistTaskOptions,
  };

  return (
    <>
      <EntityStatusProgressBar name={"Machinery"} filter={filter} />
      <div className={classes["wrapper"]}>
        <div className={classes["container"]}>
          <div className={classes["options-wrapper"]}>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                ease: "easeOut",
                duration: 0.3,
                delay: 0.8,
              }}
            >
              <div className={classes["item-wrapper"]}>
                {hasPermissions(self, ["ADD_ENTITY"]) ? (
                  <AddEntity entityType="Machine" />
                ) : null}
              </div>
            </motion.div>
          </div>
          {loading ? (
            <div>
              <Spin style={{ width: "100%", margin: "2rem auto" }} />
            </div>
          ) : data?.getAllEntity.edges.length > 0 ? (
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
        <FilterOptions options={filterOptions} onClick={clearAll} />
      </div>
    </>
  );
};

export default Machinery;
