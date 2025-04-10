import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import { $getSelection, $isRangeSelection, $createTextNode } from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from "lexical";
import {
  Button,
  Tooltip,
  Select,
  MenuItem,
  Divider,
  Box,
  IconButton,
  Input,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  AttachFile,
  FontDownload,
  TextFields,
} from "@mui/icons-material";

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [heading, setHeading] = React.useState("paragraph");
  const [fontStyle, setFontStyle] = React.useState("Arial");
  const [fontSize, setFontSize] = React.useState("16px");

  // Text Formatting
  const formatText = (style) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText(style);
      }
    });
  };

  // Change Headings
  const handleHeadingChange = (level) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (level === "paragraph") {
          const paragraphNode = $createParagraphNode();
          selection.insertNodes([paragraphNode]);
        } else {
          const headingNode = $createHeadingNode(level);
          selection.insertNodes([headingNode]);
        }
      }
    });
  };

  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const textNode = $createTextNode(`[Attachment: ${file.name}]`);
          selection.insertNodes([textNode]);
        }
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        padding: 1,
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* Text Formatting */}
      <Tooltip title="Bold">
        <IconButton onClick={() => formatText("bold")}>
          <FormatBold />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton onClick={() => formatText("italic")}>
          <FormatItalic />
        </IconButton>
      </Tooltip>
      <Tooltip title="Underline">
        <IconButton onClick={() => formatText("underline")}>
          <FormatUnderlined />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Headings */}
      <Select
        value={heading}
        onChange={(e) => {
          setHeading(e.target.value);
          handleHeadingChange(e.target.value);
        }}
        sx={{ minWidth: 120 }}
      >
        <MenuItem value="paragraph">Paragraph</MenuItem>
        <MenuItem value="h1">Heading 1</MenuItem>
        <MenuItem value="h2">Heading 2</MenuItem>
        <MenuItem value="h3">Heading 3</MenuItem>
      </Select>

      <Divider orientation="vertical" flexItem />

      {/* Lists */}
      <Tooltip title="Bulleted List">
        <IconButton onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
          <FormatListBulleted />
        </IconButton>
      </Tooltip>
      <Tooltip title="Numbered List">
        <IconButton onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>
          <FormatListNumbered />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Alignment */}
      <Tooltip title="Align Left">
        <IconButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}>
          <FormatAlignLeft />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Center">
        <IconButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}>
          <FormatAlignCenter />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Right">
        <IconButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}>
          <FormatAlignRight />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Font Style */}
      <Select
        value={fontStyle}
        onChange={(e) => setFontStyle(e.target.value)}
        sx={{ minWidth: 120 }}
      >
        <MenuItem value="Arial">Arial</MenuItem>
        <MenuItem value="Times New Roman">Times New Roman</MenuItem>
        <MenuItem value="Courier New">Courier New</MenuItem>
      </Select>

      {/* Font Size */}
      <Select
        value={fontSize}
        onChange={(e) => setFontSize(e.target.value)}
        sx={{ minWidth: 80 }}
      >
        <MenuItem value="12px">12px</MenuItem>
        <MenuItem value="14px">14px</MenuItem>
        <MenuItem value="16px">16px</MenuItem>
        <MenuItem value="18px">18px</MenuItem>
        <MenuItem value="20px">20px</MenuItem>
      </Select>

      <Divider orientation="vertical" flexItem />

      {/* Attachment */}
      <Tooltip title="Attach File">
        <IconButton component="label">
          <AttachFile />
          <Input type="file" sx={{ display: "none" }} onChange={handleFileUpload} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Toolbar;