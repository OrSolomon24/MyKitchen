import './styles/tailwind.css';
import './styles/tokens.css';
import './styles/base.css';
import React, { Suspense, lazy } from 'react';
import { NavBar } from './components/common/NavBar';
import { BottomTabBar } from './components/common/BottomTabBar';
import { Footer } from './components/common/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import Loader from './components/Loader';
import 'react-toastify/dist/ReactToastify.css';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const SignIn = lazy(() => import('./pages/SignIn').then((m) => ({ default: m.SignIn })));
const FoodCategories = lazy(() =>
  import('./pages/FoodCategories').then((m) => ({ default: m.FoodCategories }))
);
const Recipe = lazy(() => import('./pages/Recipe').then((m) => ({ default: m.Recipe })));
const AddRecipe = lazy(() => import('./pages/AddRecipe').then((m) => ({ default: m.AddRecipe })));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App flex min-h-screen flex-col">
          <NavBar />
          <div className="page-content flex-1 pb-20 md:pb-0">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/" element={<Home />} />
                <Route path="/foodCategories" element={<ProtectedRoute><FoodCategories /></ProtectedRoute>} />
                <Route path="/recipe/:id" element={<ProtectedRoute><Recipe /></ProtectedRoute>} />
                <Route path="/addRecipe" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
          <BottomTabBar />
        </div>
      </Router>
      <ToastContainer position="bottom-center" autoClose={3000} rtl />
    </AuthProvider>
  );
}

export default App;
