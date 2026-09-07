import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const handleLogin = (newToken) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;