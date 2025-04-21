import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; 

// Register API call
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message || "An error occurred during registration";
  }
};

// Login API call
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message || "An error occurred during login";
  }
};
