import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function FilterPage() {
  const { filterType } = useParams();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Get the API endpoint from localStorage that was set in Home.jsx
      const apiEndpoint = localStorage.getItem("currentApiEndpoint");
      
      if (!apiEndpoint) {
        // Fallback in case endpoint wasn't stored
        setError("No API endpoint found. Please navigate from the home page.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
        }
        
        const data = await response.json();
        setCountries(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [filterType]);

  // Function to get display value based on filter type
  const getDisplayValue = (country) => {
    switch (filterType) {
      case "population":
        return country.population?.toLocaleString() || "N/A";
      case "capitals":
        return country.capital?.[0] || "N/A";
      case "region":
        return `${country.region || "N/A"}${country.subregion ? ` (${country.subregion})` : ""}`;
      case "languages":
        return country.languages 
          ? Object.values(country.languages).join(", ") 
          : "N/A";
      default:
        return "N/A";
    }
  };

  // Function to sort countries
  const sortCountries = () => {
    if (!countries.length) return [];
    
    const sorted = [...countries].sort((a, b) => {
      let valueA, valueB;
      
      switch (filterType) {
        case "population":
          valueA = a.population || 0;
          valueB = b.population || 0;
          return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
        
        case "capitals":
          valueA = a.capital?.[0] || "";
          valueB = b.capital?.[0] || "";
          return sortOrder === "asc" 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        
        case "region":
          valueA = a.region || "";
          valueB = b.region || "";
          return sortOrder === "asc" 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        
        case "languages":
          valueA = a.languages ? Object.values(a.languages).join(",") : "";
          valueB = b.languages ? Object.values(b.languages).join(",") : "";
          return sortOrder === "asc" 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        
        default:
          return 0;
      }
    });
    
    return sorted;
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Format filter type for display
  const formatFilterType = () => {
    return filterType.charAt(0).toUpperCase() + filterType.slice(1);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const sortedCountries = sortCountries();

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Countries by {formatFilterType()}
          </h1>
          
          <button
             onClick={toggleSortOrder}
             className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
          >
          <span>Sort {sortOrder === "asc" ? "↑" : "↓"}</span>
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedCountries.map((country) => (
            <div 
              key={country.name.common} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img 
                src={country.flags.svg || country.flags.png} 
                alt={`Flag of ${country.name.common}`}
                className="w-full h-48 object-cover"
              />
               <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {country.name.common}
                </h2>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">
                    {formatFilterType()}:
                  </span>
                  <span className="text-gray-800">
                    {getDisplayValue(country)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedCountries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No countries found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterPage;
