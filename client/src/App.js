import './App.css';
import { Home } from './pages/Home';
import { NavBar } from './components/common/NavBar';
import { Footer } from './components/common/Footer';
import { SignIn } from './pages/SignIn';
import { FoodCategories } from './pages/FoodCategories';
import { Recipe } from './pages/Recipe';
import { AddRecipe } from './pages/AddRecipe';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Home />} />
          <Route path="/foodCategories" element={<ProtectedRoute><FoodCategories /></ProtectedRoute>} />
          <Route path="/recipe/:dishid" element={<ProtectedRoute><Recipe /></ProtectedRoute>} />
          <Route path="/addRecipe" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
