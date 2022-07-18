import { FaSearch, FaTimes } from "react-icons/fa";
import { ChangeEvent } from "react";

const Search = ({
  searchValue,
  onChange,
  onClick,
  margin,
}: {
  searchValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  margin?: string;
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
        border: "1px solid #ccc",
        borderRadius: 20,
        padding: 5,
        height: 32,
        paddingLeft: 10,
        width: 191,
        margin,
        alignItems: "center",
      }}
    >
      <FaSearch style={{ color: "#ccc", paddingRight: 5, fontSize: 20 }} />
      <input
        type="text"
        name=""
        id="SearchInput"
        placeholder="Search"
        value={searchValue}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      {searchValue !== "" && (
        <FaTimes
          style={{
            color: "#ccc",
            paddingRight: 10,
            cursor: "pointer",
            fontSize: 25,
            marginLeft: -25,
          }}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default Search;
