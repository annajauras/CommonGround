import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Creates a context for the socket instance, allowing it to be shared across the components
const SocketContext = createContext();

// Custom hook for convenient access to the SocketContext, allowing components to easily access the socket instance
export const useSocket = () => useContext(SocketContext);

// Context provider component for the socket instance
export const SocketProvider = ({ children }) => {
  // State to store the socket instance, allowing it to be shared via context
  const [socket, setSocket] = useState(null);
  // Establishes the socket connection when the component mounts

  useEffect(() => {
     // Creates a new socket instance and configures connection settings
    const socketInstance = io.connect("http://localhost:3001", {
      autoConnect: true,  // Automatically tries to connect upon initialization
      reconnectionDelayMax: 10000,  // Maximum delay between reconnection attempts, in milliseconds
      reconnectionAttempts: Infinity, // Keeps trying to reconnect indefinitely on connection failure
    });

    setSocket(socketInstance);

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []); // Empty dependency ensures it runs once on mount

  return (
    //Allows any components within App to access the socket instance using the useSocket hook. (when SocketContextProvider wraps App component in App.js)
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};