import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import LocationDetails from "./pages/LocationDetails";
import NotFound from "./pages/NotFound";
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/location/:id" element={<LocationDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;