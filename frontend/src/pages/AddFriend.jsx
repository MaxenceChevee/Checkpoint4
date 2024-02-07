import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AddFriend = () => {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingFriendRequest, setExistingFriendRequest] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const senderId = user.id;

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3310/api/users/by-pseudoname/${searchQuery}`
      );
      setSearchResults(response.data.user ? [response.data.user] : []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateurs:", error);
      setLoading(false);
    }
  };

  const checkExistingFriendRequest = async (userToCheck) => {
    if (!userToCheck || !userToCheck.id) {
      console.error("ID de l'utilisateur invalide");
      return;
    }

    const jwtToken = localStorage.getItem("token");

    if (!jwtToken) {
      console.error("Access denied. No token provided.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3310/api/friend-requests/${userToCheck.id}`,
        {
          headers: {
            "x-auth-token": jwtToken,
          },
        }
      );

      setExistingFriendRequest(
        response.data.length > 0 ? response.data[0] : null
      );
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de la demande d'ami existante:",
        error
      );
    }
  };

  const handleCancelFriendRequest = async () => {
    try {
      if (!existingFriendRequest || !existingFriendRequest.id) {
        console.error("La demande d'ami à annuler n'est pas valide.");
        return;
      }

      const jwtToken = localStorage.getItem("token");
      const requestId = existingFriendRequest.id;

      await axios.delete(
        `http://localhost:3310/api/friend-requests/${requestId}/cancel`,
        {
          headers: {
            "x-auth-token": jwtToken,
          },
        }
      );

      setExistingFriendRequest(null);
    } catch (error) {
      console.error("Erreur lors de l'annulation de la demande d'ami:", error);
    }
  };

  useEffect(() => {
    if (selectedUser && selectedUser.id !== user.id) {
      checkExistingFriendRequest(selectedUser);
    }
  }, [selectedUser]);

  const handleAddFriend = async () => {
    try {
      if (!selectedUser || !selectedUser.id) {
        console.error("ID de l'utilisateur invalide");
        return;
      }

      const jwtToken = localStorage.getItem("token");

      if (!jwtToken) {
        console.error("Access denied. No token provided.");
        return;
      }

      if (existingFriendRequest) {
        console.error(
          "Une demande d'amitié existe déjà entre ces deux utilisateurs."
        );
        return;
      }

      const response = await axios.post(
        `http://localhost:3310/api/friend-requests/${selectedUser.id}`,
        null,
        {
          headers: {
            "x-auth-token": jwtToken,
          },
        }
      );

      setExistingFriendRequest({
        id: response.data.requestId,
        sender_id: senderId,
        receiver_id: selectedUser.id,
        status: "pending",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'ami:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher un utilisateur par pseudonyme"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="button" onClick={handleSearch}>
        Rechercher
      </button>
      {loading && <li>Chargement...</li>}
      {!loading &&
        (searchResults.length > 0 ? (
          searchResults.map((searchResult) => (
            <div key={searchResult.id}>
              <p>Profil de : {searchResult.pseudoname}</p>
              {searchResult.id !== user.id && (
                <button
                  type="button"
                  onClick={() => setSelectedUser(searchResult)}
                >
                  Voir le profil
                </button>
              )}
            </div>
          ))
        ) : (
          <li>Aucun utilisateur trouvé</li>
        ))}
      {selectedUser && (
        <div>
          <p>Profil de : {selectedUser.pseudoname}</p>
          <p>Ce joueur dispose de : {selectedUser.credits}$</p>
          {existingFriendRequest && selectedUser.id !== user.id ? (
            <button type="button" onClick={handleCancelFriendRequest}>
              Annuler la demande
            </button>
          ) : (
            selectedUser.id !== user.id && (
              <button type="button" onClick={handleAddFriend}>
                Ajouter en ami
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AddFriend;
