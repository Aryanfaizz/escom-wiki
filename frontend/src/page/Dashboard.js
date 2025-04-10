import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  Grid,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import "./Dashboard.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

// Import environment variables
import env from "../config/env.js";

const peggys1 = process.env.PUBLIC_URL + "/peggys.jpg";
const peggys2 = process.env.PUBLIC_URL + "/peggys2.jpg";
const halifax = process.env.PUBLIC_URL + "/halifax.jpg";

const cardImages = [
  process.env.PUBLIC_URL + "/card1.jpg",
  process.env.PUBLIC_URL + "/card2.jpg",
  process.env.PUBLIC_URL + "/card3.jpg",
  process.env.PUBLIC_URL + "/card4.jpg",
  process.env.PUBLIC_URL + "/card5.jpg",
  process.env.PUBLIC_URL + "/card6.jpg",
];

//Total posts per page
const topicsPerPage = 6;

//Asyncronous function to get total number of pages to show 
function getPagesNum() {

  const [result, setResult] = React.useState(0);
  const [loading, setLoading] = React.useState("false");

  React.useEffect(() => {

    async function queryPosts() {

      setLoading("true");
     
      await Axios.post(env.BACKEND_URL + '/get_number_posts')
      .then((response) => {
        setResult([Math.ceil(response.data.amount / topicsPerPage)]);
        setLoading("false");
      })
      .catch((error) => {
        // Error detected, log error
        console.log(error);
        setLoading("null");
      });
    }

    queryPosts();
    
  });

  return [result, loading];
}

//Asyncronous function to get posts
function getPosts(index, amount) {

  const [result, setResult] = React.useState([]);
  const [loading, setLoading] = React.useState("false");

  React.useEffect(() => {

    async function queryPosts() {

      setLoading("true");
     
      await Axios.post(env.BACKEND_URL + '/get_posts', { num_post: amount, num_ignore: index })
      .then((response) => {
        setResult(response.data.posts);
        setLoading("false");
      })
      .catch((error) => {
        // Error detected, log error
        console.log(error);
        setLoading("null");
      });
    }

    queryPosts();
    
  });

  return [result, loading];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const Dashboard = ({ isSidebarOpen }) => {

  // Allow page redirection
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setPages] = getPagesNum();
  const [initialTopics, setPosts] = getPosts((currentPage - 1) * topicsPerPage, topicsPerPage);
  const videoRef = useRef(null);
  //search
  const [searchPost, setSearchPost] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  
  //filter the post titles before displaying them
  useEffect(() => {
    if (searchPost === "") {
      setSearchResults([]);
    } else {
      const filtered = initialTopics.filter((post) =>
        post.title.toLowerCase().includes(searchPost.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchPost, initialTopics]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("loadeddata", () => {
        console.log("✅ Video loaded");
      });
      video.addEventListener("play", () => {
        console.log("🎬 Video playing");
      });
      video.addEventListener("error", (e) => {
        console.error("❌ Video error:", e);
        console.error("Error code:", video.error?.code);
        console.error("Error message:", video.error?.message);
      });
    }
  }, []);

  const welcomeText = "Welcome to \nESCOM Wiki".split("");

  return (
    <Box
      className="dashboard-container"
      sx={{
        display: "flex",
        justifyContent: "center",
        transition: "margin-left 0.3s",
        background: "linear-gradient(to bottom, #e6f7ff, #b3e0ff)",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <Box
        className="dashboard-content"
        sx={{
          marginLeft: isSidebarOpen ? "240px" : "70px",
          width: isSidebarOpen ? "calc(100% - 240px)" : "calc(100% - 70px)",
          transition: "all 0.3s ease-in-out",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Container>
          <Grid container spacing={4} sx={{ mt: 4, mb: 6 }}>
            <Grid item xs={12} md={6}>
              {/* Welcome Text - Left Aligned */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <motion.div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "20px",
                    padding: 4,
                    minHeight: "100px",
                    textAlign: "left",
                  }}
                >
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: "bold",
                        marginTop: "70px",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        background:
                          "linear-gradient(45deg, rgb(5, 66, 95), rgb(73, 142, 143))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: "0 0 20px rgba(0, 174, 255, 0.5)",
                        lineHeight: "1.2",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {welcomeText.map((letter, index) => (
                        <motion.span key={index} variants={letterVariants}>
                          {letter === " " ? "\u00A0" : letter}
                        </motion.span>
                      ))}
                    </Typography>
                  </motion.div>
                </motion.div>
              </Box>

              {/* Search Bar - Left Aligned */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  mt: 2,
                  mb: 4,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Box sx = {{position: "relative"}}>
                  <TextField
                    variant="outlined"
                    placeholder="Search ESCOM Wiki..."
                    onChange={(searched) => setSearchPost(searched.target.value)}
                    sx={{
                      width: "440px",
                      backgroundColor: "white",
                      borderRadius: "30px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "30px",
                        padding: "10px 14px",
                        "& fieldset": { borderColor: "#ccc" },
                        "&:hover fieldset": { borderColor: "#00aeff" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#00aeff",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "1rem",
                        padding: "8px 0",
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#00aeff" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* Search Result - Navigates to the post when clicked. */}
                  {searchResults.length > 0 && (
                     <Box
                     sx={{
                       position: "absolute",
                       top: "100%",
                       left: 0,
                       right: 0,
                       bgcolor: "white",
                       boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                       borderRadius: "8px",
                       zIndex: 1,
                       mt: 1,
                     }}
                   >  {/* Display Results and Navigate to post */}
                      {searchResults.map((posts) => (
                        <Box
                          key={posts.postId}
                          sx={{
                            padding: "10px",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#f0f0f0" },
                          }}
                          onClick={() => navigate("/post?id=" + posts.postId)}
                        >
                          <Typography variant="body1" sx={{ color: "rgb(0, 0, 0)" }}>
                            {posts.title}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                  </Box>
                  </motion.div>
              </Box>
            </Grid>

          <Grid item xs={12} md={6}>
  {/* Coastal Parameter Measurement - Right Aligned with Video Background */}
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1.2 }}
    style={{ marginTop: "20px" }}
  >
    <Card
      sx={{
        padding: 3,
        borderRadius: "15px",
        boxShadow: "0 10px 25px rgba(6, 218, 255, 0.46)",
        background: "transparent", // Transparent to show video fully
        color: "#ffffff",
        overflow: "hidden",
        position: "relative",
        minHeight: "300px", // Ensure enough height for content
        backdropFilter: "blur(10px)", // Add blur effect to the card
        border: "1px solid rgba(255, 255, 255, 0.2)", // Faded border
      }}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(0.1px)", // Blurry effect
          zIndex: -1, // Behind card content
          opacity: 10, // Adjusted opacity for text readability
        }}
      >
        <source src="/videos/waterbg.mp4" type="video/mp4" />
        <source src="/videos/waterbg.webm" type="video/webm" />
        <p>Your browser does not support the video tag.</p>
      </video>

      {/* Overlay for better text contrast */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, rgba(5, 66, 95, 0.6), rgba(73, 142, 143, 0.6))", // Semi-transparent gradient overlay
          zIndex: 0, // Above video, below content
        }}
      />

      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontSize: "30px",
            mb: 2,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#ffffff",
          }}
        >
          Coastal Parameter Measurement
        </Typography>
        <Typography
          variant="body1"
          sx={{
            lineHeight: "1.8",
            textAlign: "justify",
            mb: 3,
            color: "#f0f0f0",
          }}
        >
          Explore how we will use the power of citizen science to
          understand and monitor key coastal parameters, from beach
          profiles to marine life. Discover how simple yet effective
          methods could empower individuals to contribute to the
          scientific understanding of our dynamic coastlines.
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#ffffff",
            color: "#006ea1",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#f0f0f0", color: "#005580" },
            padding: "8px 20px",
            borderRadius: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
          onClick={() => {
            document
              .getElementById("topics-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          See Reports
        </Button>
      </CardContent>
    </Card>
  </motion.div>
</Grid>
</Grid>

{/* ✨ DEN Healthy Coast Project Highlight Section */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 1 }}
  style={{ marginTop: "80px", marginBottom: "60px" }}
>
  <Box
    sx={{
      background: "linear-gradient(135deg, #e0f7fa, #ffffff)",
      borderRadius: "20px",
      padding: { xs: 4, md: 6 },
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)",
    }}
  >
    <Typography
      variant="h3"
      sx={{
        fontWeight: "bold",
        textAlign: "center",
        background: "linear-gradient(90deg, #0077b6, #00b4d8)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "1px",
        mb: 4,
      }}
    >
      DEN Healthy Coast Project
    </Typography>

    <Typography
      variant="body1"
      sx={{
        fontSize: "1.1rem",
        color: "#333",
        lineHeight: "1.8",
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto",
        mb: 4,
      }}
    >
      A transformative, community-powered initiative focused on protecting Nova Scotia’s coastlines through
      <strong> citizen science, education, and open digital collaboration</strong>. The project empowers locals, engages youth,
      and embraces technology to inspire action and build resilience.
    </Typography>

    <Grid container spacing={4} sx={{ mt: 2 }}>
      {[
        {
          emoji: "🌊",
          title: "Community Science",
          description:
            "Local citizens become coastal stewards—collecting beach profiles, observing marine life, and contributing vital data that shapes real science.",
        },
        {
          emoji: "🎓",
          title: "Environmental Education",
          description:
            "Youth are inspired to become climate leaders through hands-on activities, classroom visits, and workshops centered around sustainability.",
        },
        {
          emoji: "💡",
          title: "Digital Innovation",
          description:
            "With ESCOM Wiki, open data platforms, and digital tools, we turn science into stories—accessible, visual, and meaningful to all.",
        },
      ].map((section, index) => (
        <Grid item xs={12} md={4} key={index}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              height: "100%",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#006ea1",
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              <span style={{ fontSize: "1.5rem", marginRight: "8px" }}>{section.emoji}</span>
              {section.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#444",
                fontSize: "0.95rem",
                textAlign: "justify",
              }}
            >
              {section.description}
            </Typography>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  </Box>
</motion.div>



          {/* Who Are We? */}
          <Grid container spacing={4} sx={{ mt: 16, alignItems: "center" }}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#021227",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  Who Are We?
                  <span
                    style={{
                      display: "block",
                      width: "60px",
                      height: "4px",
                      backgroundColor: "#00aeff",
                      marginTop: "5px",
                      borderRadius: "2px",
                    }}
                  ></span>
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#444",
                    lineHeight: "1.8",
                    textAlign: "justify",
                    mt: 2,
                  }}
                >
                  We are a team of passionate researchers, scientists, and
                  technology enthusiasts dedicated to **exploring and
                  preserving our coastal environments**. Our mission is to
                  harness the power of **citizen science** and cutting-edge
                  **digital tools** to collect, analyze, and share critical
                  data about our changing coastlines. By working together, we
                  can ensure a sustainable future for our marine ecosystems and
                  empower communities to make informed decisions.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.img
                src={peggys2}
                alt="Who Are We?"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              />
            </Grid>
          </Grid>

          {/* Discover Peggy’s Cove */}
          <Grid container spacing={4} sx={{ mt: 6, alignItems: "center" }}>
            <Grid item xs={12} md={6}>
              <motion.img
                src={peggys1}
                alt="Peggy's Cove 1"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#021227",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  Discover Peggy’s Cove
                  <span
                    style={{
                      display: "block",
                      width: "60px",
                      height: "4px",
                      backgroundColor: "#00aeff",
                      marginTop: "5px",
                      borderRadius: "2px",
                    }}
                  ></span>
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#444",
                    lineHeight: "1.8",
                    textAlign: "justify",
                    mt: 2,
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vivamus venenatis tortor at metus bibendum, eget tristique
                  turpis tempor. Nestled along the rugged coastline of Nova
                  Scotia, Peggy’s Cove is a breathtaking maritime gem known for
                  its **iconic lighthouse, weathered rocks, and stunning ocean
                  views**. Whether you're drawn to the charm of the fishing
                  village or the power of the Atlantic waves, this destination
                  captures the heart of every traveler.
                </Typography>
              </motion.div>
            </Grid>
          </Grid>

       {/* Halifax Regional Municipality */}
<Grid container spacing={4} sx={{ mt: 6, alignItems: "center" }}>
  {/* Text on the left */}
  <Grid item xs={12} md={6}>
    <motion.div
      initial={{ opacity: 0, x: -30 }} // Adjusted for left-to-right animation
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.2 }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#021227",
          textTransform: "uppercase",
          letterSpacing: "1px",
          position: "relative",
          display: "inline-block",
        }}
      >
        Halifax Regional Municipality
        <span
          style={{
            display: "block",
            width: "60px",
            height: "4px",
            backgroundColor: "#00aeff",
            marginTop: "5px",
            borderRadius: "2px",
          }}
        ></span>
      </Typography>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <Typography
        variant="body1"
        sx={{
          color: "#444",
          lineHeight: "1.8",
          textAlign: "justify",
          mt: 2,
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat. **Halifax Regional Municipality**
        offers a vibrant blend of urban sophistication and natural beauty,
        with its stunning harbor views and rich maritime history captivating
        visitors and residents alike.
      </Typography>
    </motion.div>
  </Grid>

  {/* Image on the right */}
  <Grid item xs={12} md={6}>
    <motion.img
      src={halifax}
      alt="Halifax Regional Municipality"
      style={{
        width: "100%",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    />
  </Grid>
</Grid>

{/* 🌊 Coastal Parameters Categories Section */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 1 }}
  style={{ marginTop: "60px", marginBottom: "60px" }}
>
  <Box
    sx={{
      background: "linear-gradient(180deg, #f1fbff, #ffffff)",
      borderRadius: "20px",
      padding: { xs: 4, md: 6 },
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
    }}
  >
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        textAlign: "center",
        color: "#021227",
        mb: 4,
      }}
    >
      Coastal Parameters Categories
    </Typography>

    <Grid container spacing={4}>
      {[
        {
          icon: "🌊",
          title: "Ocean Dynamics",
          text:
            "Focuses on the movement of water in the ocean including currents, tides, and waves — crucial in shaping the seafloor and coastlines.",
        },
        {
          icon: "🏖️",
          title: "Beach Geomorphology",
          text:
            "Studies how Earth's coastal landforms are shaped by natural forces like waves, rivers, and glaciers. Includes sediment analysis (granulometry).",
        },
        {
          icon: "⛅",
          title: "Weather & Climate Change",
          text:
            "Covers short-term weather conditions and long-term climate patterns. Highlights how rising temperatures drive extreme weather events.",
        },
        {
          icon: "🦀",
          title: "Beach Ecology",
          text:
            "Explores biodiversity in sandy shorelines, including microorganisms, shorebirds, and marine life — all impacted by waves, tides, and sunlight.",
        },
        {
          icon: "👩‍🔬",
          title: "Coastal Climate Teams",
          text:
            "Collaborative citizen science and research teams that work together to observe, measure, and report coastal changes for climate resilience.",
        },
        {
          icon: "📍",
          title: "Coastal Monitoring Sites",
          text:
            "Designated field stations and coastal points where regular measurements are taken — helping track long-term environmental changes.",
        },
      ].map((param, index) => (
        <Grid item xs={12} md={6} key={index}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              height: "100%",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#00537e",
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              <span style={{ fontSize: "1.7rem", marginRight: "10px" }}>{param.icon}</span>
              {param.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#444", textAlign: "justify", lineHeight: "1.7" }}
            >
              {param.text}
            </Typography>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  </Box>
</motion.div>


{/* 📋 All Reports Section */}
<Typography
  variant="h4"
  sx={{
    fontWeight: "bold",
    color: "#021227",
    mt: 10,
    mb: 3,
    textAlign: "left",
  }}
>
  All Reports
</Typography>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
>
  <Box
    sx={{
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      padding: 3,
      mb: 6,
    }}
  >
    {initialTopics.length > 0 ? (
      initialTopics.map((post, idx) => (
        <Box
          key={post.postId}
          onClick={() => navigate("/post?id=" + post.postId)}
          sx={{
            padding: "12px 16px",
            borderBottom:
              idx !== initialTopics.length - 1
                ? "1px solid #eee"
                : "none",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "#f8faff",
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#00537e" }}>
            📄 {post.title}
          </Typography>
        </Box>
      ))
    ) : (
      <Typography variant="body1" sx={{ color: "#777" }}>
        No reports found.
      </Typography>
    )}
  </Box>
</motion.div>

          

          {/* Topics */}
          <Typography
            id="topics-section"
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#021227",
              mt: 6,
              mb: 3,
              textAlign: "left",
            }}
          >
            Topics
          </Typography>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 3,
                mb: 5,
              }}
            >
              
              {initialTopics.map((topic, index) => {
                const imageIndex = index % cardImages.length;
                return (
                  <motion.div
                    key={topic.postId}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <Card
                      sx={{
                        position: "relative",
                        height: "250px",
                        borderRadius: "12px",
                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                        backgroundImage: `url(${cardImages[imageIndex]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        overflow: "hidden",
                        "&:hover": {
                          "& .overlay": {
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                          },
                        },
                      }}
                    >
                      <Box
                        className="overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          backdropFilter: "blur(0.6px)",
                          padding: 3,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "1.4rem",
                              fontWeight: "bold",
                              color: "#ffffff",
                              mb: 1,
                            }}
                          >
                            {topic.title}
                          </Typography>
                          {/* This is commented out to hide content in the post cards, currently it wont show correctly, but it is 
                            <Typography
                            variant="body2"
                            sx={{
                              fontSize: "1rem",
                              color: "#f5f5f5",
                              mb: 2,
                            }}
                          >
                            {topic.content}
                          </Typography> */}
                        </CardContent>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#021227",
                            color: "white",
                            fontWeight: "bold",
                            "&:hover": { bgcolor: "#f78c34", color: "white" },
                            alignSelf: "flex-end",
                          }}
                          onClick={async () => {
                            navigate("/post?id=" + topic.postId);
                          }}
                        >
                          Read More
                        </Button>
                      </Box>
                    </Card>
                  </motion.div>
                );
              })}
            </Box>
          </motion.div>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;