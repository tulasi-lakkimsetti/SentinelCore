import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Assets from "./components/Assets";
import { AuthProvider } from "./context/AuthContext";
import Alerts from "./components/Alerts";
import AlertHistory from "./components/AlertHistory";
import Profile from "./components/Profile";
import ViewerDashboard from "./components/ViewerDashboard";
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
          <Route path="/alerts"
           element={<Alerts />}
          />
          <Route 
          path="/alert-history" 
          element={<AlertHistory />}
           />
           <Route path="/profile"
            element={<Profile />} 
            />
            <Route
  path="/viewer-dashboard"
  element={<ViewerDashboard />}
/>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;