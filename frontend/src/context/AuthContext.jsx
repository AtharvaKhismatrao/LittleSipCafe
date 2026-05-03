import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrentUser, loginUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('userToken') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('userToken', token);
      fetchCurrentUser(token)
        .then(setUser)
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem('userToken');
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      localStorage.removeItem('userToken');
      setLoading(false);
    }
  }, [token]);

  async function login(email, password) {
    const data = await loginUser({ email, password });
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
