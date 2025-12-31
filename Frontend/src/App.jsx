import { Route, Routes } from 'react-router-dom'
import SignIn from "./Components/Login";
import SignUp from "./Components/SignUp";
import Profile from "./Components/Profile"
import Home from "./Components/home"

function App() {

  return (
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<SignUp />} />
      </Routes>
  );
}

export default App;
