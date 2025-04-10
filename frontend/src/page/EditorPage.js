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

async function createPost() {
  const title = document.getElementById("postTitle").innerText.trim();
  const content = document.getElementsByName("postContent")[0].innerHTML.trim();
  const authorId = new Cookies().get("userInfo")?.userId;

  if (!title || !content) {
    alert("Title and content cannot be empty.");
    return;
  }

  try {
    const response = await Axios.post(env.BACKEND_URL + "/create_post", {
      authorid: authorId,
      title,
      content,
    });

    if (response.data.posted === "YES") {
      alert("Post created successfully!");
      return "YES";
    } else {
      alert("Post failed to be created.");
    }
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Error: unable to create post.");
  }
}

const EditorPage = ({ isSidebarOpen, toggleSidebar }) => {
  const [editorState, setEditorState] = useState("");

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
          <LexicalComposer initialConfig={initialConfig}>
            {/* Post Title (Fixed at the Top) */}
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
                contentEditable
                suppressContentEditableWarning
                sx={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  outline: "none",
                  color: "#333",
                  minHeight: "50px",
                  width: "100%",
                  "&:empty::before": {
                    content: `"Enter Post Title..."`,
                    color: "#999",
                  },
                }}
              />
            </Box>

            {/* Full-width Content Editor */}
            <Box
              sx={{
                flexGrow: 1,
                position: "relative",
                width: "100%",
                overflowY: "auto",
                padding: "15px",
              }}
            >
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    name="postContent"
                    style={{
                      flexGrow: 1,
                      fontSize: "1rem",
                      lineHeight: 1.6,
                      outline: "none",
                      border: "none",
                      width: "100%",
                      height: "100%",
                      color: "#444",
                      backgroundColor: "#fff",
                    }}
                  />
                }
                placeholder={
                  <div
                    style={{
                      position: "absolute",
                      top: "15px",
                      left: "15px",
                      color: "#999",
                      pointerEvents: "none",
                      fontSize: "1rem",
                    }}
                  >
                    Start writing your post...
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </Box>

            {/* Toolbar & Post Button (Fixed at Bottom) */}
      {/* Toolbar & Post Button (Fixed at Bottom) */}
<Box
  sx={{
    position: "sticky",
    bottom: "0",
    width: "100%",
    backgroundColor: "#fff",
    borderTop: "1px solid #ddd",
    zIndex: 10,
    padding: "10px",
    display: "flex",
    justifyContent: "center", // Center everything
    alignItems: "center",
    gap: "16px", // Space between elements
  }}
>
  {/* Toolbar Items Wrapper */}
  <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <Toolbar />
  </Box>

  {/* Post Button - Centered */}
  <Button
    variant="contained"
    onClick={async () => {
      const result = await createPost();
      if (result === "YES") {
        navigate("/");
      }
    }}
    sx={{
      borderRadius: "20px",
      padding: "10px 24px",
      fontSize: "16px",
      fontWeight: "bold",
      textTransform: "none",
      backgroundColor: "#1976d2",
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: "#1565c0",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
      },
    }}
  >
    Post
  </Button>
</Box>


            <HistoryPlugin />
            <OnChangePlugin onChange={(editorState) => setEditorState(editorState)} />
          </LexicalComposer>
        </Box>
      </Box>
    </Box>
  );
};

export default EditorPage;
