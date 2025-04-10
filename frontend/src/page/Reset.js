import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Grid, Typography, TextField, Button, Box, Alert } from "@mui/material";
import "./Reset.css";
import Axios from 'axios';
import env from "../config/env.js"

async function submitReset() {
  //error to be displayed
  const error_msg = document.getElementsByName("error_message")[0];
	error_msg.style.setProperty("display", "none");
  //email validation pattern
  const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //user info
	const email = document.getElementsByName("email")[0].value;
	const newPassword = document.getElementsByName("userPassword")[0].value;
  const phone = document.getElementsByName("phone")[0].value;
  //token to be sent 
  var token = undefined;
  /*
   * Form validation for email, if does not come with a "@" or ".", reject, also if does not exist in database
   * If new password is less than 12 characters, reject and display error
   * If phone number is not standard, reject and display error
  */
  if(!validEmail.test(email)) {
    error_msg.innerHTML = "Email is not valid, please check again";
    error_msg.style.setProperty("display", "flex"); 
    return;
  }
  if(newPassword.length < 9) {
    error_msg.innerHTML = "Password must be 9 characters or longer";
    error_msg.style.setProperty("display", "flex"); 
    return;
  }
  if(!(phone.length == 10)) {
    error_msg.innerHTML = "Invalid Phone Number";
    error_msg.style.setProperty("display", "flex"); 
    return;
  }
  //send the user's information.
	await Axios.post(env.BACKEND_URL + '/reset', { "email": email, "phone": phone, "newpass": newPassword, })
	.then((response) => {

		token = response.data.token;

	}).catch( (error) => { //if an error is displayed, log the error and show the error message

		console.log(error);
    error_msg.innerHTML = "No account under this email or phone number.";
		error_msg.style.setProperty("display", "flex"); 

		return undefined;
	});

	return token;
}
const Reset = () => {
  const navigate = useNavigate();

  return (
    <Box className="reset-container">
      <Paper elevation={3} className="reset-box">
        <Grid container>
          {/* Left Side with Logo */}
          <Grid item xs={12} md={6} className="reset-left">
            <img
              src={`${process.env.PUBLIC_URL}/Transect 3.jpg`}
              alt="Transect Logo"
              className="reset-logo"
            />
          </Grid>

          {/* Right Side with Reset Form */}
          <Grid item xs={12} md={6} className="reset-right">
            <Box className="reset-form">
              <Typography variant="h4" className="reset-title">
                Reset Your Password
              </Typography>

              {/* Modernized Input Fields */}
              <TextField
                fullWidth
                name = "email"
                variant="outlined"
                placeholder="Enter your Email"
                className="reset-input"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0px",
                    backgroundColor: "white",
                    transition: "0.3s",
                  },
                  "& .MuiOutlinedInput-root:hover": {
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    borderColor: "#f78c34",
                  },
                }}
              />

              <TextField
                fullWidth
                name = "phone"
                variant="outlined"
                placeholder="Enter your Phone Number"
                className="reset-input"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0px",
                    backgroundColor: "white",
                    transition: "0.3s",
                  },
                  "& .MuiOutlinedInput-root:hover": {
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    borderColor: "#f78c34",
                  },
                }}
              />

              <TextField
                fullWidth
                name = "userPassword"
                variant="outlined"
                placeholder="Enter your Password"
                type="password"
                className="reset-input"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0px",
                    backgroundColor: "white",
                    transition: "0.3s",
                  },
                  "& .MuiOutlinedInput-root:hover": {
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    borderColor: "#f78c34",
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                className="reset-btn"
                onClick={async () => {
                  const email = document.getElementsByName("email")[0].value;
                  const newpass = document.getElementsByName("userPassword")[0].value;
                  var result = await submitReset();
                  
                  if (result != undefined) { //navigates to the security and takes the email and password with it.
                    navigate("/security", {state: {email, newpass}})
                  };
    
                }}
              >
                Reset Password
              </Button>
              <Alert variant="filled" severity="error" name="error_message" className="error-message hidden-error">
                          Invalid Email or Phone Number.
              </Alert>
              {/* Already have an account? Sign in Link */}
              <Typography className="signin-link" onClick={() => navigate("/login")}>
                Already have an account?{" "}
                <span className="signin-text">Sign in</span>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Reset;
