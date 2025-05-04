import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Import your background images
import bg1 from "../assets/country1.jpg";
import bg2 from "../assets/country7.jpg";
import bg3 from "../assets/country3.jpg";
import bg4 from "../assets/country4.jpeg";
import bg5 from "../assets/country5.jpeg";
import bg6 from "../assets/country6.jpeg";

import food1 from "../assets/capital.jpg"; 
import food2 from "../assets/population.jpg"; 
import food3 from "../assets/flags.jpg"; 
import food4 from "../assets/speaking.jpg"; 

// Base URL for the REST Countries API
const API_BASE_URL = "https://restcountries.com/v3.1";

function Home() {
  const images = [bg1, bg2, bg3, bg4, bg5, bg6];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  // Handle slideshow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
        setAnimate(false);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Function to handle category navigation with API data
  const handleCategoryNavigation = (path, apiEndpoint) => {
    // Store the API endpoint in localStorage or context for the destination component
    localStorage.setItem('currentApiEndpoint', apiEndpoint);
    navigate(path);
  };

  // API endpoints for each category
  const categoryEndpoints = {
    population: `${API_BASE_URL}/all?fields=name,population,flags`,
    capitals: `${API_BASE_URL}/all?fields=name,capital,flags`,
    region: `${API_BASE_URL}/all?fields=name,region,subregion,flags`,
    languages: `${API_BASE_URL}/all?fields=name,languages,flags`
  };

  return (
    <div className="relative">
      <Navbar />

      {/* Hero Section with slideshow */}
<section
  className="h-[70vh] bg-cover bg-center flex flex-col justify-center items-center text-white text-center transition-all duration-1000 relative brightness-90 contrast-110"
  style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
>
  {/* Single dark transparent overlay */}
  <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-0"></div>

  <div className="z-20 px-4 w-full max-w-3xl">
    <h1 className="text-5xl font-extrabold mb-4">Explore Our World</h1>
    <p className="text-2xl font-light mb-4">Discover countries, cultures, and connections</p>
    <p className="max-w-xl mx-auto text-lg mb-6">
      Learn about nations around the globe - from flags and languages to populations and capitals. Your gateway to global knowledge starts here.
    </p>
    <div className="flex justify-center gap-4 mt-4">
      <button 
        onClick={() => handleCategoryNavigation("/allCountry", `${API_BASE_URL}/all`)} 
        className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
      >
        Explore Countries
      </button>
    </div>
  </div>
</section>


      {/* Feature Section: Country Facts */}
      <section className="py-12 px-6 md:px-16 bg-white">
        <h2 className="text-3xl font-bold mb-8 text-center">Explore Global Facts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-orange-500 text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-bold mb-2">195+</h3>
            <p className="text-gray-600">Countries around the world with unique cultures and histories</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-orange-500 text-4xl mb-4">🗣️</div>
            <h3 className="text-xl font-bold mb-2">7,000+</h3>
            <p className="text-gray-600">Languages spoken across different nations and regions</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-orange-500 text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold mb-2">5+</h3>
            <p className="text-gray-600">Continental regions with diverse geographical features</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-orange-500 text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">8+ Billion</h3>
            <p className="text-gray-600">People living across various nations and territories</p>
          </div>
        </div>
      </section>

      {/* Country Features Section - Replacement for Feature Highlight Sections */}
      <section className="py-12 px-6 md:px-16 bg-gray-50">
        <h2 className="text-3xl font-bold mb-8 text-center">Explore Countries By Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src={food1} 
              alt="Capital Cities" 
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="bg-white p-4">
              <h3 className="font-bold text-lg mb-2">Capital Cities</h3>
              <p className="text-gray-600">Explore the world's most iconic capital cities and their historical significance across continents.</p>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src={food2} 
              alt="Population Statistics" 
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="bg-white p-4">
              <h3 className="font-bold text-lg mb-2">Population Demographics</h3>
              <p className="text-gray-600">Discover population trends and demographics of countries from the most populous to the least.</p>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src={food3} 
              alt="National Flags" 
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="bg-white p-4">
              <h3 className="font-bold text-lg mb-2">National Flags</h3>
              <p className="text-gray-600">Explore the symbolism and design of national flags representing countries' histories and values.</p>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src={food4} 
              alt="World Languages" 
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="bg-white p-4">
              <h3 className="font-bold text-lg mb-2">World Languages</h3>
              <p className="text-gray-600">Discover the rich linguistic diversity across nations with over 7,000 languages worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section (using your existing design) */}
      <section className="py-12 px-6 md:px-16  bg-white relative">
        <h2 className="text-3xl font-bold mb-8 text-center">Explore Countries By</h2>
        
        <div className="flex flex-col lg:flex-row items-stretch relative">
          {/* Left Panel */}
          <div className="relative w-full lg:w-[60%] rounded-xl overflow-hidden border-2 border-orange-400 shadow-lg min-h-[500px]">
            <img src={bg4} alt="World Map" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 bg-black/30 h-full flex flex-col justify-center items-start p-8 space-y-4 text-white">
              <h3 className="text-3xl font-semibold text-orange-200">Countries Explorer</h3>
              <p className="max-w-md text-white">
                Discover fascinating information about nations,<br />
                their cultures, populations, and landmarks<br />
                with our comprehensive global database
              </p>
              <button 
  onClick={() => handleCategoryNavigation("/allCountry", `${API_BASE_URL}/all`)} 
  className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded font-semibold transition-colors"
>
  View All Countries
</button>

            </div>
          </div>

          {/* Category Buttons - Overlapping & Touchable */}
          <div className="w-full lg:w-[40%] absolute right-6 md:right-16 lg:top-1/2 lg:transform lg:-translate-y-1/2 mt-4 lg:mt-0 z-20 space-y-6">
            {[
              { 
                src: bg1, 
                label: 'Population', 
                path: '/filter/population',
                endpoint: categoryEndpoints.population
              },
              { 
                src: bg3, 
                label: 'Capitals', 
                path: '/filter/capitals',
                endpoint: categoryEndpoints.capitals
              },
              { 
                src: bg5, 
                label: 'Region', 
                path: '/filter/region',
                endpoint: categoryEndpoints.region
              },
              { 
                src: bg6, 
                label: 'Languages', 
                path: '/filter/languages',
                endpoint: categoryEndpoints.languages
              },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => handleCategoryNavigation(item.path, item.endpoint)}
                className="flex items-center w-full bg-[#161179] text-white rounded overflow-hidden shadow-lg h-24 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <img src={item.src} alt={item.label} className="w-24 h-24 object-cover" />
                <span className="flex-1 text-center font-medium text-xl">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* App Features Section */}
      <section className="py-12 px-6 md:px-16 bg-white text-center">
        <h2 className="text-3xl font-bold mb-12">Application Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-3">Country Search</h3>
            <p className="text-gray-600">
              Find any country by name, explore its details, and learn about its geography, population, and culture.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🌍</div>
            <h3 className="text-xl font-bold mb-3">Region Filters</h3>
            <p className="text-gray-600">
              Browse countries by continent or region and discover the diversity within geographical areas.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🏛️</div>
            <h3 className="text-xl font-bold mb-3">Detailed Information</h3>
            <p className="text-gray-600">
              Access comprehensive data including capitals, languages, currencies, and population statistics.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 px-6 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h4 className="font-bold mb-2">Navigation</h4>
            <ul className="space-y-1">
              <li className="cursor-pointer hover:text-orange-300">Home</li>
              <li className="cursor-pointer hover:text-orange-300">All Countries</li>
              <li className="cursor-pointer hover:text-orange-300">Regions</li>
              <li className="cursor-pointer hover:text-orange-300">Search</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Categories</h4>
            <ul className="space-y-1">
              <li className="cursor-pointer hover:text-orange-300">By Population</li>
              <li className="cursor-pointer hover:text-orange-300">By Region</li>
              <li className="cursor-pointer hover:text-orange-300">By Languages</li>
              <li className="cursor-pointer hover:text-orange-300">By Capitals</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Project Info</h4>
            <ul className="space-y-1">
              <li className="cursor-pointer hover:text-orange-300">About</li>
              <li className="cursor-pointer hover:text-orange-300">Technologies</li>
              <li className="cursor-pointer hover:text-orange-300">REST Countries API</li>
              <li className="cursor-pointer hover:text-orange-300">GitHub Repo</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Follow Us</h4>
            <div className="flex space-x-4 mt-2">
              <span className="text-xl cursor-pointer hover:text-orange-300">🌐</span>
              <span className="text-xl cursor-pointer hover:text-orange-300">📸</span>
              <span className="text-xl cursor-pointer hover:text-orange-300">🐦</span>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center text-xs text-gray-400">&copy; 2025 Countries Explorer</div>
      </footer>
    </div>
  );
}

export default Home;