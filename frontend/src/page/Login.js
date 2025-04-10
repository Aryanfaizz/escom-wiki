import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, TextField, Button, Box, Alert } from "@mui/material";
import Axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Cookies from 'universal-cookie';

// Import custom css for login page
import "./Login.css";

// Import environment variables
import env from "../config/env.js";

// Submit login function
async function submitLogin() {
  // Hide Invalid email/password message
  document.getElementsByName("error_message")[0].style.setProperty("display", "none");

  // Get email and password by user
  const userEmail = document.getElementsByName("userEmail")[0].value;
  const userPassword = document.getElementsByName("userPassword")[0].value;

  let token = undefined;

  // Send user information
  await Axios.post(env.BACKEND_URL + '/login', { email: userEmail, password: userPassword })
    .then((response) => {
      // Do something with token as cookie
      token = JSON.stringify(response.data.token);
      new Cookies().set("userInfo", token, { path: '/' });
    })
    .catch((error) => {
      // Error detected, log error
      console.log(error);
      // Show Invalid email/password message
      document.getElementsByName("error_message")[0].style.setProperty("display", "flex");
      token = undefined;
    });

  return token;
}

const Login = () => {
  // Allow page redirection
  const navigate = useNavigate();
  
  // Move useState inside the component
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Grid container className="main-box">
      {/* Left Side with Logo */}
      <Grid item xs={12} md={6} className="grid-column logo-col">
        <img
          src={`${process.env.PUBLIC_URL}/Transect 3.jpg`}
          alt="Transect Logo"
          className="logo"
        />
      </Grid>

      {/* Right Side with Signup Form */}
      <Grid item xs={12} md={6} className="grid-column data-col">
        <Box className="data-form">
          <Typography variant="h4" className="main-title">
            Welcome to ESCOM Wiki
          </Typography>

          <Typography variant="h6" className="main-title">
            Enter Login Information
          </Typography>

          <TextField
            name="userEmail"
            fullWidth
            variant="outlined"
            className="input-field"
            placeholder="Email Address"
            type="email"
          />

          <TextField
            name="userPassword"
            fullWidth
            variant="outlined"
            className="input-field"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Login Button */}
          <Button
            fullWidth
            variant="contained"
            className="login-btn"
            onClick={async () => {
              const result = await submitLogin();
              if (result !== undefined) {
                navigate("/");
                window.location.reload();
              }
            }}
          >
            Login
          </Button>

          {/* Error message */}
          <Alert variant="filled" severity="error" name="error_message" className="error-message hidden-error">
            Invalid Email or Password.
          </Alert>

          {/* Create Account Link */}
          <Typography className="signup-link" onClick={() => navigate("/signup")}>
            Don't have an account? <span className="signup-text">Create an account</span>
          </Typography>

          {/* Forgot Password Link */}
          <Typography className="forgot-password" onClick={() => navigate("/reset")}>
            Forgot Password?
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
