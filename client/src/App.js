// App.js
import './App.css';
import { Home } from './pages/Home';
import { NavBar } from './components/common/NavBar';
import { Footer } from './components/common/Footer';
import { SignIn } from './pages/SignIn';
import { FoodCategories } from './pages/FoodCategories';
import { Recipe } from './pages/Recipe';
import { AddRecipe } from './pages/AddRecipe';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar pageName="Home" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/foodCategories" element={<FoodCategories />} />
          <Route path="/recipe/:dishid" element={<Recipe />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/addRecipe" element={<AddRecipe />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
