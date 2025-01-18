import Cookies from 'js-cookie';
import { getUserData } from './strapi';

// Controlla se l'utente è autenticato
export const isUserAuthenticated = async (): Promise<{
  isAuthenticated: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
}> => {
  try {
    const jwt = Cookies.get('jwt');

    if (!jwt) {
      return { isAuthenticated: false };
    }

    const user = await getUserData(jwt);

    return { isAuthenticated: true, user };
  } catch (error) {
    console.error('Errore durante la verifica del login:', error);
    return { isAuthenticated: false };
  }
};

// Funzione per eseguire il logout
export const logoutUser = () => {
  Cookies.remove('jwt');
};
