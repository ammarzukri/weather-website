// src/api.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const fetchWeatherByCity = (city) => {
  const encodedCity = encodeURIComponent(city.trim());
  return axios.get(`${BASE_URL}/${encodedCity}`);
};

export const fetchWeatherByCoords = (lat, lon) => {
  return axios.get(`${BASE_URL}/${lat},${lon}`);
};