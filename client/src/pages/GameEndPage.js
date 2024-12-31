import { useEffect } from "react";
import { useSocket } from "../components/SocketContext";
import { Link, useNavigate } from "react-router-dom";

const GameEndPage = () => {
  // Accesses the socket from SocketContext
  const socket = useSocket();
  const navigate = useNavigate();

  //Disconnect from socket on game end
  useEffect(() => {
  socket.disconnect(); 
}, [socket]);

  return (
  <>
    <h1>Your game has ended.</h1>
    <Link to={"/"}>
      <button>Play Again</button>
    </Link>
  </>
  )};
export default GameEndPage;
