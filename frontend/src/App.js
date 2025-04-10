import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./page/Dashboard.js";
import Signup from "./page/Signup.js";
import Login from "./page/Login.js";
import EditorPage from "./page/EditorPage.js";
import Reset from "./page/Reset.js";
import ResetSecurity from "./page/ResetSecurity.js";
import Navbar from "./components/Navbar.js";
import Sidebar from "./components/Sidebar.js";
import ReportsPage from "./page/ReportsPage.js";
import Footer from "./components/Footer.js";
import ViewPost from "./page/ViewPost.js";
import { Box } from "@mui/material";

function Layout({ isSidebarOpen, toggleSidebar, children }) {
  const location = useLocation();

  // Hide sidebar & navbar on authentication pages
  const hideSidebarAndNavbar = ["/login", "/signup", "/reset", "/security"].includes(location.pathname);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!hideSidebarAndNavbar && <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {!hideSidebarAndNavbar && <Sidebar isOpen={isSidebarOpen} />}
        <Box sx={{ flexGrow: 1, paddingTop: hideSidebarAndNavbar ? 0 : "64px", width: "100%" }}>
          {children}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/editor" element={<EditorPage isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/post" element={<ViewPost />} />
          <Route path="/security" element={<ResetSecurity />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
