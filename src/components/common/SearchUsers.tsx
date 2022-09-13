import { useLazyQuery } from "@apollo/client";
import { Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { GET_ALL_USERS } from "../../api/queries";
import User from "../../models/User";

export interface SearchUsersProps {
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

export const SearchUsers: React.FC<SearchUsersProps> = ({
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
  const [getAllUsers, { data: data, loading: searchLoading }] =
    useLazyQuery(GET_ALL_USERS);

  useEffect(() => {
    if (selected) {
      const user = data.getAllUsers.edges.find(
        (edge: { node: User }) => edge.node.id === selected
      ).node;
      if (user) {
        onChange(user);
        setSelected(null);
      }
    }
  }, [selected]);

  const fetchUsers = (value: string) => {
    if (value.length < 20) {
      getAllUsers({
        variables: {
          search: value,
          first: 10,
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

  const filtered = data?.getAllUsers.edges
    .map((edge: { node: User }) => edge.node)
    .filter((user: User) => {
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
