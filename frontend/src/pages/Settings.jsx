import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/Settings.scss";

function Settings() {
  const { user } = useContext(AuthContext);
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
          ...formData,
          currentPassword: formData.currentPassword.trim(),
        }
      );

      const updatedUser = response.data.user;

      setFormData((prevData) => ({
        ...prevData,
        ...updatedUser,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
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

  return (
    <div className="settings-container">
      <h2>Settings</h2>
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
          First Name:
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
        </label>
        <label>
          Pseudoname:
          <input
            type="text"
            name="pseudoname"
            value={formData.pseudoname}
            onChange={handleChange}
          />
        </label>
        <label>
          Current Password:
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Save Changes</button>
      </form>

      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default Settings;
