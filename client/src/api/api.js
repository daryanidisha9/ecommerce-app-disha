// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // change to your backend URL if needed
});

// ✅ GET
export const getRequest = async (url) => {
  try {
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("GET Request Failed:", error);
    throw error;
  }
};

// ✅ POST
export const postRequest = async (url, data) => {
  try {
    const response = await API.post(url, data);
    return response.data;
  } catch (error) {
    console.error("POST Request Failed:", error);
    throw error;
  }
};

// ✅ PUT — (you were missing this!)
export const putRequest = async (url, data) => {
  try {
    const response = await API.put(url, data);
    return response.data;
  } catch (error) {
    console.error("PUT Request Failed:", error);
    throw error;
  }
};
