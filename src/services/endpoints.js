// src/endpoint.js
const mode = import.meta.env.MODE

const API_BASE_URL = import.meta.env[`VITE_API_BASE_URL_${mode.toUpperCase()}`];
const FTP_BASE_URL = import.meta.env[`VITE_FTP_BASE_URL_${mode.toUpperCase()}`];

export { API_BASE_URL, FTP_BASE_URL };
