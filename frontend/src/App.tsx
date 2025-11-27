import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import GoogleSearch from "@/components/GoogleSearch";
import AddRoom from "@/pages/AddRoom";
import ProfilePage from "./pages/Profile";
import LoginFlow from "./components/LoginFlow";
import ProtectedRoute from "./components/ProtectedRoute"; // ⭐ ADD THIS
import MyRoom from "./pages/MyRoom";

function App() {
  return (
    <Routes>
      {/* -------------------- PUBLIC ROUTES -------------------- */}
      <Route path="/login" element={<LoginFlow />} />

      {/* -------------------- PROTECTED ROUTES -------------------- */}
      <Route
        path="/"
        element={

          <IndexPage />

        }
      />

      <Route
        path="/addroom"
        element={
          <ProtectedRoute>
            <AddRoom />
          </ProtectedRoute>
        }
      />
      

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <GoogleSearch />
          </ProtectedRoute>
        }
      />

         <Route
        path="/myroom"
        element={
          <ProtectedRoute>
            <MyRoom/>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
