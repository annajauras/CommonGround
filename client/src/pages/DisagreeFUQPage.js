import { useParams, useNavigate, useLocation } from "react-router-dom";
import { disagreeResponses } from "../database";
import Countdown from "../components/Countdown";
import { useState, useEffect } from "react";
import { useSocket } from "../components/SocketContext";

const DisagreeFUQPage = () => {
  //Described in other page components
  const socket = useSocket();
  const location = useLocation();
  const { session, player, playerArray, disagreePlayerList, agreePlayerList, question, firstRound, lastQuestion} = location.state || {};
  const navigate = useNavigate();
  // Finds the appropriate follow-up response by ID
  const { userId, disagreeResponseId } = useParams();
  const followUp = disagreeResponses.find(
    (response) => response.id === disagreeResponseId
  );
  //State variables for tracking countdown, current player, round progress, etc.
  const [countdownFinished, setCountdownFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(disagreePlayerList[currentIndex]);
  const [roundFinished, setRoundFinished] = useState(false);
  const [currentAgreedPlayers, setCurrentAgreedPlayers] = useState(agreePlayerList);
  const [currentDisgareedPlayers, setCurrentDisagreedPlayers] = useState(disagreePlayerList);
  const [currentPlayerArray, setCurrentPlayerArray] = useState(playerArray);
  
  const handleCountdownEnd = () => {
    setCountdownFinished(true); // Set the state to true when countdown is over
  };
  //Handles getting next player
  const changeTurn = () => {
    if (currentIndex < currentDisgareedPlayers.length - 1){
    socket.emit("send_index_disagree", currentIndex, session);
    }
    else{
      setRoundFinished(true)
      console.log(roundFinished);
    }
  }

  // Updates agreed players list in real-time (in the case that players leave)
  useEffect(() => {
    socket.on("get_agreed_players", (newAgreedPlayersList) => {
      setCurrentAgreedPlayers(newAgreedPlayersList);
    });
    return () => {
      socket.off("get_agreed_players");
  };
  
  }, [socket]);
  //Updates player list in real time  (in the case that players leave)
  useEffect(() => {
    socket.on("get_player_array", (newPlayersList) => {
      setCurrentPlayerArray(newPlayersList);
    });
    return () => {
      socket.off("get_player_array");
  };
  
  }, [socket]);
  // Updates disagreed players list in real-time (in the case that players leave)
  useEffect(() => {
    socket.on("get_disagreed_players", (newDisagreedPlayersList) => {
      setCurrentDisagreedPlayers(newDisagreedPlayersList);
    });
    return () => {
      socket.off("get_disagreed_players");
  };
  
  }, [socket]);

 //Handles countdown finish and navigation
  useEffect(() => {
    if (countdownFinished && roundFinished) {
      navigate(`/wait/${player.playerID}`, {
        state: { session: session, player: player, playerArray: currentPlayerArray, disagreeGroupHere: true, question: question, firstRound: firstRound, lastQuestion, disagreePlayerList: currentDisgareedPlayers, agreePlayerList: currentAgreedPlayers }
      });
    }
  }, [countdownFinished, roundFinished, navigate, player.playerID, session, player, currentPlayerArray, question]);
  
  useEffect(() => {
    socket.on("get_index_disagree", (index) => {
      console.log("new index: " + index);
      setCurrentIndex(index);
      setCurrentPlayer(currentDisgareedPlayers[index]);
    });
  
    // Clean up the socket listener on component unmount
    return () => {
        socket.off("get_index_disagree");
    };
    
  }, [socket]);

   //Checks if session has ended due to players/admin leaving the game
    useEffect(() => {
      socket.on("session_ended", (endedSessionId) => {
        if (endedSessionId === session) {
          // Show a confirmation dialog; navigate only if the user clicks "OK"
          if (window.confirm("The session has ended. Click OK to return to the home page.")) {
            navigate("/");
          }
        }
      });
      
  
      return () => socket.off("session_ended");
    }, [socket, session, navigate]);


  if (!countdownFinished) {
    return (
      <>
        <h1>Please find group purple.</h1>
        <div className="disagree-page-container">
          {currentDisgareedPlayers.map((player, index) => (
            <h2 key={index}>{player.playerName}</h2>
          ))}
        </div>
        <Countdown onCountdownEnd={handleCountdownEnd} />
        </>
    );
  }
    
  if (countdownFinished && !roundFinished && currentDisgareedPlayers[currentIndex + 1] !== undefined) {
    return (
      <>
        <h3>{currentPlayer.playerName}, it's your turn to share.</h3>
        <div className="disagree-page-container">
          <h1>{followUp.disagreeFollowUp}</h1>
        </div>
        <Countdown onCountdownEnd={changeTurn} />
        <h3>
          Pssst. {currentDisgareedPlayers[currentIndex + 1].playerName}, you are up next.
        </h3>
      </>
    );
  }
  //UI based on Countdown status, how many players must still answer, and round being finished
  if (countdownFinished && !roundFinished && currentDisgareedPlayers[currentIndex + 1] === undefined) {
    return (
      <>
        <h3>{currentPlayer.playerName}, it's your turn to share.</h3>
        <div className="disagree-page-container">
          <h1>{followUp.disagreeFollowUp}</h1>
        </div>
        <Countdown onCountdownEnd={changeTurn} />
      </>
    );
  }
};
export default DisagreeFUQPage;
