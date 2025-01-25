import { useParams, useNavigate, useLocation  } from "react-router-dom";
import { agreeResponses } from "../database";
import { useEffect, useState } from "react";
import Countdown from "../components/Countdown";
import { useSocket } from "../components/SocketContext";

//Component displays follow up question, turn, and timer for answering the question
const AgreeFUQPage = () => {
  //described in other page components
  const socket = useSocket();
  const location = useLocation();
  const { session, player, playerArray, agreePlayerList, question, firstRound, lastQuestion, disagreePlayerList} = location.state || {};
  const navigate = useNavigate();

  const { userId, agreeResponseId } = useParams();
   // Finds the appropriate follow-up response by ID
  const followUp = agreeResponses.find(
    (response) => response.id === agreeResponseId
  );
  //State variables for tracking countdown, current player, round progress, etc.
  const [countdownFinished, setCountdownFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(agreePlayerList[currentIndex]);
  const [roundFinished, setRoundFinished] = useState(false);
  const [currentAgreedPlayers, setCurrentAgreedPlayers] = useState(agreePlayerList);
  const [currentDisgareedPlayers, setCurrentDisagreedPlayers] = useState(disagreePlayerList);
  const [currentPlayerArray, setCurrentPlayerArray] = useState(playerArray);

  const handleCountdownEnd = () => {
    setCountdownFinished(true); 
  };
  // Handles getting next player when countdown ends
  const changeTurn = () => {
    if (currentIndex < currentAgreedPlayers.length - 1){
    socket.emit("send_index_agree", currentIndex, session);
    }
    // if last index round finished is set to true
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


  //handles countdown finish and navigation
  useEffect(() => {
    if (countdownFinished && roundFinished) {
      navigate(`/wait/${player.playerID}`, {
        state: { session: session, player: player, playerArray: currentPlayerArray, agreeGroupHere: true, question: question, firstRound: firstRound, lastQuestion, agreePlayerList: currentAgreedPlayers, disagreePlayerList: currentDisgareedPlayers }
      });
    }
  }, [countdownFinished, roundFinished, navigate, player.playerID, session, player, currentPlayerArray, question, currentAgreedPlayers, currentDisgareedPlayers, firstRound, lastQuestion]);
  
  // Gets index from server and updates local variable state
  useEffect(() => {
    socket.on("get_index_agree", (index) => {
      console.log("new index: " + index);
      setCurrentIndex(index);
      setCurrentPlayer(currentAgreedPlayers[index]);
    });
  
    // Clean up the socket listener on component unmount
    return () => {
        socket.off("get_index_agree");
    };
    
  }, [socket, currentAgreedPlayers]);

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

    
  //UI based on Countdown status, which many players must still answer, and round being finished
  if (!countdownFinished) {
    return (
      
      <>
        <h1>Please find group blue.</h1>
          <div className="agree-page-container">
            {currentAgreedPlayers.map((player, index) => (
              <h2 key={index}>{player.playerName}</h2>
            ))}
          </div>
          <Countdown onCountdownEnd={handleCountdownEnd} />
      </>
    );
  }
  
  if (countdownFinished && !roundFinished && currentAgreedPlayers[currentIndex + 1] !== undefined) {
    return (
      
        <>
          <h3>{currentPlayer.playerName}, it's your turn to share.</h3>
          <div className="agree-page-container">
            <h1>{followUp.agreeFollowUp}</h1>
          </div>
            <Countdown onCountdownEnd={changeTurn} />
          <h3>
            Pssst. {currentAgreedPlayers[currentIndex + 1].playerName}, you are up
            next.
          </h3>
          
        </>
      
    );
  }
  
  if (countdownFinished && !roundFinished && currentAgreedPlayers[currentIndex + 1] === undefined) {
    return (
      
        <>
          <h3>{currentPlayer.playerName}, it's your turn to share.</h3>
          <div className="agree-page-container">
          <h1>{followUp.agreeFollowUp}</h1>
          </div>
          <Countdown onCountdownEnd={changeTurn} />
        </>
      
    );
  }
  
  
};
export default AgreeFUQPage;
