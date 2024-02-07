import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const UnreadNotifications = () => {
  const { user } = useContext(AuthContext);
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  const moveUnreadToRead = async (notificationId) => {
    try {
      const jwtToken = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3310/api/notifications/${notificationId}/mark-as-read`,
        {},
        {
          headers: {
            "x-auth-token": jwtToken,
          },
        }
      );

      const updatedNotifications = unreadNotifications.filter(
        (notification) => notification.id !== notificationId
      );
      setUnreadNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error moving notification to read:", error);
    }
  };

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        if (!user) {
          return;
        }

        const jwtToken = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:3310/api/unreadNotifications/${user.id}`,
          {
            headers: {
              "x-auth-token": jwtToken,
            },
          }
        );

        setUnreadNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    };

    fetchUnreadNotifications();

    const handleUnload = async () => {
      unreadNotifications.forEach(async (notification) => {
        if (!notification.processed) {
          await moveUnreadToRead(notification.id);
        }
      });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [user, unreadNotifications]);

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

      await moveUnreadToRead(notificationId);
    } catch (error) {
      console.error(
        "Error accepting friend request and moving notification to read:",
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

      await moveUnreadToRead(notificationId);
    } catch (error) {
      console.error(
        "Error rejecting friend request and moving notification to read:",
        error
      );
    }
  };

  return (
    <div>
      <h2>Notifications non lues :</h2>
      <ul>
        {unreadNotifications.map((notification) => (
          <li key={notification.id}>
            {notification.content}
            {notification.type === "friend_request" && (
              <div>
                {`Demande d'ami de ${notification.sender_pseudoname}`}
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
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnreadNotifications;
