import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaFlag, FaLanguage, FaMoneyBillWave, FaUsers, FaGlobe, FaArrowLeft } from "react-icons/fa";
import worldMapImage from "../assets/region2.jpeg"; // Import the image

function CountryDetailsPage() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        const data = await res.json();
        const fetchedCountry = data[0];
        setCountry(fetchedCountry);

        // Check if it's already a favorite
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(favorites.some((fav) => fav.cca3 === fetchedCountry.cca3));
      } catch (err) {
        console.error("Failed to fetch country details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!country) return <div className="flex justify-center items-center h-screen">Country not found.</div>;

  const formatNumber = (num) => num?.toLocaleString() ?? "N/A";
  const getLanguages = () => country.languages ? Object.values(country.languages).join(", ") : "N/A";
  const getCurrencies = () => country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(", ") : "N/A";
  const getNativeNames = () => country.name?.nativeName ? Object.values(country.name.nativeName).map(n => n.common).join(", ") : "N/A";

  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = favorites.find((fav) => fav.cca3 === country.cca3);

    if (!exists) {
      favorites.push(country);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    } else {
      const updated = favorites.filter((fav) => fav.cca3 !== country.cca3);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
    }
  };

  // Navigation menu items
  const menuItems = [
    { id: "overview", label: "Overview" },
    { id: "official-name", label: "Official Name" },
    { id: "capital", label: "Capital" },
    { id: "languages", label: "Languages" },
    { id: "religion", label: "Religion" },
    { id: "currencies", label: "Currencies" },
    { id: "subregion", label: "Subregion" },
    { id: "population", label: "Population" },
  ];

  // Top level categories
  const categories = [
    { id: "people", label: "People" },
    { id: "government", label: "Government - Politics" },
    { id: "geography", label: "Geography" },
    { id: "environment", label: "Environment & Climate" },
    { id: "economy", label: "Economy" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar - Navigation */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-center">
          {/* Back button added here */}
          <Link to="/allCountry" className="flex items-center text-gray-300 hover:text-white mb-4">
            <FaArrowLeft className="mr-2" />
            <span>Back to Countries</span>
          </Link>
          <img src={worldMapImage} alt="World Map" className="w-20 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Select a</p>
          <p className="text-xl font-semibold">Country</p>
        </div>

        <div className="px-4 py-2 border-b border-t border-gray-700">
          <h2 className="text-3xl font-bold">{country.name.common}</h2>
          <div className="w-full h-1 bg-yellow-500 mt-2"></div>
        </div>

        {/* Main Navigation Menu */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-2">
            <button 
              className={`w-full text-left p-3 pl-6 ${activeTab === "overview" ? "bg-gray-800" : ""} hover:bg-gray-800 flex items-center`}
              onClick={() => setActiveTab("overview")}
            >
              <span>Overview</span>
              <span className="ml-auto">▼</span>
            </button>
            
            {/* Submenu for Overview */}
            <div className="bg-gray-800">
              {menuItems.map((item) => (
                <button 
                  key={item.id}
                  className={`w-full text-left p-2 pl-10 text-sm hover:bg-gray-700 ${activeTab === item.id ? "font-semibold" : ""}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  - {item.label}
                </button>
              ))}
            </div>

            {/* Other categories */}
            {categories.map((category) => (
              <button 
                key={category.id}
                className="w-full text-left p-3 pl-6 hover:bg-gray-800 flex items-center"
                onClick={() => setActiveTab(category.id)}
              >
                <span>{category.label}</span>
                <span className="ml-auto">▶</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto in-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 pt-13">
       
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Location Information */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Where is {country.name.common} located?</h2>
            <p className="mb-4">What countries border {country.name.common}?</p>
            
            {/* Map */}
            <div className="relative border border-gray-300 rounded-lg overflow-hidden">
              {country.latlng && (
                <iframe
                  title="Google Map"
                  width="100%"
                  height="300"
                  loading="lazy"
                  className="rounded-md"
                  src={`https://maps.google.com/maps?q=${country.latlng[0]},${country.latlng[1]}&z=5&output=embed`}
                ></iframe>
              )}
            </div>
          </section>

          {/* Right Column - Flag Display */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{country.name.common} Flag</h2>
            
            {/* Flag Display */}
            <div className="flex flex-col items-center">
              <img 
                src={country.flags.svg || country.flags.png} 
                alt={`Flag of ${country.name.common}`} 
                className="w-full h-auto rounded shadow-md border border-gray-200"
              />
              
              {/* Favorite Button */}
              <button 
                onClick={handleFavorite} 
                className="mt-4 flex items-center text-red-500 hover:text-red-600"
              >
                {isFavorite ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            </div>
          </section>

          {/* Facts and Culture - Full Width */}
          <section className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-3xl font-semibold text-blue-600 mb-4">{country.name.common} Facts and Culture</h2>
            <p className="mb-6">What is {country.name.common} famous for?</p>
            
            <ul className="space-y-6">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <div>
                  <strong className="text-blue-500">Cultural Attributes:</strong> 
                  <span> {country.name.common} has a rich cultural heritage, which is reflected in its art, cuisine, and traditions.</span>
                  <a href="#" className="text-blue-500 ml-2">More</a>
                </div>
              </li>
              
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <div>
                  <strong className="text-blue-500">Family:</strong>
                  <span> Family structures and dynamics vary across the country, influenced by both tradition and modernity.</span>
                  <a href="#" className="text-blue-500 ml-2">More</a>
                </div>
              </li>
              
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <div>
                  <strong className="text-blue-500">Personal Appearance:</strong>
                  <span> The people of {country.name.common} often display distinctive fashion sense and personal presentation styles.</span>
                </div>
              </li>
            </ul>
            
            {/* Country Details Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaFlag className="text-blue-500 mr-2" />
                  <strong className="mr-2">Official Name:</strong> {country.name.official}
                </div>
                <div className="flex items-center">
                  <FaLanguage className="text-blue-500 mr-2" />
                  <strong className="mr-2">Languages:</strong> {getLanguages()}
                </div>
                <div className="flex items-center">
                  <FaMoneyBillWave className="text-blue-500 mr-2" />
                  <strong className="mr-2">Currencies:</strong> {getCurrencies()}
                </div>
                <div className="flex items-center">
                  <FaUsers className="text-blue-500 mr-2" />
                  <strong className="mr-2">Population:</strong> {formatNumber(country.population)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-blue-500 mr-2" />
                  <strong className="mr-2">Capital:</strong> {country.capital?.[0] || "N/A"}
                </div>
                <div className="flex items-center">
                  <FaGlobe className="text-blue-500 mr-2" />
                  <strong className="mr-2">Region:</strong> {country.region}
                </div>
                {country.subregion && (
                  <div className="flex items-center">
                    <FaGlobe className="text-blue-500 mr-2" />
                    <strong className="mr-2">Subregion:</strong> {country.subregion}
                  </div>
                )}
                <div className="flex items-center">
                  <FaGlobe className="text-blue-500 mr-2" />
                  <strong className="mr-2">Timezones:</strong> {country.timezones?.join(", ") || "N/A"}
                </div>
              </div>
            </div>
            
            {/* Additional Country Information */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3">Additional Information:</h3>
              <p className="mb-2">
                Learn more about {country.name.common}'s history, culture, and people.
              </p>
            </div>
            
            {/* Border Countries */}
            {country.borders?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Border Countries:</h3>
                <div className="flex flex-wrap gap-3">
                  {country.borders.map((b) => (
                    <Link 
                      key={b}
                      to={`/country/${b}`}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200 transition"
                    >
                      {b}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default CountryDetailsPage;