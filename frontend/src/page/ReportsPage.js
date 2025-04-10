// page/ReportsPage.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import env from "../config/env";
import { useTheme } from "@mui/material/styles";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await Axios.get(env.BACKEND_URL + "/get_all_reports");
      setReports(response.data.reports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`${env.BACKEND_URL}/delete_report/${id}`);
      setReports((prev) => prev.filter((r) => r.post_id !== id));
    } catch (error) {
      console.error("Failed to delete report:", error);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        background: "linear-gradient(to right, #e0f7fa, #e1f5fe)",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          p: { xs: 2, sm: 4 },
          borderRadius: "16px",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{
            mb: 3,
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

        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "#003f5c",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          All Reports
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#003f5c" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  No
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Title
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Author
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold" }}
                  align="center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow key={report.post_id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{`${report.first_name} ${report.last_name}`}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(report.post_id)}
                      sx={{
                        borderRadius: "20px",
                        textTransform: "none",
                        fontWeight: "bold",
                        px: 2,
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No reports available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ReportsPage;
