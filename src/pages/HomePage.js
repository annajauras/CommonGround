import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import { users } from "../database";
import AdminJoinGamePage from "./AdminJoinGamePage";
import { useSocket } from "../components/SocketContext";


const HomePage = () => {
  const socket = useSocket();
  const [username, setUsername] = useState("");
  const [session, setSession] = useState("");
  const [admin, setAdmin] = useState("");
  const [gameCode, setGameCode] = useState("");
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false); // State to control navigation


  const generateGameCode = () => {
    let minm = 10000;
    let maxm = 99999;
    let randomNumber = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    return (randomNumber);
  }


  const assignUserID = () => {
    let minm = 10000;
    let maxm = 99999;
    let userID = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    return (userID);
  }


  const createSession = () => {
    const newGameCode = generateGameCode().toString();
    setGameCode(newGameCode);
    if (admin !== ("")) {
      socket.emit("join_session", newGameCode);
      navigate(`/admin/join/${newGameCode}`, { state: { admin: admin, session: newGameCode}});
    }
   
  }


  const joinSession = () => {
    if (username !== "" && session !== "") {
        const userID = assignUserID().toString();
        const playerObject = { playerName: username, session: session, playerID: userID };
       
        // Emit joining session first
        socket.emit("join_session", session);
       
        // Send the player object
        socket.emit("send_player", playerObject);
       
        // Listen for acknowledgment
        socket.once("player_acknowledged", (playerData) => {
            navigate(`/admin/join/${session}`, { state: { username: username, session: session, player: playerData } });
        });
    }
};


  return (
  <>
  <div className="home-page">
  <h1>Welcome to Common Ground  </h1>
  <h3>A get to know you game for friends and aquaintences alike.</h3>
  <h4>Click "Start" to begin a game or enter a session code to join one.</h4>
  <div className="create-sesssion">
  <input type="text" placeholder="Admin ID" onChange={(event) => {setAdmin(event.target.value)}}></input>
  <button type="button" onClick={createSession}>Start</button>
  </div>
  <div className="join-session">
  <input type="text" placeholder="Username" onChange={(event) => {setUsername(event.target.value)}}></input>
  <input type="text" placeholder="Session ID" onChange={(event) => {setSession(event.target.value)}}></input>
  <button type="button" onClick={joinSession}>Join Session</button>
  </div>
  </div>
  </>
  );
};
export default HomePage;
