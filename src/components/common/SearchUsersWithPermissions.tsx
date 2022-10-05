import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { GET_USERS_WITH_PERMISSION } from "../../api/queries";
import User from "../../models/User";

export interface SearchUsersWithPermissionsProps {
  type: string;
  onChange: (user: User) => void;
  allowClear?: any;
  onClear?: any;
  current?: User[];
  changing?: boolean;
  placeholder?: string;
  rounded?: boolean;
  width?: number;
  margin?: string;
}

export const SearchUsersWithPermissions: React.FC<
  SearchUsersWithPermissionsProps
> = ({
  type,
  onChange,
  allowClear,
  onClear,
  current,
  changing,
  placeholder = "Select user",
  rounded = false,
  width,
  margin,
}) => {
  const [selected, setSelected] = useState<null | number>(null);
  const [getAllUsers, { data: data, loading: searchLoading }] = useLazyQuery(
    GET_USERS_WITH_PERMISSION
  );

  useEffect(() => {
    if (selected) {
      const user = data.getUsersWithPermission.find(
        (user: User) => user.id === selected
      );
      if (user) {
        onChange(user);
        setSelected(null);
      }
    }
  }, [selected]);

  let typePermission: string;
  if (type === "Admin") typePermission = "ENTITY_ADMIN";
  else if (type === "Engineer") typePermission = "ENTITY_ENGINEER";
  else if (type === "Technician") typePermission = "ENTITY_TECHNICIAN";
  else if (type === "User") typePermission = "ENTITY_USER";

  const fetchUsers = (value: string) => {
    if (value.length < 20) {
      getAllUsers({
        variables: {
          search: value,
          permissions: [typePermission],
        },
      });
    }
  };

  const [timerId, setTimerId] = useState(null);

  const fetchDebounced = (value: string) => {
    if (timerId) clearTimeout(timerId);
    //@ts-ignore
    setTimerId(setTimeout(() => fetchUsers(value), 500));
  };

  const filtered = data?.getUsersWithPermission.filter((user: User) => {
    if (current) {
      for (const e of current) {
        if (e.id === user.id) {
          return false;
        }
      }
    }
    return true;
  });

  return (
    <Select
      showSearch
      value={selected}
      placeholder={changing ? "Adding..." : placeholder}
      notFoundContent={searchLoading ? <Spin size="small" /> : null}
      loading={searchLoading}
      filterOption={false}
      onSearch={(value) => fetchDebounced(value)}
      onChange={setSelected}
      onClear={onClear}
      style={{ width: width ?? "100%", margin }}
      allowClear={allowClear ?? true}
      className={rounded ? undefined : "notRounded"}
    >
      {data
        ? filtered.map((user: User) => (
            <Select.Option key={user.id} value={user.id}>
              {user.fullName} ({user.rcno})
            </Select.Option>
          ))
        : null}
    </Select>
  );
};
