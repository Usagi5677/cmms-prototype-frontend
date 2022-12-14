import { useLazyQuery } from "@apollo/client";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { PERIODIC_MAINTENANCES_CALENDAR } from "../../api/queries";
import MaintenanceFilterOptions from "../../components/common/MaintenanceFilterOptions/MaintenanceFIlterOptions";
import UserContext from "../../contexts/UserContext";
import { DATETIME_FORMATS } from "../../helpers/constants";
import { errorMessage } from "../../helpers/gql";
import { useLocalStorage } from "../../helpers/useLocalStorage";
import {
  DefaultDateOptionProps,
  DefaultNumberArrayOptionProps,
  DefaultStringArrayOptionProps,
  FilterOptionProps,
  PeriodicMaintenanceStatus,
  PMStatusOptionProps,
  SearchOptionProps,
  SearchReadingOptionProps,
  TypeSelectorOptionProps,
} from "../../models/Enums";
import PaginationArgs from "../../models/PaginationArgs";
import PeriodicMaintenance from "../../models/PeriodicMaintenance/PeriodicMaintenance";
import classes from "./PeriodicMaintenancesCalendarView.module.css";

const PeriodicMaintenancesCalendarView = () => {
  const getFilter = localStorage.getItem("periodicMaintenancesCalendarFilter");
  let getFilterObjects: any;
  if (getFilter) {
    getFilterObjects = JSON.parse(JSON.parse(getFilter));
  }
  const [timerId, setTimerId] = useState(null);
  const [search, setSearch] = useState(getFilterObjects?.search);
  const [locationIds, setLocationIds] = useState<number[]>(
    getFilterObjects?.locationIds
  );
  const [type2Ids, setType2Ids] = useState<number[]>(
    getFilterObjects?.type2Ids
  );
  const [zoneIds, setZoneIds] = useState<number[]>(getFilterObjects?.zoneIds);
  const [divisionIds, setDivisionIds] = useState<number[]>(
    getFilterObjects?.divisionIds
  );
  const [measurement, setMeasurement] = useState<string[]>(
    getFilterObjects?.measurement
  );
  const [lteInterService, setLteInterService] = useState(
    getFilterObjects?.lteInterService
  );
  const [gteInterService, setGteInterService] = useState(
    getFilterObjects?.gteInterService
  );
  const [pmStatus, setPMStatus] = useState<PeriodicMaintenanceStatus[]>(
    getFilterObjects?.pmStatus
  );
  const [to, setTo] = useState<any>(moment(getFilterObjects?.to));
  const [from, setFrom] = useState<any>(moment(getFilterObjects?.from));

  const [saveFilterOptions, setSaveFilterOptions] = useLocalStorage(
    "periodicMaintenancesCalendarFilter",
    JSON.stringify({
      first: 20,
      last: null,
      before: null,
      after: null,
      search: "",
      locationIds: [],
      type2Ids: [],
      zoneIds: [],
      divisionIds: [],
      //assignedToId: null,
      measurement: [],
      lteInterService: "",
      gteInterService: "",
      pmStatus: [],
      from: moment(),
      to: moment(),
    })
  );
  // Filter has an intersection type as it has PaginationArgs + other args
  const [filter, setFilter] = useState<
    PaginationArgs & {
      search: string;
      locationIds: number[];
      type2Ids: number[];
      zoneIds: number[];
      divisionIds: number[];
      measurement: string[];
      lteInterService: string;
      gteInterService: string;
      pmStatus: PeriodicMaintenanceStatus[];
      from: any;
      to: any;
    }
  >({
    first: 20,
    last: null,
    before: null,
    after: null,
    search: JSON.parse(saveFilterOptions)?.search,
    locationIds: JSON.parse(saveFilterOptions)?.locationIds,
    type2Ids: JSON.parse(saveFilterOptions)?.type2Ids,
    zoneIds: JSON.parse(saveFilterOptions)?.zoneIds,
    divisionIds: JSON.parse(saveFilterOptions)?.divisionIds,
    measurement: JSON.parse(saveFilterOptions)?.measurement,
    lteInterService: JSON.parse(saveFilterOptions)?.lteInterService,
    gteInterService: JSON.parse(saveFilterOptions)?.gteInterService,
    pmStatus: JSON.parse(saveFilterOptions)?.pmStatus,
    from: JSON.parse(saveFilterOptions)?.from,
    to: JSON.parse(saveFilterOptions)?.to,
  });
  const [periodicMaintenancesCalendar, { data, loading }] = useLazyQuery(
    PERIODIC_MAINTENANCES_CALENDAR,
    {
      onError: (err) => {
        errorMessage(err, "Error loading calendar.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    periodicMaintenancesCalendar({ variables: filter });
    setSaveFilterOptions(JSON.stringify(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, periodicMaintenancesCalendar]);

  const searchDebounced = (
    value: string,
    locationIdsValue: number[],
    type2IdsValue: number[],
    zoneIdsValue: number[],
    divisionIdsValue: number[],
    measurementValue: string[],
    lteInterServiceValue: string,
    gteInterServiceValue: string,
    pmStatusValue: PeriodicMaintenanceStatus[],
    fromValue: any,
    toValue: any
  ) => {
    if (timerId) clearTimeout(timerId);
    setTimerId(
      //@ts-ignore
      setTimeout(() => {
        setFilter((filter) => ({
          ...filter,
          search: value,
          locationIds: locationIdsValue,
          type2Ids: type2IdsValue,
          zoneIds: zoneIdsValue,
          divisionIds: divisionIdsValue,
          measurement: measurementValue,
          lteInterService: lteInterServiceValue,
          gteInterService: gteInterServiceValue,
          pmStatus: pmStatusValue,
          from: fromValue,
          to: toValue,
          first: 20,
          last: null,
          before: null,
          after: null,
        }));
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
      type2Ids,
      zoneIds,
      divisionIds,
      measurement,
      lteInterService,
      gteInterService,
      pmStatus,
      from,
      to
    );
    // eslint-disable-next-line
  }, [
    search,
    locationIds,
    type2Ids,
    zoneIds,
    divisionIds,
    measurement,
    lteInterService,
    gteInterService,
    pmStatus,
    from,
    to,
  ]);

  function getDatesInRange(startDate: any, endDate: any) {
    const start = new Date(new Date(startDate));
    const end = new Date(new Date(endDate));

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }
  //console.log(data?.periodicMaintenancesCalendar);
  const days = getDatesInRange(from, to);
  const columns: ColumnsType<any> = [
    {
      title: "Machine Number",
      dataIndex: "machineNumber",
      key: "machineNumber",
      width: "10%",
      fixed: "left",
    },
    ...days.map((x: any) => {
      return {
        title: `${moment(x).format(DATETIME_FORMATS.DAY_MONTH)}`,
        dataIndex: `${moment(x).format(DATETIME_FORMATS.DAY_MONTH)}`,
        key: `${moment(x).format(DATETIME_FORMATS.DAY_MONTH)}`,
        width: "10%",
        render: (val: any, rec: any) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            {rec?.periodicMaintenances.map((p: PeriodicMaintenance) => {
              if (
                moment(p.createdAt).format(DATETIME_FORMATS.DAY_MONTH) ===
                moment(x).format(DATETIME_FORMATS.DAY_MONTH)
              ) {
                return (
                  <div
                    style={{
                      border: "1px solid var(--ant-primary-color)",
                      padding: 5,
                    }}
                    key={p.id}
                  >
                    {p.currentMeterReading}
                  </div>
                );
              }
            })}
          </div>
        ),
      };
    }),
  ];

  const clearAll = () => {
    const clearFilter = {
      first: 20,
      last: null,
      before: null,
      after: null,
      search: "",
      locationIds: [],
      typeIds: [],
      zoneIds: [],
      divisionIds: [],
      measurement: [],
      lteInterService: "",
      gteInterService: "",
      pmStatus: [],
    };
    setSaveFilterOptions(JSON.stringify(clearFilter));

    setSearch("");
    setLocationIds([]);
    setType2Ids([]);
    setZoneIds([]);
    setDivisionIds([]);
    setMeasurement([]);
    setLteInterService("");
    setGteInterService("");
    setPMStatus([]);
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
    setTypeId: setType2Ids,
    currentId: type2Ids,
    rounded: true,
    multiple: true,
    width: "100%",
  };
  const divisionOptions: DefaultNumberArrayOptionProps = {
    setId: setDivisionIds,
    currentId: divisionIds,
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

  const pmStatusOptions: PMStatusOptionProps = {
    onChange: (status) => {
      setFilter({
        ...filter,
        pmStatus: status,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setPMStatus(status);
    },
    value: filter.pmStatus,
    width: "100%",
  };

  const fromOptions: DefaultDateOptionProps = {
    onChange: (from: any) => {
      setFilter({
        ...filter,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setFrom(from);
    },
    value: from,
    width: "100%",
  };

  const toOptions: DefaultDateOptionProps = {
    onChange: (to: any) => {
      setFilter({
        ...filter,
        first: 20,
        after: null,
        last: null,
        before: null,
      });
      setTo(to);
    },
    value: to,
    width: "100%",
  };

  const filterOptions: FilterOptionProps = {
    searchOptions,
    locationOptions,
    typeSelectorOptions,
    zoneOptions,
    divisionOptions,
    measurementOptions,
    lteInterServiceOptions,
    gteInterServiceOptions,
    pmStatusOptions,
    fromOptions,
    toOptions,
  };

  return (
    <div className={classes["wrapper"]}>
      <div className={classes["calendar"]}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={data?.periodicMaintenancesCalendar.map((e: any) => e)}
          columns={columns}
          pagination={false}
          scroll={{ x: 1500, y: "70vh" }}
        />
      </div>
      <MaintenanceFilterOptions options={filterOptions} onClick={clearAll} />
    </div>
  );
};

export default PeriodicMaintenancesCalendarView;
