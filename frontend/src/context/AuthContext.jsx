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

      if (typeof newCredits !== "number" || Number.isNaN(newCredits)) {
        console.error("Invalid newCredits. Must be a valid number.");
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
  const editUser = async (updatedFields) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUser((prevUser) => ({
          ...prevUser,
          ...updatedUser.user,
        }));
        return "User updated successfully";
      }
      if (response.status === 400) {
        console.error("Bad Request:", response.statusText);
        throw new Error("Bad Request");
      } else if (response.status === 401) {
        console.error("Unauthorized:", response.statusText);
        throw new Error("Unauthorized");
      } else {
        console.error("Error updating user:", response.statusText);
        throw new Error("Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("An error occurred during user update");
    }
  };

  const sendPasswordResetEmail = async (email) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mail: email }),
        }
      );

      if (response.ok) {
        return "Password reset email sent successfully";
      }

      const data = await response.json();
      throw new Error(data.message || "Error sending password reset email");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error(
        "An error occurred while sending the password reset email"
      );
    }
  };

  const authContextValue = useMemo(() => {
    return {
      user,
      loading,
      updateCredits,
      logout,
      editUser,
      sendPasswordResetEmail,
      setUser: (newUser) => {
        setUser(newUser);
      },
    };
  }, [user, loading, logout]);

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

export { AuthContext, AuthProvider, useAuth };
