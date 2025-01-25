import { useEffect } from "react";
import { useSocket } from "../components/SocketContext";
const AboutPage = () => {

  const socket = useSocket();

  //If the player or admin navigates away from game they are disconnected from session.
    useEffect(() => {
    socket.disconnect(); 
  }, [socket]);

  return (
  <>
  <div className="main-container">
  <h1>About our Game</h1>
  
  <p>Uncover connections, spark conversations, and bring people closer with our engaging get-to-know-you game! 
    Designed for groups of 4 to 20 players, this game is the perfect tool for team leaders in companies, clubs, 
    or schools looking to build stronger, more cohesive teams. It’s also an amazing way for friends to deepen their bonds and 
    discover new sides of each other. Whether it’s for teambuilding, breaking the ice, or just having a great time, this game 
    helps players find common ground, laugh together, and create unforgettable memories. Let the connections begin!</p>
  </div>
  </>
  );
};
export default AboutPage;
