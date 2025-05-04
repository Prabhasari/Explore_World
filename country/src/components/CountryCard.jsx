import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isFavorite, toggleFavoriteCountry } from "../utils/favoriteUtils";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function CountryCard({ country }) {
  const [expanded, setExpanded] = useState(false);
  const [isFav, setIsFav] = useState(false);
  
  useEffect(() => {
    setIsFav(isFavorite(country.cca3));
  }, [country.cca3]);

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // prevent navigating when clicking heart
    const updated = toggleFavoriteCountry(country.cca3);
    setIsFav(updated.includes(country.cca3));
  };
  
  // Format population with commas
  const formatPopulation = (population) => {
    return population.toLocaleString();
  };

  // Get languages as a comma-separated string
  const getLanguages = () => {
    if (!country.languages) return "N/A";
    return Object.values(country.languages).join(", ");
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700 transform hover:scale-[1.02]"
    >
      {/* Flag Image with Overlay Gradient */}
      <Link to={`/country/${country.cca3}`} className="block relative h-48 overflow-hidden">
        <img 
          src={country.flags.svg || country.flags.png} 
          alt={`Flag of ${country.name.common}`}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h2 className="absolute bottom-3 left-4 right-4 text-white font-bold text-xl truncate">
          {country.name.common}
        </h2>
      </Link>
      
      {/* Basic Country Info */}
      <div className="p-4 flex-grow">
        <div className="flex items-start mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Capital</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {country.capital?.[0] || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-start mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Region</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {country.region || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-start mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Population</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {formatPopulation(country.population)}
            </p>
          </div>
        </div>

        {/* Expandable Details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Languages</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {getLanguages()}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Card Footer with Favorite Button */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            setExpanded(!expanded);
          }}
          className="text-sm text-blue-600 dark:text-blue-400 flex items-center hover:underline"
        >
          {expanded ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Less info
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              More info
            </>
          )}
        </button>
        
        <button
          onClick={handleFavoriteClick}
          className="group relative"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <span className="text-xl text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-transform duration-300 group-hover:scale-125 block">
            {isFav ? <FaHeart /> : <FaRegHeart />}
          </span>
          <span className="absolute opacity-0 group-hover:opacity-100 -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 whitespace-nowrap">
            {isFav ? "Remove favorite" : "Add favorite"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default CountryCard;