import { useParams, useLocation } from "react-router-dom";
import { useSocket } from "../components/SocketContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// AdminJoinGamePage component for viewing game code, joined players, and starting the session
const AdminJoinGamePage = () => {
    const socket = useSocket(); // Initialize socket from SocketContext
    const location = useLocation();  // Accesses the current location's state for getting state attributes
    const { session, admin, player } = location.state || {};  // Extract session, admin, and player data from state if available 
    const { gameId } = useParams();  // Retrieves the game ID from the URL
    const [playersArray, setPlayersArray] = useState([]); // Array to store the list of players
    const [isStarted, setIsStarted] = useState(false); // Boolean to track if the game has started
    const navigate = useNavigate(); // Navigation hook so that states can be sent across components and enables navigating

    // Navigates to the question view based on game start status and role
    const navigateToQuestions = () => {
        if (isStarted) {  // Only navigate if button has been pressed and isStarted status has changed
            if (admin !== undefined) {
                // Navigate to the admin question view, passing session and player data in state
                return navigate(`/${admin}/admin`, { state: { admin: admin, session: session, playerArray: playersArray } });
            }
            // Navigate to the player question page to wait if admin is not set
            return navigate(`/${player.playerID}/admin`, { state: { admin: admin, session: session, player: player, playerArray: playersArray } });
        }
    }

    // Effect to add a new player to the players array if not already present
    useEffect(() => {
        if (player) {  // Only proceed if player data exists
            // Check if the player already exists in the array
            if (!playersArray.some(p => p.playerID === player.playerID)) {
                socket.emit("add_player_to_array", player);  // Emit event to add player to the server array
            }
        }
    }, [socket]);

    // Effect to listen for updates to the players array from the server
    useEffect(() => {
        socket.on("get_player_array", (data) => {
            setPlayersArray(data);  // Update local state with the server-provided player array
        });

        // Cleans up the listener when component unmounts
        return () => {
            socket.off("get_player_array");
        };
    }, [socket]);

    // Display start button only if user is admin
    const displayButton = () => {
        if (admin !== undefined) {
            return <button onClick={startStatus}>Start</button>;
        }
        return <h5>Waiting for admin to start game...</h5>;
    }

    // Function to emit game start signal to the server upon button push
    const startStatus = () => {
        socket.emit("game_start", session);
    }

    // Effect to listen for the server confirmation that the game status had changed to started
    useEffect(() => {
        socket.on("game_start_true", (data) => {
            console.log(data);
            setIsStarted(true);  // Update game start status
            console.log(isStarted);
        });

        // Cleans up the listener when component unmounts
        return () => {
            socket.off("game_start_true");
        };
    }, [socket]);
    
    // Effect to navigate to questions view once the game is marked as started
    useEffect(() => {
        navigateToQuestions();
    }, [isStarted]);
    
     //Checks if session has ended due to admin leaving the game
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
    return (
        <>
            {/* Welcome Message */}
            <h2>Hello, welcome to Common Ground!</h2>

            <div className="main-container">
            
                {/* Session Code Display */}
                <h1>Your session code is:</h1>
                <div className="session-container">
                    <h2 className="session-code">{gameId}</h2>  {/* Display the session code */}
                </div>
      
                {/* Players List */}
                <h1>Players:</h1>
      
                <div className="player-list-container">
                    <div className="players-list">
                        {/* Map over playersArray to display each player's name */}
                        {playersArray.map((player, index) => (
                            <h4 key={index}>{player.playerName}</h4>
                        ))}
                    </div>
                </div>
            
                {/* Button Display */}
                <div className="button-container">
                    {displayButton()}  {/* Show either Start button or waiting message */}
                </div>
            </div>
        </>
    );
}

export default AdminJoinGamePage;
