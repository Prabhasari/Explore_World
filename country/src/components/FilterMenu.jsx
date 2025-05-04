const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

function FilterMenu({ onSelectRegion }) {
  return (
    <select
      onChange={(e) => onSelectRegion(e.target.value)}
      className="w-full md:w-1/2 p-3 mb-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
    >
      <option value="">Filter by Region</option>
      {regions.map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </select>
  );
}
export default FilterMenu;
