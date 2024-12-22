import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// Registrazione di un nuovo utente
export const registerUser = async (username: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/api/auth/local/register`, {
    username,
    email,
    password,
  });
  return response.data; // Contiene il token JWT e i dati dell'utente
};

// Login dell'utente
export const loginUser = async (identifier: string, password: string) => {
  const response = await axios.post(`${API_URL}/api/auth/local`, {
    identifier,
    password,
  });
  return response.data; // Contiene il token JWT e i dati dell'utente
};

// Ottieni i dati dell'utente autenticato
export const getUserData = async (jwt: string) => {
  const response = await axios.get(`${API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data;
};
