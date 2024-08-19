import './App.css';
import { Home } from './pages/Home.js';
import { NavBar } from './components/NavBar.js';
import { Footer } from './components/Footer.js';
import { SignIn } from './pages/SignIn.js';
import { FoodCategories } from './pages/FoodCategories.js';
import { Recipe } from './pages/Recipe';
import { AddRecipe } from './pages/AddRecipe';
import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom';

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
