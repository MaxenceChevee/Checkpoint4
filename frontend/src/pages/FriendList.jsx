import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/FriendList.scss";

const FriendsList = () => {
  const { user } = useContext(AuthContext);
  const [friendsList, setFriendsList] = useState([]);

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
          setFriendsList(response.data);
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

  return (
    <div className="friends-list-container">
      <h2>Liste d'amis :</h2>
      <ul className="friends-list">
        {friendsList.map((friendGroup, index) => (
          <React.Fragment
            key={`friendGroup-${friendGroup[0]?.groupId || index}`}
          >
            {friendGroup.map(
              (friend) =>
                friend &&
                friend.id &&
                friend.firstname &&
                friend.lastname &&
                friend.pseudoname && (
                  <li key={`friend-${friend.id}`} className="friend-item">
                    <span className="friend-name">
                      {friend.firstname} {friend.lastname}
                    </span>{" "}
                    ({friend.pseudoname}) Ce joueur possède actuellement{" "}
                    <span className="friend-credits">{friend.credits}$</span>
                  </li>
                )
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
