import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Toolbar,
  Button,
  Box,
  Typography,
  ListItemIcon,
} from "@mui/material";
import {
  Dashboard,
  Edit,
  Logout,
  Description,
  Login,
  Article,
  HelpOutline,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "universal-cookie";
import Axios from "axios";
import env from "../config/env";

const sidebarReports = [
  { name: "Test 1", path: "/report-a1" },
  { name: "Test 2", path: "/report-a2" },
  { name: "Test 3", path: "/report-a3" },
  { name: "Test 4", path: "/report-a4" },
];

const dummyTopics = [
  { name: "What is ESCOM Wiki?", path: "/post?id=demo1" },
  { name: "How to Use the Editor", path: "/post?id=demo2" },
  { name: "Submit a Report", path: "/post?id=demo3" },
];

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");
  const userRole = userInfo?.userRole;

  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        const response = await Axios.post(env.BACKEND_URL + "/get_posts", {
          num_post: 5,
          num_ignore: 0,
        });
        setRecentPosts(response.data.posts || []);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    }

    fetchRecentPosts();
  }, []);

  const sidebarItems = userInfo
    ? [
        { name: "Dashboard", path: "/", icon: <Dashboard /> },
        { name: "Editor", path: "/editor", icon: <Edit /> },
        ...(userRole === "R"
          ? [{ name: "See All Reports", path: "/reports", icon: <Article /> }]
          : []),
      ]
    : [{ name: "Dashboard", path: "/", icon: <Dashboard /> }];

  const logbutton = userInfo ? (
    <Button
      fullWidth
      variant="contained"
      color="error"
      startIcon={<Logout />}
      onClick={() => {
        cookies.remove("userInfo");
        navigate("/");
        window.location.reload();
      }}
      sx={{
        color: "white",
        backgroundColor: "#d32f2f",
        fontSize: "0.8rem",
        textTransform: "none",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "12px 16px",
        "&:hover": {
          backgroundColor: "#c62828",
        },
      }}
    >
      Logout
    </Button>
  ) : (
    <Button
      fullWidth
      variant="contained"
      startIcon={<Login />}
      onClick={() => navigate("/login")}
      sx={{
        color: "white",
        backgroundColor: "#2a69ff",
        fontSize: "0.8rem",
        textTransform: "none",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "12px 16px",
        "&:hover": {
          backgroundColor: "#003ed2",
        },
      }}
    >
      Login/Signup
    </Button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 240, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <Drawer
            variant="permanent"
            sx={{
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 240,
                transition: "width 0.3s ease-in-out",
                boxSizing: "border-box",
                bgcolor: "#021227",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                overflowX: "hidden",
                borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "none",
                padding: "10px 0",
              },
            }}
          >
            <Toolbar />
            <Divider
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                width: "90%",
                alignSelf: "center",
              }}
            />

            {/* 🆕 Recent Posts */}
            <Box sx={{ width: "100%", mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: "0.8rem",
                  px: 2,
                  mt: 2,
                  mb: 1,
                }}
              >
                Recent Posts
              </Typography>
              <List>
                {recentPosts.map((post) => (
                  <ListItem
                    button
                    key={post.postId}
                    onClick={() => navigate(`/post?id=${post.postId}`)}
                    sx={{
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                      },
                      padding: "10px 16px",
                    }}
                  >
                    <ListItemIcon sx={{ color: "white", minWidth: 35 }}>
                      <Article fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={post.title}
                      sx={{
                        fontSize: "0.75rem",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>


            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Bottom Nav Items */}
            <List sx={{ width: "100%" }}>
              {sidebarItems.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: "white",
                    marginTop: "10px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                    },
                    padding: "10px 16px",
                  }}
                >
                  <ListItemIcon sx={{ color: "white", minWidth: 35 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                  />
                </ListItem>
              ))}
            </List>

            {/* Login/Logout Button */}
            <Box sx={{ width: "100%", p: 2 }}>{logbutton}</Box>
          </Drawer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
