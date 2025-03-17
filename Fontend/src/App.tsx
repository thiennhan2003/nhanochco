import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Restaurants from "./components/Restaurants";
import Posts from "./components/Posts";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import RestaurantsPage from './pages/RestaurantsPage'; // Import RestaurantsPage

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="restaurants" element={<RestaurantsPage />} /> {/* Add route for RestaurantsPage */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
