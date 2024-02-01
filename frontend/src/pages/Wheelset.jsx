import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import WheelComponent from "react-wheel-of-prizes";
import { useAuth } from "../context/AuthContext";
import "../styles/Wheelset.scss";
import "../styles/ModalStyles.scss";

const Wheelset = () => {
  const { user, setUser } = useAuth();
  const canSpinRef = useRef(false);
  const userRef = useRef(user);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:3310/api/users/${user.id}/check-wheel-spin`)
        .then((response) => {
          canSpinRef.current = response.data.canSpin;
        })
        .catch((error) => {
          if (!errorMessage && !isModalOpen) {
            setErrorMessage(error.response.data.message);
            setIsModalOpen(true);
          }
          canSpinRef.current = false;
        });
    }
  }, [user]);

  const segments = ["$10", "$100", "$200", "$500", "$700", "$1000"];
  const segColors = [
    "#B71C1C",
    "#000000",
    "#B71C1C",
    "#000000",
    "#B71C1C",
    "#000000",
  ];

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
      throw new Error("Error updating credits on server");
    }
  };

  const onFinished = async (winner) => {
    try {
      if (canSpinRef.current === false) return;
      if (!userRef.current || !winner || !winner.startsWith("$")) {
        console.warn("Invalid user or winner. Aborting onFinished.");
        return;
      }

      const creditsWon = parseInt(winner.slice(1), 10);
      const newCredits = (userRef.current.credits || 0) + creditsWon;

      if (typeof newCredits !== "number" || Number.isNaN(newCredits)) {
        console.error("Invalid newCredits. Must be a valid number.");
        return;
      }

      await updateUserCreditsOnServer(userRef.current.id, newCredits);

      setUser((prevUser) => ({
        ...prevUser,
        credits: newCredits,
        last_wheel_spin: new Date().toISOString(),
      }));
      setErrorMessage(
        `Vous avez gagné ${creditsWon} crédits ! Revenez demain pour retenter votre chance !`
      );
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error updating credits:", error);
    }
  };

  return (
    <div className="wheel-of-fortune-container">
      <WheelComponent
        segments={segments}
        segColors={segColors}
        onFinished={onFinished}
        primaryColor="black"
        contrastColor="white"
        buttonText="Spin"
        isOnlyOnce={false}
        upDuration={500}
        downDuration={600}
        fontFamily="Arial"
      />

      {isModalOpen && (
        <div className="modal-container">
          <div className="modal-content">
            <p>{errorMessage}</p>
          </div>
          <div className="modal-background" />
        </div>
      )}
    </div>
  );
};

export default Wheelset;
