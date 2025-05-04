function SearchBar({ onSearch }) {
    return (
      <input
        type="text"
        placeholder="Search countries..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full md:w-1/2 p-3 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />
    );
  }
  export default SearchBar;
  