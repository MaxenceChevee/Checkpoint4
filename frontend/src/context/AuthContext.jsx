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

  // Fonction pour mettre à jour les crédits côté serveur
  const updateUserCreditsOnServer = async (userId, newCredits) => {
    try {
      const jwtToken = localStorage.getItem("token");

      if (!jwtToken || !userId) {
        console.error("Invalid token or user ID");
        return;
      }

      await axios.put(
        `http://localhost:3310/api/users/${userId}/credits`,
        { credits: newCredits },
        { headers: { "x-auth-token": jwtToken } }
      );
    } catch (error) {
      console.error("Error updating credits on server:", error);
    }
  };

  // Fonction pour mettre à jour les crédits dans le contexte
  const updateCredits = async (newCredits) => {
    try {
      if (!user || !user.id) {
        console.error("Invalid user");
        return;
      }

      // Mettre à jour les crédits côté serveur
      await updateUserCreditsOnServer(user.id, newCredits);

      // Mettre à jour les crédits dans le contexte
      setUser((prevUser) => ({
        ...prevUser,
        credits: newCredits,
      }));
    } catch (error) {
      console.error("Error updating credits:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const authContextValue = useMemo(
    () => ({ user, updateCredits, logout }),
    [user]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
