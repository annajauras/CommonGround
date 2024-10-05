/*import { io } from "socket.io-client";
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3001'

export const socket = io(URL, {
  autoConnect: false
});*/
import { createContext, useContext } from "react";
import {io} from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = io.connect("http://localhost:3001");
  
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};