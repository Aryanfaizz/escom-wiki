//Initial Author: Luis Cabarique - 12-2-2025

//Import base react packages
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Paper, Grid, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

//Import custom css
import "./Signup.css";

//Import environment variables
import env from "../config/env.js";

//Export base page
export default () => {
  //Enable navigation
  const navigate = useNavigate();

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
            Welcome to Transect Wiki
          </Typography>

          <Typography variant="h6" className="main-title">
            Create Account
          </Typography>

          
          <FormControl fullWidth variant="outlined" className="input-field" required>
            <Select
              name="roleInput"
              className="security-dropdown"
              defaultValue=""
              displayEmpty 
              renderValue={(selected) => (selected === "" ? <span style={{ color: "#a9a9a9" }}>Select your role</span> : selected)}
            >
              <MenuItem value="Citizen Scientist">Citizen Scientist</MenuItem>
              <MenuItem value="Researcher">Researcher</MenuItem>
            </Select>
          </FormControl>

          <Grid container item className="box-multi-objects">

            <TextField
              variant="outlined"
              className="input-field input-field-half"
              placeholder="First Name"
              name = "firstName"
            />

            <TextField
              variant="outlined"
              className="input-field input-field-half"
              placeholder="Last Name"
              name = "lastName"
            />
          </Grid>

          <TextField
            fullWidth
            variant="outlined"
            className="input-field"
            placeholder="Email Address"
            type="email"
            name = "email"
          />

          <TextField
            fullWidth
            variant="outlined"
            className="input-field"
            placeholder="Phone Number"
            type="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            name = "phone"
          />

          <TextField
            fullWidth
            variant="outlined"
            className="input-field"
            placeholder="Enter your password"
            type="password"
            name = "password"
          />

          <FormControl fullWidth variant="outlined" className="input-field" required>
            <Select
              name="securityQuestion"
              className="security-dropdown"
              defaultValue=""
              displayEmpty 
              renderValue={(selected) => (selected === "" ? <span style={{ color: "#a9a9a9" }}>Select a security question</span> : selected)}
            >
              {/* <MenuItem value="" disabled>Select a security question</MenuItem> */}
              <MenuItem value="What was your first childhood pet's name?">What was your first childhood pet's name?</MenuItem>
              <MenuItem value="What is your mother's maiden name?">What is your mother's maiden name?</MenuItem>
              <MenuItem value="What is your favorite food?">What is your favorite food?</MenuItem>
              <MenuItem value="What was the first concert you attended?">What was the first concert you attended?</MenuItem>
              <MenuItem value="In what city did your parents meet?">In what city did your parents meet?</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            variant="outlined"
            className="input-field"
            placeholder="securityAnswer"
            name="securityAnswer"
          />
  
          <Button
            fullWidth
            variant="contained"
            className="form-btn"
            onClick={ async () => {
              var result = await signup();

							if (result != undefined) {
								navigate("/login")
							};
            }}
          >
            Create account
          </Button>

          {/* Already have an account? Sign in Link */}
          <Typography className="signin-link" onClick={() => navigate("/login")}>
            Already have an account?{" "}
            <span className="signin-text">Sign in</span>
          </Typography>

        </Box>
      </Grid>
    </Grid>
  );
};

async function signup() {

  var role = document.getElementsByName("roleInput")[0].value;
  const firstName = document.getElementsByName("firstName")[0].value;
  const lastName = document.getElementsByName("lastName")[0].value;
  const email = document.getElementsByName("email")[0].value;
  var phone = document.getElementsByName("phone")[0].value;
  const password = document.getElementsByName("password")[0].value;
  const securityQuestion = document.getElementsByName("securityQuestion")[0].value;
  const securityAnswer = document.getElementsByName("securityAnswer")[0].value;

  if(!firstName || !lastName || !email || !phone || !password || !securityQuestion || !securityAnswer){
    alert("Please fill out all fields.");
    return;
  }

  const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Invalid email address");
    return;
  }

  const phoneRegex = /^(\d{3})(\d{3})(\d{4})$/;
  if (!phoneRegex.test(phone)) {
    alert("Invalid phone number format.");
    return;
  }
  const phoneNum = phone.match(/^(\d{3})(\d{3})(\d{4})$/)
  phone = `+1 (${phoneNum[1]}) ${phoneNum[2]}-${phoneNum[3]}`;

  if (role == "Researcher") {
    role = "R";
  } else {
    role = "S";
  }

  try{

    const response = await axios.post(env.BACKEND_URL + "/signup", 
      { "role": role, "firstname": firstName, "lastname": lastName, "email": email, 
        "phonenumber": phone, "password": password, "securityquestion": securityQuestion, "securityanswer": securityAnswer });

    if (response.status === 201) {
      alert("Account created successfully! Redirecting to login page.");
      return true;
    } else if (response.status === 400) {
      alert(`Error: ${response.data.message || "Invalid data provided."}`);
    } else if (response.status === 409) {
      alert(`Error: ${response.data.message || "Email already exists."}`);
    } else {
      alert(`Error: ${response.data.message || "Something went wrong!"}`);
    }

  }catch(error){

    if (error.response) {
      // Server responded with an error status
      alert(`Error: ${error.response.data.message || "Failed to create account."}`);
    } else if (error.request) {
      // Request made but no response received
      alert("Network error. Please try again later.");
    } else {
      // Unexpected error during setup
      alert(`Error: ${error.data.message || "Something went wrong!"}`);
    }

  }

  return undefined;

}
