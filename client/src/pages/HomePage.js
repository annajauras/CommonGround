import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../components/SocketContext";

// HomePage component that manages the main session creation and joining functionalities
const HomePage = () => {
  // Initialize socket from the custom SocketContext
  const socket = useSocket();

  // State variables for user inputs and game session details
  const [username, setUsername] = useState("");  // Username for joining a session
  const [session, setSession] = useState("");    // Session ID to join a session
  const [admin, setAdmin] = useState("");        // Admin name for creating a session
  const [gameCode, setGameCode] = useState("");  // Generated game code for new sessions
  const navigate = useNavigate();                // Navigation hook from react-router-dom

  // Generates a random 5-digit game code
  const generateGameCode = () => {
    let minm = 10000;
    let maxm = 99999;
    let randomNumber = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    return randomNumber;
  }

  // Handles session creation for the admin
  const createSession = () => {
    const newGameCode = generateGameCode().toString(); // Generate a new game code as a string
    setGameCode(newGameCode);  // Set the game code in state
    if (admin !== "") {        // Only proceed if an admin name is provided
      socket.emit("join_session", newGameCode);  // Emit event to join the session on the server
      // Navigate to the admin session view, passing the game code and admin details in state
      navigate(`/admin/join/${newGameCode}`, { state: { admin: admin, session: newGameCode}});
    }
  }

  // Handles joining an existing session as a player
  const joinSession = () => {
    if (username !== "" && session !== "") {  // Ensure username and session ID are provided
      const userID = 0;  // Placeholder for player ID, may be updated if unique ID is used
      const playerObject = { playerName: username, session: session, playerID: userID };

      // Emit join session request to the server
      socket.emit("join_session", session);

      // Emit player data to the server for this session
      socket.emit("send_player", playerObject);

      // Listen for acknowledgment from the server with player data
      socket.once("player_acknowledged", (playerData) => {
          // Navigate to the session view with player data
          navigate(`/admin/join/${session}`, { state: { session: session, player: playerData } });
      });
    }
  };

  // Effect to check and connect socket if disconnected
  useEffect(() => {
    console.log('Socket connected:', socket?.connected); // Logs socket connection status
    if (socket?.connected === false) {
      socket.connect();  // Reconnect socket if disconnected
    }
  }, []);

  // Rendered UI for the home page
  return (
    <div className="home-page">
      <h1>Common Ground</h1>
      <h3>Click "Start" to open a session, or enter your name and a code to join one.</h3>

      <div className="form-container">
        {/* Section for creating a new session */}
        <div className="create-session">
          <input type="text" placeholder="Admin Name" onChange={(e) => setAdmin(e.target.value)} />
          <button type="button" onClick={createSession}>Start</button>
        </div>

        {/* Section for joining an existing session */}
        <div className="join-session">
          <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input type="text" placeholder="Session ID" onChange={(e) => setSession(e.target.value)} />
          <button type="button" onClick={joinSession}>Join Session</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
