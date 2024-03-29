import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../components/Popup";
import "../styles/ResetPassword.scss";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popupData, setPopupData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || password !== confirmPassword) {
      setError("Passwords do not match or are missing");
      return;
    }

    try {
      const base64Token = token.replace(/-/g, "+").replace(/_/g, "/");
      const decodedToken = decodeURIComponent(
        atob(base64Token)
          .split("")
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join("")
      );

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/reset-password/${encodeURIComponent(decodedToken)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        setPopupData({
          message: "Mot de passe réinitialisé avec succès",
          onClose: () => {
            setPopupData(null);
            navigate("/connexion");
          },
        });
      } else {
        const data = await response.json();
        setError(data.message || "Error resetting password");
      }
    } catch (catchError) {
      console.error("Error during password reset:", catchError);
      setError("Internal server error");
    }
  };

  return (
    <div className="page-container">
      <div className="auth-form">
        <h2>Reset Password</h2>
        {error && <p className="error-message">{error}</p>}
        {popupData && (
          <Popup message={popupData.message} onClose={popupData.onClose} />
        )}
        <form onSubmit={handleResetPassword} className="form-container">
          <label>
            New Password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Confirm New Password:
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
