import { useParams } from "react-router-dom";
import questions from "../database";
import { useLocation } from "react-router-dom";
import { useSocket } from "../components/SocketContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Component to display primary questions and allow user responses, and display answers until all players have answered
const PrimaryQPage = () => {
  const socket = useSocket(); //Initializes socket from SocketContext
  const location = useLocation();// Accesses the current location's state in order to get state attributes
  const { session, admin, player, playerArray, firstRound, availableQuestionsThisRound, nextRoundQuestion, lastQuestion } = location.state || {}; //Destructures state
  const navigate = useNavigate(); //Allows navigation and sending states across components
  // Assignment of local variables to a default state
  const { userId, questionId } = useParams(); 
  const question = questions.find((question) => question.id === questionId);  // Finds the specific question using questionId.
  const [disagreePlayerList, setDisagreePlayerList] = useState([]);
  const [agreePlayerList, setAgreePlayerList] = useState([]);
  const [answerListComplete, setAnswerListComplete] = useState(false);
  const [agreeRoundReset, setAgreeRoundReset] = useState(false);
  const [disagreeRoundReset, setDisagreeRoundReset] = useState(false);

  //Navigates to approprate page based on agreement, disagreement, and player role
  const navigateToFollowUp = () => {
    console.log(agreePlayerList);
    if (admin === undefined && disagreePlayerList.some(p => p.playerID === player.playerID)) {
      navigate(`/disagree/${player.playerID}/${question.id}`, { state: { session: session, player: player, playerArray: playerArray, disagreePlayerList: disagreePlayerList, agreePlayerList: agreePlayerList, question: question, lastQuestion: lastQuestion, firstRound: firstRound} });
    }
    if (admin === undefined && agreePlayerList.some(p => p.playerID === player.playerID)) {
      navigate(`/agree/${player.playerID}/${question.id}`, { state: { session: session, player: player, playerArray: playerArray, agreePlayerList: agreePlayerList, disagreePlayerList: disagreePlayerList, question: question, lastQuestion: lastQuestion, firstRound: firstRound } });
    }
    if(admin !== undefined){
      navigate(`/wait/${admin}`, { state: { admin: admin, session: session, playerArray: playerArray, question: question, firstRound: firstRound, availableQuestionsThisRound: availableQuestionsThisRound, nextRoundQuestion: nextRoundQuestion, lastQuestion: lastQuestion, agreePlayerList: agreePlayerList, disagreePlayerList: disagreePlayerList}});
    }
  }
  //Tells server to clear agree list from previous round
  const clearAgreeList = () => {
    if(firstRound === false){
      socket.emit("reset_agreed_list", session);
    }
  }
  //Tells server to clear disagree list from previous round
  const clearDisagreeList = () => {
    if(firstRound === false){
      socket.emit("reset_disagreed_list", session);
    }
  }
  
  // Sends player to server to be added to agree list once list from last round has been reset
  const addPlayerToAgreed = () => {
    if (agreeRoundReset === false){
      clearAgreeList();
    }
    if (player) {
      // Emit the updated player array only if the player does not already exist
        if (!agreePlayerList.some(p => p.playerID === player.playerID)) {
            socket.emit("add_player_to_agreed", player); // Emit new array
        }
    }
  }
  // Gets cleared agree list from server and resets local variables.
  useEffect(() => {
    socket.on("get_reset_agreed_list", (list) => {
      setAgreePlayerList(list);
      setAgreeRoundReset(true);
      console.log("agreeplist: ", agreePlayerList);
    });

    return () => {
      socket.off("get_reset_agreed_list");
  };
  }, []);
  // Gets cleared disagree list from server and resets local variables.
  useEffect(() => {
    socket.on("get_reset_disagreed_list", (list) => {
      setDisagreePlayerList(list);
      setDisagreeRoundReset(true);
      console.log("disagreePlayerList", disagreePlayerList);
    });

    return () => {
      socket.off("get_reset_disagreed_list");
  };
  }, []);

  //Gets updated agree list from server and updates local variables
  useEffect(() => {
    socket.on("get_agreed_players", (data) => {
      console.log(data);
      setAgreePlayerList(data); 

    });

    // Clean up the socket listener on component unmount
    return () => {
        socket.off("get_agreed_players");
    };
}, [socket]);

  // Sends player to server to be added to disagree list once list from last round has been reset
  const addPlayerToDisagreed = () => {

    if (disagreeRoundReset === false){
      // clear player agreed from last round
      clearDisagreeList();
    }
    if (player) {
      // Emit the updated player array only if the player does not already exist
          if (!disagreePlayerList.some(p => p.playerID === player.playerID)) {
              socket.emit("add_player_to_disagreed", player); // Emit new array
          }
    }
  }
  //Gets updated agree list from server and updates local variables
  useEffect(() => {
    socket.on("get_disagreed_players", (data) => {
      console.log(data);
      setDisagreePlayerList(data); 
    });

    // Clean up the socket listener on component unmount
    return () => {
        socket.off("get_disagreed_players");
    };
}, [socket]);
//Checks to see if all players have answered. Notifies server when yes.
useEffect(() => {
  if (agreePlayerList && disagreePlayerList) {
      if (agreePlayerList.length + disagreePlayerList.length === playerArray.length) {
          socket.emit("follow_up_start", session);
      }
  }
}, [agreePlayerList, disagreePlayerList, socket]);
//Listens for answers to be complete. Updates local variable
useEffect(() => {
  socket.on("follow_up_start_true", (data) => {
      console.log(data);
      setAnswerListComplete(true);
      console.log(answerListComplete);
      
  });

  // Clean up the socket listener on component unmount
  return () => {
      socket.off("follow_up_start_true");
  };
  
}, [socket] );
  //Sends to navigare function conditioned on round and answer completion
  useEffect(() => {
    console.log("answerListComplete: ", answerListComplete, " firstRound: ", firstRound, " agreeRoundReset: ", agreeRoundReset, " disagreeRoundReset: ", disagreeRoundReset);
    if(answerListComplete && firstRound === undefined){
    navigateToFollowUp();
    }
    if(answerListComplete){
    navigateToFollowUp();
    }  
  }, [answerListComplete, agreeRoundReset, disagreeRoundReset]);
  //Checks to see if all players have left
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
  
  //UI based on role and answer
  if (!player && !admin) {
      return <h1>User not found</h1>;
  }
  if (!admin) {
      if (disagreePlayerList?.some(p => p.playerID === player.playerID)) {
        return( 
          <div className="primary-page-container">
            <h2>Disagreed:</h2>
            <div className="players-list">
            {disagreePlayerList?.map((player, index) => (
              <h4 key={index}>{player.playerName}</h4>
            ))}
            </div>
          </div>
        );
      } else if (agreePlayerList?.some(p => p.playerID === player.playerID)) {
        return (
          <div className="primary-page-container">
            <h2>Agreed:</h2>
            <div className="primary-page-container">
            {agreePlayerList.map((player, index) => (
              <h4 key={index}>{player.playerName}</h4>
            ))}
            </div>
          </div>
        );
      } else {
        return (
          <>
            <h1>{question.question}</h1>
            <button onClick={addPlayerToAgreed}>Agree</button>
            <button onClick={addPlayerToDisagreed}>Disagree</button>
          </>
        );
      }
  }
  if (admin) {
    return (
      <>
        <h1>{question.question}</h1>
        <div className="primary-page-container">
          <h2>Agreed:</h2>
          <div className="players-list">
            {agreePlayerList?.map((player, index) => (
            <h4 key={index}>{player.playerName}</h4>
            ))}
          </div>
        </div>
        <div className="primary-page-container">
          <h2>Disagreed:</h2>
          <div className="players-list">
            {disagreePlayerList?.map((player, index) => (
            <h4 key={index}>{player.playerName}</h4>
          ))}
          </div>
        </div>
      </>
    );
  }
}
export default PrimaryQPage;


