import { useParams, useLocation } from "react-router-dom";
import { useSocket } from "../components/SocketContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminJoinGamePage = () => {
    const socket = useSocket();
    const location = useLocation();
    const { username, session, admin, player } = location.state || {};
    const { gameId } = useParams();
    const [playersArray, setPlayersArray] = useState([]);
    const [isStarted, setIsStarted] = useState(false);
    const navigate = useNavigate();



    // Listen for the full player array from the server
    

    useEffect(() => {
        if (player && player.playerName) {
            // Emit the updated player array only if the player does not already exist
                if (!playersArray.some(p => p.playerID === player.playerID)) {
                    socket.emit("add_player_to_array", player); // Emit new array
                }
        }
    }, [socket]);

    useEffect(() => {
        socket.on("get_player_array", (data) => {
            setPlayersArray(data);  // Set the entire player array
        });

        // Clean up the socket listener on component unmount
        return () => {
            socket.off("get_player_array");
        };
    }, [socket]);

    const displayButton = () => {
        console.log(admin)
        if (admin !== undefined){
            return <button onClick={startStatus}>Start Game</button>;
        }
        return <p>Waiting for admin to start game</p>;

    }

    const startStatus = () => {
        if (isStarted === true){
            socket.emit("game_start", session);
        }
    }
    useEffect(() => {
        socket.on("game_start_true", (data) => {
            setIsStarted(data);
            console.log(isStarted);
            
        });

        // Clean up the socket listener on component unmount
        return () => {
            socket.off("game_start_true");
        };
        
    }, [socket]);
    
    const navigateToQuestions = () => {
        if (isStarted === true){
        if (admin !== undefined){
            return navigate(`/${admin}/admin`, { state: { admin: admin, session: session, playerArray: playersArray}});
        }
        return navigate(`/wait/${player.playerID}`, { state: { username: username, session: session, player: player, playerArray: playersArray } });
    }
    }

    return (
        <>
            <h1>Your session code is {gameId}</h1>
            <h2>Hello {username}, welcome to the game</h2>
            <div>
                <h2>Players:</h2>
                {playersArray.map((player, index) => (
                    <h2 key={index}>{player.playerName}</h2>
                ))}
            <div>{displayButton()}</div>
            </div>
        </>
    );
}

export default AdminJoinGamePage;