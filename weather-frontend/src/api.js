// src/api.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL; // e.g. https://weather-backend.onrender.com

export const fetchWeatherByCity = (city) => {
  const encodedCity = encodeURIComponent(city.trim());
  return axios.get(`${BASE_URL}/api/weather/${encodedCity}`);
};

export const fetchWeatherByCoords = (lat, lon) => {
  return axios.get(`${BASE_URL}/api/weather/${lat},${lon}`);
};