interface SearchButtonProps {
  handleSearch: () => void;
  disabled: boolean;
}

const SearchButton: React.FC<SearchButtonProps> = ({ handleSearch, disabled }) => (
  <button className="btn btn-primary w-full" onClick={handleSearch} disabled={disabled}>
    Search
  </button>
);

export default SearchButton;
