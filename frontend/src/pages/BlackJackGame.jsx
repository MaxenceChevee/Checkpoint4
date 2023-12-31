import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import "../styles/BlackJackGame.scss";

const BlackjackGame = () => {
  const [deck, setDeck] = useState([]);
  const [dealer, setDealer] = useState(null);
  const [player, setPlayer] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [currentBet, setCurrentBet] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState(null);

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

    const playerStartingHand = [playerCard1.randomCard, playerCard2.randomCard];
    const dealerStartingHand = [dealerCard1.randomCard, {}];

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
      setWallet(100);
      setInputValue("");
      setCurrentBet(null);
      setGameOver(false);
      setMessage(null);
    }
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const placeBet = () => {
    const betAmount = parseInt(inputValue, 10);

    if (betAmount > wallet) {
      setMessage("Tu n'as pas assez de crédits");
    } else if (betAmount % 1 !== 0) {
      setMessage("Please bet whole numbers only.");
    } else {
      const newWallet = wallet - betAmount;
      setWallet(newWallet);
      setInputValue("");
      setCurrentBet(betAmount);
    }
  };

  const hit = () => {
    if (!gameOver) {
      if (currentBet) {
        const { randomCard, updatedDeck } = getRandomCard(deck);
        const newPlayer = { ...player };
        newPlayer.cards.push(randomCard);
        newPlayer.count = getCount(newPlayer.cards);

        if (newPlayer.count > 21) {
          setPlayer(newPlayer);
          setGameOver(true);
          setMessage("BUST!");
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

  const dealerDraw = (currentDealer, currentDeck) => {
    const { randomCard, updatedDeck } = getRandomCard(currentDeck);

    const newDealer = { ...currentDealer };

    newDealer.cards.push(randomCard);
    newDealer.count = getCount(newDealer.cards);
    return { dealer: newDealer, updatedDeck };
  };
  const getWinner = (dealerParam, playerParam) => {
    if (dealerParam.count > playerParam.count) {
      return "dealer";
    }
    if (dealerParam.count < playerParam.count) {
      return "player";
    }
    return "push";
  };
  const stand = () => {
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
        setDeck(updatedDeck);
        setDealer(newDealer);
        setWallet(wallet + currentBet * 2);
        setGameOver(true);
        setMessage("Dealer bust! You win!");
      } else {
        const winner = getWinner(newDealer, player);
        let newWallet = wallet;
        let newMessage;

        if (winner === "dealer") {
          newMessage = "Le Dealer gagne...";
        } else if (winner === "player") {
          newWallet += currentBet * 2;
          newMessage = "Tu gagnes!";
        } else {
          newWallet += currentBet;
          newMessage = "Egalité";
        }

        setDeck(updatedDeck);
        setDealer(newDealer);
        setWallet(newWallet);
        setGameOver(true);
        setMessage(newMessage);
      }
    } else {
      setMessage(
        "Partie terminée ! Vous êtes ruiné(e) ! Veuillez démarrer une nouvelle partie."
      );
    }
  };

  const inputChange = (e) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
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
        isFaceUp={card.isFaceUp}
        className={card.drawn ? "drawn-card" : ""}
      />
    ));
  };

  return (
    <div>
      <div className="buttons">
        <button type="button" onClick={() => hit()}>
          +1 Carte
        </button>
        <button type="button" onClick={() => stand()}>
          Rester
        </button>
      </div>

      <p>Crédits: ${wallet}</p>
      {!currentBet ? (
        <div className="input-bet">
          <form>
            <input
              type="text"
              name="bet"
              placeholder=""
              value={inputValue}
              onChange={(e) => inputChange(e)}
            />
          </form>
          <button type="button" onClick={() => placeBet()}>
            Pari {inputValue}$
          </button>
        </div>
      ) : null}
      {gameOver ? (
        <div className="buttons">
          <button type="button" onClick={() => startNewGame("continue")}>
            Continue
          </button>
        </div>
      ) : null}
      <p>Tes cartes ({player && player.count})</p>
      <div className="card-container">
        {player && renderCards(player.cards)}
      </div>

      <p>Cartes du Dealer ({dealer && dealer.count})</p>
      <div className="card-container">
        {dealer && renderCards(dealer.cards)}
      </div>
      <div className="deck">
        <p>Paquet: {deck.length} Cartes mélangées</p>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default BlackjackGame;
