import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const userData = cookies.get("userInfo");
  const firstName = userData?.firstName || "";
  const lastName = userData?.lastName || "";

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    cookies.remove("userInfo");
    handleMenuClose();
    navigate("/");
    window.location.reload();
  };

  return (
    <AppBar
      position="fixed"
      elevation={4}
      sx={{
        bgcolor: "#021227",
        zIndex: 1300,
        paddingX: 3,
      }}
    >
      <Toolbar
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        {/* Left: Sidebar toggle + Title */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={toggleSidebar} sx={{ color: "white", mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            ESCOM Wiki
          </Typography>
        </Box>

        {/* Center: Navigation Buttons */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            justifyContent: "center",
            gap: 4,
          }}
        >
          {[
            { label: "Home", id: "top" },
            { label: "Show Posts", id: "topics-section" },
            { label: "About Us", id: "who-we-are" },
          ].map((link, idx) => (
            <Typography
              key={idx}
              variant="body2"
              sx={{
                color: "white",
                cursor: "pointer",
                fontWeight: "medium",
                letterSpacing: 1,
                transition: "color 0.3s",
                "&:hover": { color: "#00aeff" },
              }}
              onClick={() => {
                const target = document.getElementById(link.id);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              {link.label}
            </Typography>
          ))}
        </Box>

        {/* Right: Profile Icon & Menu */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {userData && (
            <>
              <IconButton
                onClick={handleMenuOpen}
                sx={{ color: "white", fontSize: "17px" }}
              >
                Hi, {lastName}
                <AccountCircle sx={{ marginLeft: "8px", fontSize: "22px" }} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    minWidth: 180,
                  },
                }}
              >
                <MenuItem disabled>
                  <Typography variant="subtitle2">
                    👋 Hi, {firstName} {lastName}
                  </Typography>
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: "#d32f2f",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                    },
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
