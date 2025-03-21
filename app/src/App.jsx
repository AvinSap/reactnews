import Navbar from "./components/screens/generic/navbar/Navbar";
import Landing from "./components/screens/landing/Landing";
import Login from "./components/screens/login/Login";
import Register from "./components/screens/register/Register";
import ProtectedRoute from "./components/guard/ProtectedRoute";
import Profile from "./components/screens/profile/Profile";
import Admin from "./components/screens/admin/Admin";
import AllNews from "./components/screens/all-news/AllNews";
import SingleNews from "./components/screens/news-one/single-news/SingleNews";
import Footer from "./components/screens/generic/footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from '../utils/context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole={"admin"}>
                <Admin/>
              </ProtectedRoute>
            } 
          />
          <Route path="/news" element={<AllNews />} />
          <Route path="/news/:id" element={<SingleNews />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
