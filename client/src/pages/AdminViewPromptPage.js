import { useEffect, useState } from "react";
import questions from "../database";
import { useSocket } from "../components/SocketContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Component for admin to view, approve, and skip questions during a game session
const AdminViewPromptPage = () => {
  const socket = useSocket(); // Accesses the socket from SocketContext
  const location = useLocation(); // Accesses route state and enable the receival of state attributes across components
  const { session, admin, player, playerArray, availableQuestionsThisRound, firstRound, nextRoundQuestion} = location.state || {}; // Destructures state
  const navigate = useNavigate(); // Navigation hook so that states can be sent across components
  
  const [availableQuestions, setAvailableQuestions] = useState(questions); // List of available questions with default state from question "database"
  const [currentQuestion, setCurrentQuestion] = useState(availableQuestions[Math.floor(Math.random()*availableQuestions.length)]); // Randomly selects current question
  const [questionApproved, setQuestionApproved] = useState(false); // Tracks approval status of the question
  const [thisRoundAvailableQuestions, setThisRoundAvailableQuestions] = useState(availableQuestionsThisRound); // Questions available for the eveery round after the first round
  const [nextRoundCurrentQuestion, setNextRoundQuestion] = useState(); // Next question for upcoming round
  const [thisRoundCurrentQuestion, setThisRoundCurrentQuestion] = useState(nextRoundQuestion); // Current question for every round after the first round
  const [lastQuestion, setLastQuestion] = useState(false); // Booleen to track if it is the last question
  const [endGameStatus, setEndGameStatus] = useState(false); // Boolean to track if game has been ended
  
  // Generates a random question from the available pool
  const generateQuestion = () => {
    return availableQuestions[Math.floor(Math.random()*availableQuestions.length)];
  }
  // Generates a random question from the available pool after the first round
  const generateQuestionThisRound = () => {
    return thisRoundAvailableQuestions[Math.floor(Math.random()*thisRoundAvailableQuestions.length)];
  }
  // Navigates to the question view based on role (admin or player) and approval status
  const navigateToPrimaryQuestion = () => {
    if (admin !== undefined && questionApproved){
      console.log("last question:" + lastQuestion);
      console.log("Navigating to:", `/primary/${admin}/${currentQuestion.id}`, { state: { admin, session, playerArray, firstRound: firstRound, availableQuestionsThisRound: thisRoundAvailableQuestions, nextRoundQuestion: nextRoundCurrentQuestion, lastQuestion:lastQuestion } });
      return navigate(`/primary/${admin}/${currentQuestion.id}`, { state: { admin: admin, session: session, playerArray: playerArray, firstRound, availableQuestionsThisRound: thisRoundAvailableQuestions, nextRoundQuestion: nextRoundCurrentQuestion, lastQuestion: lastQuestion}});
    }
    if (player !== undefined && questionApproved) {
      console.log("last question:" + lastQuestion);
      return navigate(`/primary/${player.playerID}/${currentQuestion.id}`, { state: { session: session, player: player, playerArray: playerArray, firstRound: firstRound, lastQuestion: lastQuestion } });
    }
  }
  // Navigates to the question view based on role (admin or player) and approval status after the first round
  const navigateToPrimaryQuestionThisRound = () => {
    if (admin !== undefined && questionApproved){
      console.log("last question:" + lastQuestion);
      return navigate(`/primary/${admin}/${thisRoundCurrentQuestion.id}`, { state: { admin: admin, session: session, playerArray: playerArray, firstRound: firstRound, availableQuestionsThisRound: thisRoundAvailableQuestions, nextRoundQuestion: nextRoundCurrentQuestion, lastQuestion: lastQuestion}});
    }
    if (player !== undefined && questionApproved) {
      console.log("last question:" + lastQuestion);
      return navigate(`/primary/${player.playerID}/${thisRoundCurrentQuestion.id}`, { state: { session: session, player: player, playerArray: playerArray, firstRound: firstRound, lastQuestion: lastQuestion } });
    }
        
  }
  // Skips the current question, emitting an event to remove it from the pool and get a new one
  const skipQuestion = () => {
    const nextQuestion = generateQuestion();
    console.log("next question", nextQuestion);
    console.log("current question first round:", currentQuestion);
    console.log(" availables questions first round", availableQuestions);
    socket.emit("remove_question", session, currentQuestion, nextQuestion, availableQuestions);
  }
  // Sends session nnumber to server so that endGame status changes for user's session
  const endGame = () => {
    socket.emit("change_end_game_status", session);
  }
  // Navigate to the game end screen
  const navigateToGameEnd = () => {
      if (admin) {
          navigate(`/end/${admin}`, { state: { admin, session, playerArray} });
        } else if (player) {
          navigate(`/end/${player.playerID}`, { state: { admin, session, player, playerArray} });
        }
  }
  // Skips the current question, emitting an event to remove it from the pool and get a new one after first round
  const skipQuestionThisRound = () => {
    const nextQuestion = generateQuestionThisRound();
    console.log("next quesiton this round:", nextQuestion);
    console.log("this round current question: ", thisRoundCurrentQuestion);
    console.log("this tound available questions " , thisRoundAvailableQuestions);
    socket.emit("remove_question", session, thisRoundCurrentQuestion, nextQuestion, thisRoundAvailableQuestions);
  }
  // Approves the current question and emits it to the server. Also sends next question.
  const approveQuestion = () => {
    const nextQuestion = generateQuestion();
    console.log(nextQuestion);
    console.log(currentQuestion);
    console.log(availableQuestions);
    socket.emit("approve_question", session, currentQuestion, nextQuestion, availableQuestions);
  }
  // Approves the current question and emits it to the server. Also sends next question. For rounds after first round
  const approveQuestionThisRound = () => {
    const nextQuestion = generateQuestionThisRound();
    console.log("next question:" + nextQuestion);
    console.log("current question:" + thisRoundCurrentQuestion);
    socket.emit("approve_question", session, thisRoundCurrentQuestion, nextQuestion, thisRoundAvailableQuestions);
  }
  // Approves the current question and emits it to the server.
  const approveLastQuestion = () => {
    const nextQuestion = generateQuestion();
    console.log(nextQuestion);
    console.log(currentQuestion);
    console.log(availableQuestions);
    socket.emit("approve_last_question", session, currentQuestion, nextQuestion, availableQuestions);
  }
  // Approves the current question and emits it to the server. 
  const approveLastQuestionThisRound = () => {
    const nextQuestion = generateQuestionThisRound();
    console.log("next question:" + nextQuestion);
    console.log("current question:" + thisRoundCurrentQuestion);
    socket.emit("approve_last_question", session, thisRoundCurrentQuestion, nextQuestion, thisRoundAvailableQuestions);
  }
// Listens for end-game status updates from the server. Updates local variable.
useEffect(() => {
    socket.on("get_end_game_status", (data) => {
        console.log(data);
        setEndGameStatus(data);
        
    });

    // Clean up the socket listener on component unmount
    return () => {
        socket.off("get_end_game_status");
    };
    
}, [socket]);

useEffect(() => {
    if(endGameStatus === true){
      navigateToGameEnd();
    }
}, [endGameStatus]);
  
// Handles receiving new questions from the server in first round
  useEffect(() => {
    if (firstRound === undefined){
    socket.on("receive_question", (question, availableQuestionsArray) => {
      console.log("new question recieved")
        setCurrentQuestion(question);
        setAvailableQuestions(availableQuestionsArray);
    });

    // Cleans up the socket listener on component unmount
    return () => {
        socket.off("receive_question");
    };
  }   
}, [firstRound, socket]);


// Handles receiving new questions from the server in non-first rounds
useEffect(() => {
  socket.on("receive_question", (question, availableQuestionsArray) => {
    console.log("new question recieved")
      setThisRoundCurrentQuestion(question);
      setThisRoundAvailableQuestions(availableQuestionsArray);
  });

  // Cleans up the socket listener on component unmount
  return () => {
      socket.off("receive_question");
  };
  
}, [socket]);

// Handles question approval, which updates the current and next round questions in the first round
useEffect(() => {
  if (firstRound === undefined){
    socket.on("question_approved", (question, nextCurrentQuestion, availableQuestionsArray) => {
      console.log("question approved")
      setCurrentQuestion(question);
      setAvailableQuestions(availableQuestionsArray);
      setNextRoundQuestion(nextCurrentQuestion);
      if(firstRound === undefined){
      socket.emit("approved_status", session);
      }
    });

  // Cleans up the socket listener on component unmount
    return () => {
      socket.off("question_approved");
    };
  }
}, [socket, firstRound, session]);

useEffect(() => {
  socket.on("approved_status_true", (data) => {
    setQuestionApproved(data);
      
  });

  // Cleans up the socket listener on component unmount
  return () => {
      socket.off("approved_status_true");
  };
  
}, [socket, availableQuestions, availableQuestionsThisRound, firstRound, session]);

//Listens for question approval from the server. Updates local variables
useEffect(() => {
  socket.on("question_approved", (question, nextCurrentQuestion, availableQuestionsArray) => {
    console.log("question approved")
      setThisRoundCurrentQuestion(question);
      setThisRoundAvailableQuestions(availableQuestionsArray);
      setNextRoundQuestion(nextCurrentQuestion);
      if (firstRound === false){
      socket.emit("approved_status", session);
      }
      
  });

  // Cleans up the socket listener on component unmount
  return () => {
      socket.off("question_approved");
  };
  
}, [socket, firstRound, session]);

//Listens for last question approval from the server. Updates local variables in first round
useEffect(() => {
  socket.on("last_question_approved", (question, nextCurrentQuestion, availableQuestionsArray) => {
    console.log("question approved")
      setCurrentQuestion(question);
      setAvailableQuestions(availableQuestionsArray);
      setNextRoundQuestion(nextCurrentQuestion);
      socket.emit("last_question_to_true", session);
      
  });

  // Cleans up the socket listener on component unmount
  return () => {
      socket.off("question_approved");
  };
  
}, [socket, firstRound, session]);
  //Listens for last question approval from the server. Updates local variables after first round
  useEffect(() => {
    socket.on("last_question_approved", (question, nextCurrentQuestion, availableQuestionsArray) => {
      console.log("question approved")
        setThisRoundCurrentQuestion(question);
        setThisRoundAvailableQuestions(availableQuestionsArray);
        setNextRoundQuestion(nextCurrentQuestion);
        socket.emit("last_question_to_true", session);
        
    });
  
    // Cleans up the socket listener on component unmount
    return () => {
        socket.off("question_approved");
    };
    
  }, [socket, firstRound, session]);
  //Listens for last question status from the server. Updates local variable. Sends approval of last question to server
  useEffect(() => {
    socket.on("last_question_status", (data) => {
      setLastQuestion(data);
      socket.emit("approved_last_status", session);
      
        
    });
  
    // Cleans up the socket listener on component unmount
    return () => {
        socket.off("last_question_status");
    };
    
  }, [socket, session]);

  //Listens for approval of last question status. Updates local variable
  useEffect(() => {
    socket.on("approved_last_status_true", (data) => {
      setQuestionApproved(data);
      
    });
  
    // Cleans up the socket listener on component unmount
    return () => {
        socket.off("approved_last_status_true");
    };
    
  }, [socket, session]);
  //If questin is approved, navigates to PrimaryQuestion page based on first round status
  useEffect(() => {
    console.log("question approved"+ questionApproved);
    if (questionApproved === true){
      if (firstRound === undefined){
        console.log("navigting to navigate formula");
      navigateToPrimaryQuestion();
      }
      if (firstRound === false){
        console.log("navigting to navigate formula");
      navigateToPrimaryQuestionThisRound();
    }}
  }, [questionApproved, navigateToPrimaryQuestion, navigateToPrimaryQuestionThisRound, firstRound]);
  //If session ends, send alert and navigate to home page
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


  //UI based on round and user role
  if (admin !== undefined){
    if (firstRound === undefined){
      if (availableQuestions.length > 1){
        return (
          <>
          <div className="prompt-page">
          <h2>Here is your question for approval:</h2>
          <h1>{currentQuestion.question}</h1>
          
          <button onClick={skipQuestion}>Skip</button>
          <button onClick={approveQuestion}>Approve</button>
          <button onClick={endGame}>End Game</button>
          </div>
          </>
        )
      }
      return (
        <>
        <h2>This is your last question:</h2>
        <h1>{currentQuestion.question}</h1>
        <h3>You may approve it or end the game</h3>
        <button onClick={approveLastQuestion}>Approve</button>
        <button onClick={endGame}>End Game</button>
        </>
        )
    }
    if(firstRound === false){
      if(thisRoundAvailableQuestions.length > 1){
        return (
          <>
          <h2>Here is your question for approval:</h2>
          <h1>{thisRoundCurrentQuestion.question}</h1>
          <button onClick={skipQuestionThisRound}>Skip</button>
          <button onClick={approveQuestionThisRound}>Approve</button>
          <button onClick={endGame}>End Game</button>
          </>
        )
      }
      return (
        <>
        <h2>This is your last question:</h2>
        <h1>{thisRoundCurrentQuestion.question}</h1>
        <h3>You may approve it or end the game</h3>
        <button onClick={approveLastQuestionThisRound}>Approve</button>
        <button onClick={endGame}>End Game</button>
        </>
        )
      }
    }
  if (player !== undefined) {
    return (
      <h1>Waiting for admin to send a question...</h1>
    )
  }

};
export default AdminViewPromptPage;