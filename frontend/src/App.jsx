import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Assets from "./components/Assets";
import { AuthProvider } from "./context/AuthContext";
import AlertHistory from "./components/AlertHistory";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/assets"
            element={<Assets />}
          />
          <Route 
          path="/alert-history" 
          element={<AlertHistory />}
           />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;