import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Restaurants from "./components/Restaurants";
import Posts from "./components/Posts";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import RestaurantDetail from './components/RestaurantDetail';
import MenuItems from './components/MenuItems';

const App: React.FC = () => {
  return (
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Đặt Header ở đây để luôn hiển thị trên mọi trang */}
          <Header />

          {/* Các route khác nhau */}
          <Routes>
            <Route path="/" element={<Hero />} /> 
            <Route path="/dashboard" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/menu" element={<MenuItems />} />
          </Routes>

          {/* Đặt Footer ở đây để luôn hiển thị trên mọi trang */}
          <Footer />
        </div>
      </Router>
  );
};

export default App;
