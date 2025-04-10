import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Paper, Grid, Typography, TextField, Button, Box, Alert } from "@mui/material";
import "./ResetSecurity.css";
import {useState} from "react";
import Axios from 'axios';
import env from "../config/env.js"

async function submitSecurity(secureQuestions, securityName, emailToChange, newPass) {
  
  //error to be displayed
  const error_msg = document.getElementsByName("error_message")[0];
	error_msg.style.setProperty("display", "none");
  //validation: if a security question hasn't been selected, return with an error message
  if (!secureQuestions[securityName]) {
    error_msg.innerHTML = "Please select a security question.";
    error_msg.style.setProperty("display", "flex");
    return;
}  
  let token;
  const secureans = document.getElementsByName("security-answer")[0].value.trim();
  //if secureans is empty, return with an error
  if(!secureans) {
    error_msg.innerHTML = "Security answer is not valid.";
    error_msg.style.setProperty("display", "flex");
    return;
  }

  //send the user's information.
  //if an error is displayed, log the error and show the error message  
	await Axios.post(env.BACKEND_URL + '/security', {"email": emailToChange, "newpass": newPass, "security_answer": secureans, })
	.then((response) => {

		token = response.data.token;

	}).catch( (error) => { 

		console.log(error);
    error_msg.innerHTML = "Wrong security answer";
		error_msg.style.setProperty("display", "flex"); 

		return undefined;
	});

	return token;
}
const Reset = () => {
  const navigate = useNavigate();
  //take the email and new password from the reset password page
  const locate = useLocation();
  const {email: emailToChange, newpass: newPass} = locate.state || {};
  //sets off the security questions as a drop down and lists
	const [dropDownShow, setDropDownShow] = useState(false);
  //set of security questions and their value.
	const [secureQuestions, setSecureQuestions] = useState([
		{
			name: "What was your first childhood pet's name?",
			value: "pet"
		},
		{
			name: "What is your mother's maiden name?",
			value: "maiden"
		},
		{
			name: "What is your favorite food?",
			value: "food"
		},
		{
			name:  "What was the first concert you attended?",
			value: "concert"
		},
		{
			name: "In what city did your parents meet?",
			value: "city"
		}
	]);
	{ /*which security question is selected*/ }
	const [securityName, setSecurityName] = useState(null);

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
                Enter Security Answer
              </Typography>
            <div className = "secure-dropdown">
                <div className = "secure-select" onClick={e => {
                  setDropDownShow(!dropDownShow);
                }}>
                  {securityName != null ? secureQuestions[securityName].name  : "Enter Security Questions"}
                </div>
                {
                dropDownShow ? (
                  <div className = "secure-items">
                  {
                    secureQuestions.map((question, index) => (
                      <div key = {question.value} className = "secure-drop-item" onClick={ e =>
                      {
                        setSecurityName(index);
                        setDropDownShow(false);
                      }}>
                        {question.name}
                      </div>
                    ))
                  }
                </div>
                ) : <></>
              }
              </div>
              {/*  security answer */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Security Answer"
                type="answer"
                className="reset-input"
                name = "security-answer"
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
                  //take in the security questions, name for validation, then email and newpass to be passed through server.js 
                  var result = await submitSecurity(secureQuestions, securityName, emailToChange, newPass);
    
                  if (result != undefined) {
                    navigate("/login")
                  };
                }} 
              > 
                Confirm Security Answer
              </Button>
              {/*display an alert if an error has been found*/}
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
