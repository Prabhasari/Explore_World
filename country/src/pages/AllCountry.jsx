import { useState, useEffect } from "react";
import CountryCard from "../components/CountryCard";
import SearchBar from "../components/SearchBar";
import FilterMenu from "../components/FilterMenu";
import Navbar from "../components/Navbar";

function AllCountry() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    let url = "https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,languages,cca3";
    
    if (searchTerm) {
      url = `https://restcountries.com/v3.1/name/${searchTerm}?fields=name,flags,capital,region,population,languages,cca3`;
    } else if (region) {
      url = `https://restcountries.com/v3.1/region/${region}?fields=name,flags,capital,region,population,languages,cca3`;
    }
    
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch countries");
        return res.json();
      })
      .then((data) => {
        setCountries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching countries:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [searchTerm, region]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-13">

      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Explore Countries
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover details about countries around the world - from populations and capitals to regional information
          </p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div className="md:w-2/3">
            <SearchBar onSearch={setSearchTerm} />
          </div>
          <div className="md:w-1/3">
            <FilterMenu onSelectRegion={setRegion} />
          </div>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">Loading countries...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => {setSearchTerm(""); setRegion("");}} 
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset search
            </button>
          </div>
        )}

        {/* Countries Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.length > 0 ? (
              countries.map((country) => (
                <CountryCard key={country.cca3} country={country} />
              ))
            ) : (
              <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No countries found matching your criteria.</p>
                <button 
                  onClick={() => {setSearchTerm(""); setRegion("");}} 
                  className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pagination placeholder - could be implemented as needed */}
        {countries.length > 20 && (
          <div className="mt-10 flex justify-center">
            <nav className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
              <div className="flex-1 flex justify-between">
                <button className="relative px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Previous
                </button>
                <button className="ml-3 relative px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Next
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Country data provided by the REST Countries API
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AllCountry;