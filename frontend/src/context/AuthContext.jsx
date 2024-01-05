import React, { createContext, useContext, useState, useMemo } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const login = () => {
    setLoggedIn(true);
  };

  const logout = () => {
    setLoggedIn(false);
  };

  const authContextValue = useMemo(() => {
    return { isLoggedIn, login, logout };
  }, [isLoggedIn]);

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
