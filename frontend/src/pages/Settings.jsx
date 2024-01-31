import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/Settings.scss";

function Settings() {
  const { user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    pseudoname: user?.pseudoname || "",
    email: user?.mail || "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      pseudoname: user?.pseudoname || "",
      email: user?.mail || "",
    });
    setErrors({});
    setSuccessMessage("");
  }, [user]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({});
    setSuccessMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await axios.put(
        `http://localhost:3310/api/users/${user.id}`,
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          pseudoname: formData.pseudoname.trim(),
          currentPassword: formData.currentPassword.trim(),
          newPassword: formData.newPassword.trim(),
          confirmNewPassword: formData.confirmNewPassword.trim(),
        }
      );

      const updatedUser = response.data.user;

      setFormData((prevData) => ({
        ...prevData,
        ...updatedUser,
        currentPassword: "",
        newPassword: "",
      }));

      setSuccessMessage("Changement validé ✔");
    } catch (errorCaught) {
      console.error("Error during form submission:", errorCaught);

      if (errorCaught.response && errorCaught.response.data) {
        const { errors: responseErrors, message } = errorCaught.response.data;

        if (responseErrors) {
          setErrors(responseErrors);
        } else if (message) {
          setErrors({ general: message });
        }
      } else {
        setErrors({
          general:
            "Une erreur s'est produite lors de la soumission du formulaire.",
        });
      }
    }
  }

  const handleDeleteAccount = () => {
    setShowDeletePopup(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:3310/api/users/${user.id}`, {
        data: {
          currentPassword: formData.currentPassword
            ? formData.currentPassword.trim()
            : undefined,
        },
      });

      logout();
    } catch (errorCaught) {
      console.error("Error during account deletion:", errorCaught);

      if (errorCaught.response && errorCaught.response.data) {
        const { errors: responseErrors, message } = errorCaught.response.data;

        if (responseErrors) {
          setErrors(responseErrors);
        } else if (message) {
          setErrors({ general: message });
        }
      } else {
        setErrors({
          general:
            "Une erreur s'est produite lors de la suppression du compte.",
        });
      }
    } finally {
      setShowDeletePopup(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeletePopup(false);
  };

  return (
    <div className="settings-container">
      <h2>Paramètres du compte</h2>
      {Object.keys(errors).length > 0 && (
        <div>
          {Object.entries(errors).map(([field, message]) => (
            <p key={field} style={{ color: "red" }}>
              {message}
            </p>
          ))}
        </div>
      )}

      {successMessage && <p>{successMessage}</p>}

      <form className="settings-list-container" onSubmit={handleSubmit}>
        <label>
          Prénom:
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
        </label>
        <label>
          Nom:
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
        </label>
        <label>
          Pseudo:
          <input
            type="text"
            name="pseudoname"
            value={formData.pseudoname}
            onChange={handleChange}
          />
        </label>
        <label>
          Mot de passe actuel:
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </label>
        <label>
          Nouveau mot de passe:
          <p className="password-info">
            (8 caractères minimum dont 1 majuscule, 1 minuscule, 1 chiffre et 1
            caractère spécial)
          </p>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </label>
        <label>
          Confirmer le nouveau mot de passe:
          <input
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Sauvegarder les changements</button>
        <button
          type="button"
          className="button-delete"
          onClick={handleDeleteAccount}
        >
          Supprimer le compte
        </button>
      </form>

      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
      {successMessage && <p>{successMessage}</p>}

      {showDeletePopup && (
        <div className="overlay">
          <div className="custom-popup">
            <p>
              Etes vous sur de vouloir supprimer définitivement votre compte ?
            </p>
            <button
              type="button"
              className="button-yes"
              onClick={confirmDeleteAccount}
            >
              Oui
            </button>
            <button
              type="button"
              className="button-no"
              onClick={cancelDeleteAccount}
            >
              Non
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
