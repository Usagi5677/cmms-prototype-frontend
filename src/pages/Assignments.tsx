import React, { useState } from "react";
import Search from "../components/common/Search";

export interface AssignmentsProps {}

export const Assignments: React.FC<AssignmentsProps> = ({}) => {
  const [search, setSearch] = useState("");
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "var(--card-bg)",
        borderRadius: 20,
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        padding: 10,
        border: "var(--card-border)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <Search
          searchValue={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
        />
        <div>
          {/* {hasPermissions(self, ["ADD_ROLE"]) ? <AddRole /> : null} */}
        </div>
      </div>
    </div>
  );
};
