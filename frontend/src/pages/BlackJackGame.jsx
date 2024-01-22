import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import "../styles/BlackJackGame.scss";

const BlackjackGame = () => {
  const { user, updateCredits } = useAuth();
  const [deck, setDeck] = useState([]);
  const [dealer, setDealer] = useState(null);
  const [player, setPlayer] = useState(null);
  const [wallet, setWallet] = useState(user ? user.credits : 0);
  const [inputValue, setInputValue] = useState("");
  const [currentBet, setCurrentBet] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState(null);
  const [betOptions] = useState([20, 50, 100]);

  useEffect(() => {
    if (user) {
      setWallet(user.credits);
    }
  }, [user]);

  const handleBetOptionClick = (option) => {
    setInputValue(option.toString());
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleIncrement = () => {
    const currentValue = parseFloat(inputValue.replace(/[^\d.]/g, "")) || 0;
    const newValue = (currentValue + 10).toString();
    setInputValue(newValue);
  };

  const handleDecrement = () => {
    const currentValue = parseFloat(inputValue.replace(/[^\d.]/g, "")) || 0;
    const newValue = Math.max(currentValue - 10, 0).toString();
    setInputValue(newValue);
  };

  const getWinnerMessage = (result, amount) => {
    switch (result) {
      case "dealer":
        return `Manqué ! Vous venez de perdre ${amount}$`;
      case "player":
        return `Bravo ! Vous avez gagné ${amount}$`;
      case "push":
        return `Égalité ! Votre mise de ${amount}$ est remboursée !`;
      default:
        return "";
    }
  };

  const generateDeck = () => {
    const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const newDeck = [];

    for (let i = 0; i < cards.length; i += 1) {
      for (let j = 0; j < suits.length; j += 1) {
        newDeck.push({ number: cards[i], suit: suits[j] });
      }
    }

    return newDeck;
  };

  const getRandomCard = (currentDeck) => {
    const updatedDeck = [...currentDeck];
    const randomIndex = Math.floor(Math.random() * updatedDeck.length);
    const randomCard = updatedDeck[randomIndex];
    updatedDeck.splice(randomIndex, 1);
    return { randomCard, updatedDeck };
  };

  const getCount = (cards) => {
    const rearranged = [];
    cards.forEach((card) => {
      if (card.number === "A") {
        rearranged.push(card);
      } else if (card.number) {
        rearranged.unshift(card);
      }
    });

    return rearranged.reduce((total, card) => {
      if (card.number === "J" || card.number === "Q" || card.number === "K") {
        return total + 10;
      }

      if (card.number === "A") {
        return total + 11 <= 21 ? total + 11 : total + 1;
      }

      return total + card.number;
    }, 0);
  };

  const dealCards = (initialDeck) => {
    const playerCard1 = getRandomCard(initialDeck);
    const dealerCard1 = getRandomCard(playerCard1.updatedDeck);
    const playerCard2 = getRandomCard(dealerCard1.updatedDeck);

    const playerStartingHand = [playerCard1.randomCard];
    const dealerStartingHand = [dealerCard1.randomCard, { hidden: true }];

    const playerHand = {
      cards: playerStartingHand.map((card) => ({
        ...card,
        isFaceUp: true,
        drawn: false,
      })),
      count: getCount(playerStartingHand),
    };

    const dealerHand = {
      cards: dealerStartingHand.map((card, index) => ({
        ...card,
        isFaceUp: index === 0,
        drawn: false,
      })),
      count: getCount(dealerStartingHand),
    };

    return {
      updatedDeck: playerCard2.updatedDeck,
      player: playerHand,
      dealer: dealerHand,
    };
  };

  const startNewGame = (type) => {
    if (wallet !== null && wallet !== undefined) {
      if (type === "continue") {
        if (wallet > 0) {
          const newDeck = deck.length < 10 ? generateDeck() : deck;
          const {
            updatedDeck: newUpdatedDeck,
            player: newPlayer,
            dealer: newDealer,
          } = dealCards(newDeck);

          setDeck(newUpdatedDeck);
          setDealer(newDealer);
          setPlayer(newPlayer);
          setCurrentBet(null);
          setGameOver(false);
          setMessage(null);
        } else {
          setMessage("Game over! You are broke! Please start a new game.");
        }
      } else {
        const newDeck = generateDeck();
        const {
          updatedDeck: newUpdatedDeck,
          player: newPlayer,
          dealer: newDealer,
        } = dealCards(newDeck);

        setDeck(newUpdatedDeck);
        setDealer(newDealer);
        setPlayer(newPlayer);
        setWallet(user.credits);
        setInputValue("");
        setCurrentBet(null);
        setGameOver(false);
        setMessage(null);
      }
    } else {
      console.error("Wallet is null or undefined");
    }
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const placeBet = () => {
    const rawBetAmount = parseFloat(inputValue.replace(/[^\d.]/g, ""));

    if (Number.isNaN(rawBetAmount) || rawBetAmount < 10) {
      setMessage("La mise minimale est de 10$");
      return;
    }

    const roundedBetAmount = Math.ceil(rawBetAmount / 10) * 10;
    const adjustedBetAmount = Math.min(roundedBetAmount, wallet);

    updateCredits(wallet - adjustedBetAmount);
    setInputValue("");
    setCurrentBet(adjustedBetAmount);
  };

  const dealerDraw = (currentDealer, currentDeck) => {
    const { randomCard, updatedDeck } = getRandomCard(currentDeck);

    const newDealer = { ...currentDealer };

    newDealer.cards.push(randomCard);
    newDealer.count = getCount(newDealer.cards);
    return { dealer: newDealer, updatedDeck };
  };

  const getWinner = (dealerParam, playerParam) => {
    if (dealerParam.count > 21) {
      return "player";
    }

    if (playerParam.count > 21) {
      return "dealer";
    }

    if (dealerParam.count > playerParam.count) {
      return "dealer";
    }

    if (dealerParam.count < playerParam.count) {
      return "player";
    }

    const dealerBlackjack =
      dealerParam.cards.length === 2 && dealerParam.count === 21;
    const playerBlackjack =
      playerParam.cards.length === 2 && playerParam.count === 21;

    if (dealerBlackjack && playerBlackjack) {
      return "push";
    }

    if (dealerBlackjack) {
      return "dealer";
    }

    if (playerBlackjack) {
      return "player";
    }

    return "push";
  };

  const stand = async () => {
    if (!gameOver) {
      let updatedDeck = [...deck];
      let newDealer = { ...dealer };
      newDealer.cards.pop();

      while (newDealer.count < 17) {
        const draw = dealerDraw(newDealer, updatedDeck);
        newDealer = draw.dealer;
        updatedDeck = draw.updatedDeck;
      }

      if (newDealer.count > 21) {
        const newWallet = wallet + currentBet * 2;
        await updateCredits(newWallet);
        setWallet(newWallet);
        setDeck(updatedDeck);
        setDealer(newDealer);
        setGameOver(true);
        setMessage(`Le croupier dépasse 21 ! Vous gagnez ${currentBet * 2}$`);
      } else {
        const winner = getWinner(newDealer, player);

        if (winner === "dealer") {
          // Le Dealer gagne, aucune mise n'est récupérée
          const lostAmount = currentBet;
          updateCredits(wallet).then(() => {
            setDeck(updatedDeck);
            setDealer(newDealer);
            setGameOver(true);
            setMessage(getWinnerMessage(winner, lostAmount));
          });
        } else if (winner === "player") {
          // Le joueur gagne la mise (2:1 pour un blackjack naturel)
          const winnings = currentBet * (player.cards.length === 2 ? 2.5 : 2);
          const newWallet = wallet + winnings;
          setWallet(newWallet);
          updateCredits(newWallet).then(() => {
            setDeck(updatedDeck);
            setDealer(newDealer);
            setGameOver(true);
            setMessage(`BLACKJACK !!!!! Vous remportez ${winnings}$`);
          });
        } else {
          // Égalité, le joueur récupère sa mise
          const refund = currentBet;
          const newWallet = wallet + refund;
          setWallet(newWallet);
          updateCredits(newWallet).then(() => {
            setDeck(updatedDeck);
            setDealer(newDealer);
            setGameOver(true);
            setMessage(getWinnerMessage(winner, refund));
          });
        }
      }
    } else {
      setMessage(
        "Partie terminée ! Vous êtes ruiné(e) ! Veuillez démarrer une nouvelle partie."
      );
    }
  };
  const hit = () => {
    if (!gameOver) {
      if (currentBet) {
        const { randomCard, updatedDeck } = getRandomCard(deck);
        const newPlayer = { ...player };
        newPlayer.cards.push(randomCard);
        newPlayer.count = getCount(newPlayer.cards);

        if (newPlayer.count === 21) {
          const winnings = currentBet * 2.5;
          const newWallet = wallet + winnings;
          setWallet(newWallet);
          updateCredits(newWallet).then(() => {
            setDeck(updatedDeck);
            setPlayer(newPlayer);
            setGameOver(true);
            setMessage(`BLACKJACK !!!! Vous remportez ${winnings}$`);
          });
        } else if (newPlayer.count > 21) {
          setPlayer(newPlayer);
          setGameOver(true);
          setMessage(`Vous avez dépassé 21, vous perdez ${currentBet}$`);
        } else {
          setDeck(updatedDeck);
          setPlayer(newPlayer);
        }
      } else {
        setMessage("Please place a bet.");
      }
    } else {
      setMessage("Game over! Please start a new game.");
    }
  };

  const handleKeyDown = (e) => {
    const enter = 13;

    if (e.keyCode === enter) {
      placeBet();
    }
  };

  useEffect(() => {
    const body = document.querySelector("body");
    body.addEventListener("keydown", handleKeyDown);

    return () => {
      body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const generateKey = (card, index) => {
    return `${card.number}${card.suit}${index}`;
  };

  const renderCards = (cards) => {
    return cards.map((card, index) => (
      <Card
        key={generateKey(card, index)}
        rank={card.number}
        suit={card.suit}
        isFaceUp={index === 0 || card.drawn}
        className={card.drawn ? "drawn-card" : ""}
      />
    ));
  };

  return (
    <div className="blackjack-game">
      <div className="buttons">
        <button type="button" onClick={() => hit()} className="action-button">
          +1 Carte
        </button>
        <button type="button" onClick={() => stand()} className="action-button">
          Rester
        </button>
      </div>

      <p className="section-title">Crédits: ${wallet}</p>
      {currentBet ? (
        <p className="section-title">
          Mise actuelle: <span style={{ color: "red" }}>{currentBet}$</span>
        </p>
      ) : (
        <div className="input-bet">
          <div className="bet-options">
            {betOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleBetOptionClick(option)}
              >
                {option}$
              </button>
            ))}
          </div>
          <div className="input-with-arrows">
            <button type="button" onClick={handleIncrement}>
              &#9650;
            </button>
            <input
              type="text"
              name="bet"
              placeholder="10"
              value={inputValue}
              onChange={(e) => handleInputChange(e)}
            />
            <button type="button" onClick={handleDecrement}>
              &#9660;
            </button>
          </div>
          <button type="button" onClick={() => placeBet()}>
            Pari {inputValue}$
          </button>
        </div>
      )}
      {gameOver ? (
        <div className="buttons">
          <button type="button" onClick={() => startNewGame("continue")}>
            Continue
          </button>
        </div>
      ) : null}
      <p className="section-title">
        Tes cartes (
        <span style={{ color: "red" }}>{player && player.count}</span>)
      </p>

      <div className="card-container">
        {player && renderCards(player.cards)}
      </div>

      <p className="section-title">
        Cartes du Dealer (
        <span style={{ color: "red" }}>{dealer && dealer.count}</span>)
      </p>

      <div className="card-container">
        {dealer && renderCards(dealer.cards)}
      </div>

      <p className="message">{message}</p>
    </div>
  );
};

export default BlackjackGame;
