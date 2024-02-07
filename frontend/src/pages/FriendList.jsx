import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

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
    <div>
      <h2>Liste d'amis :</h2>
      <ul>
        {friendsList.map((friendGroup) => (
          <React.Fragment key={friendGroup[0].id}>
            {friendGroup.map((friend) => (
              <li key={friend.id}>
                {friend.firstname} {friend.lastname} ({friend.pseudoname})
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
