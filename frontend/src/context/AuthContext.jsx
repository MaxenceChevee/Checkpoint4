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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = localStorage.getItem("token");

      if (jwtToken) {
        try {
          const decodedPayload = jwtDecode(jwtToken);
          const res = await axios.get(
            `http://localhost:3310/api/users/${decodedPayload.user}`
          );
          setUser(res.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const updateCredits = async (newCredits) => {
    try {
      if (
        !user ||
        !user.id ||
        user.credits === null ||
        user.credits === undefined
      ) {
        console.error("Invalid user or user credits");
        return;
      }

      await updateUserCreditsOnServer(user.id, newCredits);

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

  if (loading) {
    return <p>Loading...</p>;
  }

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
