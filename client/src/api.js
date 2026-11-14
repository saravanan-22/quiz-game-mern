// Base URL of the Express API. Set REACT_APP_API_URL at build time
// (e.g. https://mern-quiz-app-api.onrender.com); defaults to the local server.
export const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
export const API = `${API_URL}/api/v1`;
