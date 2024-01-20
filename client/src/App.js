import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./views/homePage/homePage";
import ProfilePage from "./views/profilePage/profilePage";
import LoginPage from "./views/loginPage/loginPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
