import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";

const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8027").replace(/\/$/, "");

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({ email: "", password: "" });

  const handleChange = (e) => setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/v1/user/login`, inputs);
      if (data?.success && data?.user?._id) {
        localStorage.setItem("userId", data.user._id);
        dispatch(login());
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box style={{ backgroundImage: "linear-gradient(to left bottom, #fc0839, #fc0742, #fb094a, #fa0e52, #f8145a)" }} maxWidth={400} display="flex" flexDirection="column" alignItems="center" justifyContent="center" margin="auto" marginTop={5} boxShadow="10px 10px 20px #ccc" padding={3} borderRadius={5}>
        <Typography variant="h4" sx={{ textTransform: "uppercase" }} padding={3} textAlign="center" color="white">Login</Typography>
        <TextField placeholder="email" value={inputs.email} name="email" margin="normal" type="email" required onChange={handleChange} sx={{ input: { backgroundColor: "white", borderRadius: "15px" } }} />
        <TextField placeholder="password" value={inputs.password} name="password" margin="normal" type="password" required onChange={handleChange} sx={{ input: { backgroundColor: "white", borderRadius: "15px" } }} />
        <Button type="submit" sx={{ borderRadius: 3, marginTop: 3 }} variant="contained" color="primary">Submit</Button>
        <Button onClick={() => navigate("/register")} sx={{ borderRadius: 3, marginTop: 3 }}>
          <Typography variant="body2" sx={{ textTransform: "uppercase" }} padding={1} textAlign="center" color="white">Not a user? Please Register</Typography>
        </Button>
      </Box>
    </form>
  );
};

export default Login;
