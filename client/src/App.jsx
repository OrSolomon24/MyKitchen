import './styles/tokens.css';
import './styles/base.css';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <div className="page-content">
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/" element={<Home />} />
              <Route path="/foodCategories" element={<ProtectedRoute><FoodCategories /></ProtectedRoute>} />
              <Route path="/recipe/:id" element={<ProtectedRoute><Recipe /></ProtectedRoute>} />
              <Route path="/addRecipe" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
      <ToastContainer position="bottom-center" autoClose={3000} rtl />
    </AuthProvider>
  );
}

export default App;
