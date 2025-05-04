import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllCountry from './pages/AllCountry';
import CountryDetails from "./pages/CountryDetails";
import Favorites from "./pages/Favorites";
import Home1 from "./pages/Home1";
import Login from "./pages/Login";
import FilterPage from "./pages/FilterPage";

export default function App() {
  return (
    <BrowserRouter>
       <Routes>
          <Route path="/" element={<Home1 />} />
          <Route path="/allCountry" element={<AllCountry />} />
          <Route path="/country/:code" element={<CountryDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/filter/:filterType" element={<FilterPage />} />
       </Routes>
    </BrowserRouter>
  )
}
