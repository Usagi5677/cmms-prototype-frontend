import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import { FC, useEffect, useState } from "react";
import { SEARCH_APS_QUERY } from "../../api/queries";
import User from "../../models/User";

interface SearchEmployeeProps {
  onChange?: any;
  allowClear?: any;
  onClear?: any;
  placeholder?: string;
  value?: any;
}

const SearchAPSUser: FC<SearchEmployeeProps> = ({
  onChange,
  allowClear,
  onClear,
  placeholder,
  value,
}) => {
  const [employees, setEmployees] = useState([]);

  const [selected, setSelected] = useState(null);

  const [searchEmployee, { data: searchData, loading: searchLoading }] =
    useLazyQuery(SEARCH_APS_QUERY);

  useEffect(() => {
    if (searchData) {
      setEmployees(
        searchData.searchAPSUsers.map((x: any) => ({
          id: x.id,
          userId: x.userId,
          fullName: x.fullName,
          rcno: x.rcno,
        }))
      );
    }
  }, [searchData]);

  useEffect(() => {
    //@ts-ignore
    if (value && employees?.find((emp) => emp?.id === value?.id)) {
      //@ts-ignore
      setEmployees((employees) => [...employees, value]);
    }
    // eslint-disable-next-line
  }, [value]);

  const handleChange = (value: any) => {
    setSelected(value);
    onChange(
      employees.find((x: any) => x.userId === value),
      () => {
        setSelected(null);
        setEmployees([]);
      }
    );
  };

  const fetchUser = (value: string) => {
    if (value.length > 1 && value.length < 20) {
      searchEmployee({
        variables: {
          query: value,
        },
      });
    }
  };

  const [timerId, setTimerId] = useState(null);

  const fetchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    //@ts-ignore
    setTimerId(setTimeout(() => fetchUser(value), 500));
  };

  return (
    <Select
      showSearch
      value={selected}
      placeholder={placeholder ?? "Select employee"}
      notFoundContent={searchLoading ? <Spin size="small" /> : null}
      loading={searchLoading}
      filterOption={false}
      onSearch={(value) => fetchDebounced(value)}
      onChange={handleChange}
      onClear={onClear}
      style={{ width: "100%" }}
      allowClear={allowClear ?? false}
    >
      {employees
        ? employees.map((emp: User) => (
            <Select.Option key={emp.id} value={emp.userId}>
              {emp.fullName} ({emp.rcno})
            </Select.Option>
          ))
        : null}
    </Select>
  );
};

export default SearchAPSUser;
