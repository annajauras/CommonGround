import { useEffect, useState } from "react";
import { useSocket } from "../components/SocketContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { agreeResponses } from "../database";
import { disagreeResponses } from "../database";

// Component where admin and finished groups wait for all groups to be done with follow up question 
const WaitPage = () => {
  //Described in other component pages
  const socket = useSocket();
  const location = useLocation();
  const { session, admin, player, playerArray, question, firstRound, availableQuestionsThisRound, agreeGroupHere, disagreeGroupHere, nextRoundQuestion, lastQuestion, agreePlayerList, disagreePlayerList } = location.state || {};
  const navigate = useNavigate();
  //State variables for tracking which groups have arrived
  const [agreeDone, setAgreeDone] = useState(agreeGroupHere);
  const [disagreeDone, setDisagreeDone] = useState(disagreeGroupHere);
  const [bothGroupsHere, setBothGroupsHere] = useState(false);
  //Variables containing follow up question being answered
  const followUpAgree = agreeResponses.find(
    (response) => response.id === question.id
  );
  const followUpDisagree = disagreeResponses.find(
    (response) => response.id === question.id
  );
  //Function to check status in server for group arrival
  const checkBothGroupsStatus = () => {
    socket.emit("status_check", { agreeDone, disagreeDone, session });
  };

  useEffect(() => {
    // Set initial states in the case that no players were in the agree or disagree group
    if (agreePlayerList.length < 1) socket.emit("agreed_here", session);
    if (disagreePlayerList.length < 1) socket.emit("disagreed_here", session);

    // Mark the group as arrived to page based on player presence
    const markGroupAsArrived = () => {
      if (agreeGroupHere) {
        socket.emit("agreed_here", session);
      }
      if (disagreeGroupHere) {
        socket.emit("disagreed_here", session);
      }
    };
    if (player) {
      markGroupAsArrived();
    }
  }, [agreePlayerList, disagreePlayerList, agreeGroupHere, disagreeGroupHere, player, session, socket]);

  useEffect(() => {
    // Listener for agreed team status
    socket.on("agreed_status_true", (status) => {
      setAgreeDone(status);
      checkBothGroupsStatus();
    });

    return () => socket.off("agreed_status_true");
  }, [socket]);

  useEffect(() => {
    // Listener for disagreed team status
    socket.on("disagreed_status_true", (status) => {
      setDisagreeDone(status);
      checkBothGroupsStatus();
    });

    return () => socket.off("disagreed_status_true");
  }, [socket]);

  useEffect(() => {
    // Navigate when both agreeDone and disagreeDone are true
    console.log("agreedone:", agreeDone, "disagreeDone: ", disagreeDone)
    if (agreeDone && disagreeDone) {
      socket.emit("both_groups_here", session);
    }
    
  }, [agreeDone, disagreeDone, session, socket]);
  //Gets both groups status from server when it changes
  useEffect(() => {
    socket.on("both_groups_status", (groupStatus) => {
      setBothGroupsHere(groupStatus);
    });

    return () => socket.off("both_groups_status");
  
  }, [socket, setBothGroupsHere]);
  //Navigates to next page when both groups are on page
  useEffect(() => {
    if(bothGroupsHere) {
      console.log("both groups here.");
      //Navigation if no more questions
      if (lastQuestion) {
        if (admin) {
          navigate(`/end/${admin}`, { state: { admin, session, playerArray, firstRound: false, availableQuestionsThisRound, nextRoundQuestion, lastQuestion } });
        } else if (player) {
          navigate(`/end/${player.playerID}`, { state: { admin, session, player, playerArray } });
        }
      } 
        else {
          // Navigate to the next question and reset statuses of group arrival for the next round
          socket.emit("new_question_round", session); 
      
          if (admin) {
            navigate(`/${admin}/admin`, { 
              state: { admin, session, playerArray, firstRound: false, availableQuestionsThisRound, nextRoundQuestion, lastQuestion} 
            });
          } else if (player) {
            navigate(`/${player.playerID}/admin`, { 
              state: { session, player, playerArray, firstRound: false } 
            });
          }
        }
    }
  
  }, [bothGroupsHere, agreeDone, disagreeDone, admin, player, navigate, session, playerArray, firstRound, availableQuestionsThisRound, nextRoundQuestion, lastQuestion]);
  
  //Checks if session has ended due to players leaving the game
  useEffect(() => {
    socket.on("session_ended", (endedSessionId) => {
      if (endedSessionId === session) {
        // Show a confirmation dialog; navigate only if the user clicks "OK"
        if (window.confirm("The session ", endedSessionId," has ended.  Click OK to return to the home page.")) {
          navigate("/");
        }
      }
    });

    return () => socket.off("session_ended");
  }, [socket, session, navigate]);

  return (
    <>
      <h1>Waiting for both groups to finish.</h1>
      <h2>Please enjoy listening to the other players' answers.</h2>
      <div className="agree-page-container">
        <h2>Those who agreed are answering this question:</h2>
        <h3>{followUpAgree.agreeFollowUp}</h3>
      </div>
      <div className="disagree-page-container">
        <h2>Those who disagreed are answering this question:</h2>
        <h3>{followUpDisagree.disagreeFollowUp}</h3>
      </div>
    </>
  );
};

export default WaitPage;

