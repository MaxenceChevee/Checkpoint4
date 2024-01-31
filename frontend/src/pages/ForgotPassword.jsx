import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import { useAuth } from "../context/AuthContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [popupData, setPopupData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { sendPasswordResetEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await sendPasswordResetEmail(email);

      setPopupData({
        message: "E-mail envoyé avec succès",
        onClose: () => {
          setPopupData(null);
          navigate("/");
        },
      });
    } catch (catchError) {
      console.error("Error sending password reset email:", error);
      setError("Error sending password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Reset Password"}
        </button>
      </form>
      <p>
        Remember your password? <Link to="/connexion">Login here</Link>
      </p>
      {error && <p className="error-message">{error}</p>}
      {popupData && (
        <Popup message={popupData.message} onClose={popupData.onClose} />
      )}
    </div>
  );
}

export default ForgotPassword;
