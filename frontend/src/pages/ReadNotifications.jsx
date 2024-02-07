import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ReadNotifications = () => {
  const { user } = useContext(AuthContext);
  const [readNotifications, setReadNotifications] = useState([]);

  useEffect(() => {
    const fetchReadNotifications = async () => {
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

    fetchReadNotifications();
  }, [user]);

  const handleAccept = async (notificationId) => {
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

  const handleReject = async (notificationId) => {
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
        {readNotifications.map((notification) => (
          <li key={notification.id}>
            {notification.content}
            {notification.type === "friend_request" && (
              <div>
                {!notification.processed && (
                  <>
                    <p>{`${notification.sender_pseudoname} vous a envoyé une demande d'ami`}</p>
                    <button
                      type="button"
                      onClick={() => handleAccept(notification.id)}
                    >
                      Accepter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(notification.id)}
                    >
                      Rejeter
                    </button>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReadNotifications;
