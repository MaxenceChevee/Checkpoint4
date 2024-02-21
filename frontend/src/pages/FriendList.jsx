import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/FriendList.scss";
import SendGift from "../components/SendGift";

const FriendsList = () => {
  const { user } = useContext(AuthContext);
  const [friendsList, setFriendsList] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [friendToDeleteId, setFriendToDeleteId] = useState(null);

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        if (!user) {
          return;
        }
        const jwtToken = localStorage.getItem("token");
        if (user.id) {
          const response = await axios.get(
            `http://localhost:3310/api/friends/${user.id}`,
            {
              headers: {
                "x-auth-token": jwtToken,
              },
            }
          );

          if (response.data[0].length === 0) {
            setFriendsList([]);
          } else {
            setFriendsList(response.data);
          }
        } else {
          console.error(
            "Impossible de récupérer la liste d'amis : utilisateur non connecté"
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la liste d'amis :",
          error
        );
      }
    };

    fetchFriendsList();
  }, [user]);

  const handleRemoveFriend = (friendId) => {
    setShowDeletePopup(true);
    setFriendToDeleteId(friendId);
  };

  const confirmDeleteFriend = async () => {
    try {
      const jwtToken = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3310/api/friends/${friendToDeleteId}/unfriend`,
        {
          headers: {
            "x-auth-token": jwtToken,
          },
        }
      );

      const updatedFriendsList = friendsList.map((group) =>
        group.filter((friend) => friend.id !== friendToDeleteId)
      );
      const filteredList = updatedFriendsList.filter(
        (group) => group.length > 0
      );
      setFriendsList(filteredList);
      setIsEmpty(filteredList.length === 0);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'ami :", error);
    } finally {
      setShowDeletePopup(false);
      setFriendToDeleteId(null);
    }
  };

  const cancelDeleteFriend = () => {
    setShowDeletePopup(false);
    setFriendToDeleteId(null);
  };

  return (
    <div className="friends-list-container">
      <h2>Liste d'amis :</h2>
      <ul className="friends-list">
        {friendsList.length === 0 || isEmpty ? (
          <p>
            Vous n'avez pas encore d'ami,{" "}
            <Link to="/add-friend" className="add-friend-link">
              cliquez ici
            </Link>{" "}
            pour ajouter un ami.
          </p>
        ) : (
          friendsList.map((friendGroup, index) => (
            <React.Fragment
              key={`friendGroup-${friendGroup[0]?.groupId || index}`}
            >
              {friendGroup.map((friend) =>
                friend &&
                friend.id &&
                friend.firstname &&
                friend.lastname &&
                friend.pseudoname ? (
                  <li key={`friend-${friend.id}`} className="friend-item">
                    <span className="friend-name">
                      {friend.firstname} {friend.lastname}
                    </span>{" "}
                    ({friend.pseudoname}) Ce joueur possède actuellement{" "}
                    <span className="friend-credits">{friend.credits}$</span>{" "}
                    <button
                      type="button"
                      onClick={() => handleRemoveFriend(friend.id)}
                    >
                      Supprimer
                    </button>
                    <SendGift senderId={user.id} receiverId={friend.id} />
                  </li>
                ) : null
              )}
            </React.Fragment>
          ))
        )}
      </ul>

      {showDeletePopup && (
        <div className="modal-container">
          <div
            className="modal-background"
            role="presentation"
            onClick={cancelDeleteFriend}
          />
          <div className="modal-content">
            <p>Êtes-vous sûr de vouloir supprimer cet ami ?</p>
            <div className="modal-buttons">
              <button
                type="button"
                className="button-yes"
                onClick={confirmDeleteFriend}
              >
                Oui
              </button>
              <button
                type="button"
                className="button-no"
                onClick={cancelDeleteFriend}
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
