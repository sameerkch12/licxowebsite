import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import GoogleSearch from "@/components/GoogleSearch";
import AddRoom from "@/pages/AddRoom";
import ProfilePage from "./pages/Profile";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import FeedbackPage from "@/pages/feedback";
import SettingsPage from "@/pages/settings";
import LoginFlow from "./components/LoginFlow";
import ProtectedRoute from "./components/ProtectedRoute"; // ⭐ ADD THIS
import MyRoom from "./pages/MyRoom";
import ResultsPage from "./pages/ResultsPage";
import RoomDetail from "./components/RoomDetail";

function App() {
  return (
    <Routes>
      {/* -------------------- PUBLIC ROUTES -------------------- */}
      <Route path="/login" element={<LoginFlow />} />
      <Route path="/hotel/:id" element={<RoomDetail />} />
     
        <Route path="/results" element={<ResultsPage />} />

      {/* -------------------- PROTECTED ROUTES -------------------- */}
      <Route
        path="/"
        element={

          <IndexPage />

        }
      />

      {/* public informational pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />

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
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/myroom"
        element={
          <ProtectedRoute>
            <MyRoom />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
