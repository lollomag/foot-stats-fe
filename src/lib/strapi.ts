import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const registerUser = async (body: {
  name: string,
  surname: string,
  username: string, email: string, password: string
}) => {
  const response = await axios.post(`${API_URL}/api/auth/local/register`, body);
  return response.data;
};

export const loginUser = async (body: {identifier: string, password: string}) => {
  const response = await axios.post(`${API_URL}/api/auth/local`, body);
  return response.data;
};

export const getUserData = async (jwt: string) => {
  const response = await axios.get(`${API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data;
};

export const changeUserPassword = async (jwt: string, body: {
  currentPassword: string,
  password: string,
  passwordConfirmation: string
}) => {
  const response = await axios.post(`${API_URL}/api/auth/change-password`,
  body,
  {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data;
};

export const forgotPassword = async (body: {
  email: string,
}) => {
  const response = await axios.post(`${API_URL}/api/auth/forgot-password`, body,);
  return response.data;
};

export const resetPassword = async (body: {
  code: string | null,
  password: string,
  passwordConfirmation: string
}) => {
  const response = await axios.post(`${API_URL}/api/auth/reset-password`, body,);
  return response.data;
};
