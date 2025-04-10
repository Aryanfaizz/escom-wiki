import React, { useState, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { Box, Button, Typography } from "@mui/material";
import Axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import parse from 'html-react-parser';

import Toolbar from "../components/Toolbar";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import env from "../config/env.js";

const theme = {
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
  },
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
  },
};

function onError(error) {
  console.error("Lexical Error:", error);
}

function stringToHTML (content) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(content, 'text/html');
	return doc.body.firstChild;
};

//Asyncronous function to get the post
function getPost(ID) {

  const [result, setResult] = React.useState([]);
  const [loading, setLoading] = React.useState("false");

  React.useEffect(() => {

    async function queryPost() {
     
      await Axios.post(env.BACKEND_URL + '/get_post_id', { postid: ID })
      .then((response) => {
        response.data.creationDate = response.data.creationDate.split("T")[0];
        //response.data.content = document.createElement("div").innerHTML = response.data.content.replaceAll("\\", "");
        //response.data.content = stringToHTML(response.data.content.replaceAll("\\", ""));
        response.data.content = parse(response.data.content.replaceAll("\\", ""));
        console.log(response.data.content);

        setResult(response.data);
        setLoading([]);
      })
      .catch((error) => {
        // Error detected, log error
        console.log(error);
      });
    }

    if(loading == "false") {
      queryPost();
    }
    
  });

  return [result, loading];
}

const EditorPage = ({ isSidebarOpen, toggleSidebar }) => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  const queryParameters = new URLSearchParams(window.location.search);
  const [postInfo, setEditorInfo] = getPost(queryParameters.get("id"));

  const navigate = useNavigate();

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [HeadingNode, ListNode, ListItemNode, LinkNode],
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />

      <Box
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${isSidebarOpen ? "240px" : "70px"})`,
          transition: "width 0.3s ease-in-out",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: "0px",
        }}
      >
        {/* Editor Container - Sticks Title to Top, Toolbar & Post Button at Bottom */}
        <Box
          sx={{
            width: "95%",
            maxWidth: "1000px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            height: "95vh",
            display: "flex",
            flexDirection: "column",
            padding: "0px",
          }}
        >
          
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{
              mt: 2,
              ml: 2,
              maxWidth: "200px",
              borderRadius: "30px",
              background: "#1976d2",
              color: "#fff",
              px: 3,
              fontWeight: "bold",
              "&:hover": {
                background: "#115293",
              },
            }}
          >
            Go Back
          </Button>

          <LexicalComposer initialConfig={initialConfig}>
            <Box
              sx={{
                position: "sticky",
                top: "0",
                width: "100%",
                backgroundColor: "#fff",
                borderBottom: "1px solid #ddd",
                zIndex: 10,
                padding: "15px",
              }}
            >
              <Typography
                id="postTitle"
                suppressContentEditableWarning
                sx={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  outline: "none",
                  color: "#333",
                  width: "100%"
                }}
              >
                {postInfo.title}
              </Typography>

              <Typography
                id="postTitle"
                suppressContentEditableWarning
                sx={{
                  fontSize: "1rem",
                  outline: "none",
                  color: "#333",
                  width: "100%"
                }}
              >
                Created by {postInfo.firstName} {postInfo.lastName}
              </Typography>
            </Box>

            {/* Full-width Content Editor */}
            <Box
              sx={{
                flexGrow: 1,
                width: "100%",
                overflowY: "auto",
                padding: "25px",
                wordWrap: "auto"
              }}
            >
              {postInfo.content}
            </Box>
          </LexicalComposer>
        </Box>
      </Box>
    </Box>
  );
};

export default EditorPage;
