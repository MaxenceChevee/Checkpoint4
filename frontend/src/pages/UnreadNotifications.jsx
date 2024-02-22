import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const UnreadNotifications = () => {
  const { user } = useContext(AuthContext);
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  const markAsRead = async (notificationId) => {
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
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const moveToReadNotifications = async (notificationId) => {
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

  const handleNotificationClick = async (notificationId) => {
    await markAsRead(notificationId);
    await moveToReadNotifications(notificationId);
  };

  const handleAccept = async (notificationId) => {
    try {
      const jwtToken = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3310/api/friend-requests/${notificationId}/accept?userId=${user.id}`,
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
      console.error("Error accepting friend request:", error);
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

      const updatedNotifications = unreadNotifications.filter(
        (notification) => notification.id !== notificationId
      );
      setUnreadNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
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
          await moveToReadNotifications(notification.id);
        }
      });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [user, unreadNotifications]);

  return (
    <div>
      <h2>Notifications non lues :</h2>
      <ul>
        {unreadNotifications.map((notification) => (
          <li key={notification.id}>
            <button
              type="button"
              onClick={() => handleNotificationClick(notification.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNotificationClick(notification.id);
                }
              }}
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              {notification.content}
              {notification.type === "gift" && (
                <p>{`${notification.sender_pseudoname} vous a envoyé un cadeau : ${notification.credits_amount} crédits.`}</p>
              )}
              {notification.type === "friend_request" && (
                <div>
                  {`Demande d'ami de ${notification.sender_pseudoname}`}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(notification.id);
                    }}
                  >
                    Accepter
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(notification.id);
                    }}
                  >
                    Rejeter
                  </button>
                </div>
              )}
              {notification.type === "friend_accept" && (
                <p>{`${notification.sender_pseudoname} a accepté votre demande d'ami`}</p>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnreadNotifications;
