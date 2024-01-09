// AuthContext.js
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const jwtToken = localStorage.getItem("token");

    if (jwtToken) {
      const decodedPayload = jwtDecode(jwtToken);
      axios
        .get(`http://localhost:3310/api/users/${decodedPayload.user}`)
        .then((res) => {
          setUser(res.data);
        });
    }
  }, []);

  const updateBalance = (newBalance) => {
    axios
      .put(`http://localhost:3310/api/users/${user.id}`, {
        balance: newBalance,
      })
      .then((res) => {
        setUser({ ...user, balance: res.data.user.balance });
      });
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  const authContextValue = useMemo(() => {
    return { user, updateBalance, logout };
  }, [user, updateBalance, logout]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthProvider, useAuth };
