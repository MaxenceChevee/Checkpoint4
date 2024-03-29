import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/AddFriend.scss";

const AddFriend = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingFriendRequest, setExistingFriendRequest] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);

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

  const handleSearchClick = () => {
    setSearchClicked(true);
    handleSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
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

  const handleCloseProfile = () => {
    setSelectedUser(null);
  };

  return (
    <div className="add-friend-container">
      <h2>Recherchez un utilisateur:</h2>
      <input
        type="text"
        placeholder="Rechercher un utilisateur par pseudonyme"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="add-friend-input"
      />
      <button
        type="button"
        onClick={handleSearchClick}
        className="add-friend-button"
      >
        Rechercher
      </button>
      {loading && <li>Chargement...</li>}
      {!loading &&
        (searchResults.length > 0 || !searchClicked ? (
          searchResults.map((searchResult) => (
            <div key={searchResult.id} className="profile-card">
              <p>Profil de : {searchResult.pseudoname}</p>
              {searchResult.id !== user.id && (
                <button
                  type="button"
                  onClick={() => setSelectedUser(searchResult)}
                  className="add-friend-button"
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
        <div className="profile-card">
          <p>{selectedUser.pseudoname}</p>
          <p>Ce joueur dispose de : {selectedUser.credits}$</p>
          {existingFriendRequest && selectedUser.id !== user.id ? (
            <button
              type="button"
              onClick={handleCancelFriendRequest}
              className="add-friend-button"
            >
              Annuler la demande
            </button>
          ) : (
            selectedUser.id !== user.id && (
              <button
                type="button"
                onClick={handleAddFriend}
                className="add-friend-button"
              >
                Ajouter en ami
              </button>
            )
          )}
          <button
            type="button"
            onClick={handleCloseProfile}
            className="add-friend-button"
          >
            Masquer le profil
          </button>
        </div>
      )}
    </div>
  );
};

export default AddFriend;
