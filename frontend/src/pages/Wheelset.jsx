import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import WheelComponent from "react-wheel-of-prizes";
import { useAuth } from "../context/AuthContext";
import "../styles/Wheelset.scss";

const Wheelset = () => {
  const { user, setUser } = useAuth();
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const segments = ["$10", "$100", "$200", "$500", "$1000"];
  const segColors = ["#EE4040", "#F0CF50", "#815CD1", "#3DA5E0", "#34A24F"];

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

      const currentTime = new Date();
      const lastSpinTime = new Date(userRef.current.last_wheel_spin);

      // Vérifier si l'utilisateur a déjà tourné la roue aujourd'hui
      if (currentTime - lastSpinTime < 24 * 60 * 60 * 1000) {
        console.warn("La roue peut être tournée une fois par jour.");
        return;
      }

      await updateUserCreditsOnServer(userRef.current.id, newCredits);

      setUser((prevUser) => ({
        ...prevUser,
        credits: newCredits,
        last_wheel_spin: new Date().toISOString(),
      }));

      setIsWheelSpinning(false);
    } catch (error) {
      console.error("Error updating credits:", error);
    }
  };

  const performWheelSpin = async () => {
    try {
      const jwtToken = localStorage.getItem("token");

      if (!jwtToken || !userRef.current) {
        console.error("Invalid token or user ID");
        throw new Error("Invalid token or user ID");
      }

      // Appel à l'API pour faire tourner la roue
      const response = await axios.post(
        `http://localhost:3310/api/wheel/spin`,
        {},
        { headers: { "x-auth-token": jwtToken } }
      );

      if (response.status === 200) {
        // La rotation de la roue a réussi
        const { winner, newCredits } = response.data;

        return { winner, newCredits };
      }
      // La rotation de la roue a échoué
      console.error("Error spinning the wheel:", response.statusText);
      throw new Error("Error spinning the wheel");
    } catch (error) {
      console.error("Error spinning the wheel:", error);
      throw new Error("Error spinning the wheel");
    }
  };

  const startWheelSpin = async () => {
    try {
      const jwtToken = localStorage.getItem("token");

      if (!jwtToken || !user) {
        console.error("Invalid token or user ID");
        return;
      }

      // Appel à l'API pour vérifier si l'utilisateur peut faire tourner la roue
      const response = await axios.post(
        `http://localhost:3310/api/users/${user.id}/check-wheel-spin`,
        {},
        { headers: { "x-auth-token": jwtToken } }
      );

      if (response.status === 200 && response.data.canSpin) {
        // L'utilisateur peut faire tourner la roue, procédez à la rotation
        setIsWheelSpinning(true);
        await performWheelSpin();
        setIsWheelSpinning(false);
      } else {
        console.warn("La roue peut être tournée une fois par jour.");
      }
    } catch (error) {
      console.error("Error starting wheel spin:", error);
    }
  };

  return (
    <div className="wheel-of-fortune-container">
      <div className={`wheel ${isWheelSpinning ? "spinning" : ""}`}>
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
