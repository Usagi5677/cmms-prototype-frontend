import { FaSearch, FaTimes } from "react-icons/fa";
import { ChangeEvent } from "react";

const Search = ({
  searchValue,
  onChange,
  onClick,
  margin,
  width,
  noIcon = false,
  name = "Search",
}: {
  searchValue: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  margin?: string;
  width?: number | string;
  noIcon?: boolean;
  name?: string;
}) => {
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      onClick();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        border: "1px solid var(--border-1)",
        borderRadius: 6,
        height: 32,
        width: width ? width : 192,
        margin,
        alignItems: "center",
      }}
      id="SearchInputWrapper"
    >
      {!noIcon && (
        <FaSearch
          style={{
            color: "#ccc",
            marginRight: 10,
            marginLeft: 10,
            fontSize: 16,
          }}
        />
      )}
      <input
        style={{ width: "100%", height:"100%", paddingLeft: noIcon ? 10 : 0, }}
        type="text"
        name=""
        id="SearchInput"
        placeholder={name}
        value={searchValue}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      {searchValue !== "" && (
        <FaTimes
          style={{
            color: "#ccc",
            marginLeft: 6,
            cursor: "pointer",
            fontSize: 16,
            marginRight: 6,
          }}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default Search;
