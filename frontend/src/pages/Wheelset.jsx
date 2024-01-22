import React, { useEffect, useRef } from "react";
import axios from "axios";
import WheelComponent from "react-wheel-of-prizes";
import { useAuth } from "../context/AuthContext";
import "../styles/Wheelset.scss";

const Wheelset = () => {
  const { user, setIsSpinning, isSpinning, setUser } = useAuth();
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const segments = ["$10", "$100", "$200", "$500", "$1000"];
  const segColors = ["#EE4040", "#F0CF50", "#815CD1", "#3DA5E0", "#34A24F"];

  const startWheelSpin = () => {
    if (!isSpinning && userRef.current) {
      setIsSpinning(true);
    } else {
      console.warn("User not available. Cannot start spinning.");
    }
  };

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
      }));

      if (setIsSpinning) {
        setIsSpinning(false);
      }
    } catch (error) {
      console.error("Error updating credits:", error);
    }
  };

  return (
    <div className="wheel-of-fortune-container">
      <div className={`wheel ${isSpinning ? "spinning" : ""}`}>
        <WheelComponent
          segments={segments}
          segColors={segColors}
          onFinished={onFinished}
          primaryColor="black"
          contrastColor="white"
          buttonText="Spin"
          isOnlyOnce={false}
          style={{ width: "400px", height: "400px" }}
          upDuration={500}
          downDuration={600}
          fontFamily="Arial"
          onClick={startWheelSpin}
        />
      </div>
    </div>
  );
};

export default Wheelset;
