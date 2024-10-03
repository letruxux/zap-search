import { SearchIcon } from "../icons";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery }) => (
  <label className="input input-bordered flex items-center gap-2 mb-2">
    <input
      type="text"
      className="grow"
      placeholder="Search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
    <SearchIcon />
  </label>
);

export default SearchBar;
