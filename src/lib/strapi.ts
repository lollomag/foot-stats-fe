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

export const loginUser = async (body: { identifier: string, password: string }) => {
  const response = await axios.post(`${API_URL}/api/auth/local`, body);
  return response.data;
};

export const getUserData = async (jwt: string) => {
  const response = await axios.get(`${API_URL}/api/users/me?populate=role&populate=favorites`, {
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

export const getStripeData = async (customerId: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/subscription?customerId=${customerId}`);
  return response.data;
};

export const postChangeRenew = async (subscriptionId: string, enableRenewal: boolean) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/subscription/cancel-renewal`, {
    subscriptionId,
    enableRenewal
  });
  return response.data;
};

export const postChangeSubscriptionType = async (subscriptionId: string, newPriceId: string) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/subscription/upgrade`, {
    subscriptionId,
    newPriceId
  });
  return response.data;
};

//main features
export const uploadPlayers = async (jwt: string, fullname: string) => {
  const response = await axios.post(`${API_URL}/api/players`, {
    data: {
      fullname
    },
  }, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data;
};

export const getPlayers = async (jwt: string, page: number, searchQuery: string) => {
  const searchFilter = searchQuery ? `&filters[fullname][$containsi]=${searchQuery}` : "";

  const response = await axios.get(`${API_URL}/api/players?pagination[page]=${page}&pagination[pageSize]=12${searchFilter}&populate=*`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data;
};

export const getPlayerDetails = async (jwt: string, id: string) => {
  const response = await axios.get(`${API_URL}/api/players/${id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data;
};

export const getPlayerStatistics = async (jwt: string, id: string, year: string) => {
  const isGeneral = year !== "Generale" ? `?year=${year}` : "";
  const response = await axios.get(`${API_URL}/api/players/${id}/statistics${isGeneral}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data;
};

export const addToFavourites = async (jwt: string, playerId: number, userId: string | number, currentFavorites: number[]) => {
  const isFavorite = currentFavorites.includes(playerId);

  const updatedFavorites = isFavorite
    ? currentFavorites.filter((id) => id !== playerId)
    : [...currentFavorites, playerId];

  const response = await axios.put(`${API_URL}/api/users/${userId}`,
    {
      favorites: updatedFavorites
    },
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  return response.data;
};

export const getTournaments = async (jwt: string, page: number) => {
  // const searchFilter = searchQuery ? `&filters[fullname][$containsi]=${searchQuery}` : "";

  const response = await axios.get(`${API_URL}/api/tournaments?pagination[page]=${page}&pagination[pageSize]=12&populate=*`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data;
};

export const getTournamentsDetails = async (jwt: string, id: string) => {
  const response = await axios.get(`${API_URL}/api/tournaments/${id}?populate=*`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data;
};

export const getLocations = async (jwt: string) => {
  const response = await axios.get(`${API_URL}/api/locations`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTournament = async (jwt: string, data: any) => {
  const response = await axios.post(`${API_URL}/api/tournaments/import`, data, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};