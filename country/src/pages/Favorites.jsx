import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CountryCard from "../components/CountryCard";
import { getFavoriteCountries } from "../utils/favoriteUtils";
import Navbar from "../components/Navbar";
import { FaHeart, FaSearch, FaArrowLeft } from "react-icons/fa";
// Import background image if using that option
import worldMapBg from "../assets/world3.jpg"; // Update path to your image

function Favorites() {
  const [countries, setCountries] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Get username from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsername(user.username);
    }

    const favoriteCodes = getFavoriteCountries();
    
    if (favoriteCodes.length === 0) {
      setIsLoading(false);
      return;
    }

    fetch(
      `https://restcountries.com/v3.1/alpha?codes=${favoriteCodes.join(
        ","
      )}&fields=name,flags,region,population,capital,languages,cca3`
    )
      .then((res) => res.json())
      .then((data) => {
        setCountries(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching favorite countries:", error);
        setIsLoading(false);
      });
  }, []);

  // Filter countries based on search query
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // OPTION 1: Background color gradient
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 pt-16">

    {/* 
    // OPTION 2: Background image (uncomment to use)
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${worldMapBg})` }}
    >
    
    // OPTION 3: Pattern background with overlay (uncomment to use)
    <div className="min-h-screen relative bg-indigo-900 bg-opacity-90"
      style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }}
    >
    */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Container with translucent background for better readability */}
        <div className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          {/* Welcome message */}
          {username && (
            <div className="mb-4 flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Welcome back</p>
                <h2 className="text-xl font-semibold text-gray-800">
                  {username}
                </h2>
              </div>
            </div>
          )}

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-6 mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <FaHeart className="text-red-500 mr-3" />
                Your Favorite Countries
              </h1>
              <p className="text-gray-500 mt-2">
                Manage and explore your favorite countries
              </p>
            </div>
            
            {/* Search box */}
            <div className="relative max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search countries..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Countries grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : countries.length > 0 ? (
            <>
              <div className="mb-4 text-gray-500">
                {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'} in your favorites
              </div>
              
              {filteredCountries.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCountries.map((country) => (
                    <CountryCard key={country.cca3} country={country} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-2">No countries match your search.</p>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FaHeart className="text-gray-300 text-2xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No favorite countries yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start exploring countries and add them to your favorites list to see them here.
              </p>
              <Link
                to="/allCountry"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Explore Countries
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Favorites;