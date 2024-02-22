import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ReadNotifications = () => {
  const { user } = useContext(AuthContext);
  const [readNotifications, setReadNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!user) {
          return;
        }

        const jwtToken = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:3310/api/readNotifications/${user.id}`,
          {
            headers: {
              "x-auth-token": jwtToken,
            },
          }
        );

        setReadNotifications(response.data.notifications);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des notifications lues :",
          error
        );
      }
    };

    fetchNotifications();
  }, [user]);

  const handleAcceptFriendRequest = async (notificationId) => {
    try {
      const jwtToken = localStorage.getItem("token");
      const userId = user.id;
      await axios.put(
        `http://localhost:3310/api/friend-requests/${notificationId}/accept?userId=${userId}`,
        {},
        {
          headers: {
            "x-auth-token": jwtToken,
          },
        }
      );

      const updatedNotifications = readNotifications.filter(
        (notification) => notification.id !== notificationId
      );
      setReadNotifications(updatedNotifications);
    } catch (error) {
      console.error(
        "Erreur lors de l'acceptation de la demande d'ami :",
        error
      );
    }
  };

  const handleRejectFriendRequest = async (notificationId) => {
    try {
      const jwtToken = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3310/api/friend-requests/${notificationId}/reject`,
        {},
        {
          headers: {
            "x-auth-token": jwtToken,
          },
        }
      );

      const updatedNotifications = readNotifications.filter(
        (notification) => notification.id !== notificationId
      );
      setReadNotifications(updatedNotifications);
    } catch (error) {
      console.error("Erreur lors du rejet de la demande d'ami :", error);
    }
  };

  return (
    <div>
      <h2>Notifications lues :</h2>
      <ul>
        {readNotifications &&
          readNotifications.map((notification) => (
            <li key={notification.id}>
              {notification.content}
              {notification.type === "gift" && (
                <p>{`${notification.sender_pseudoname} vous a envoyé un cadeau : ${notification.credits_amount} crédits.`}</p>
              )}
              {notification.type === "friend_request" && (
                <div>
                  <p>{`${notification.sender_pseudoname} vous a envoyé une demande d'ami`}</p>
                  <button
                    type="button"
                    onClick={() => handleAcceptFriendRequest(notification.id)}
                  >
                    Accepter
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRejectFriendRequest(notification.id)}
                  >
                    Rejeter
                  </button>
                </div>
              )}
              {notification.type === "friend_accept" && (
                <p>{`${notification.sender_pseudoname} a accepté votre demande d'ami`}</p>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ReadNotifications;
