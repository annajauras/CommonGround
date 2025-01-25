const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require("socket.io");
const { Socket } = require('dgram');

app.use(cors());

require('dotenv').config();

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"],
    }
});

const sessions = {}; // Key: sessionId, Value: array of players
const sessionsQuestions = {}; //Initialization of Object to contain available questions in an array per session
const sessionAgreed = {}; //Initialization of Object to track agreed players per session
const sessionDisagreed = {}; //Initialization of Object to track disagreed players per session
const sessionGroups = {}; //Initialization of Object contains status of groups who have finished answering follow up question
const admins = {};; //Initialization of Object contains admins for all sessions
io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);


    // When a player joins a session
    socket.on("join_session", (sessionId) => {
        socket.join(sessionId);
        // if the session does not exist yet, create empty array as value
        if (!sessions[sessionId]) {
            sessions[sessionId] = [];
            admins[sessionId] = socket.id
        }
        console.log(`User with id ${socket.id} has joined session ${sessionId}.`);
        //send back array with all players in session
        socket.emit("get_player_array", sessions[sessionId]);
    });


    // When a new player is sent to the server
    socket.on("send_player", (player) => {
        console.log("Player sent:", player);
        //sets player id to id generated byy socket io
        player.playerID = socket.id;
        socket.emit("player_acknowledged", player);
    });

    socket.on("add_player_to_array", (player) => {
        // Adds player to the session's array
        const sessionId = player.session;
        if (!sessions[sessionId].some(p => p.playerID === player.playerID)) {
            sessions[sessionId].push(player);
            console.log(sessions);
        }
       // Emit the updated player array to all players in the session, including the new player
       io.in(sessionId).emit("get_player_array", sessions[sessionId]);
    });
    //Accepts session code and emits  game start = true for that client session
    socket.on("game_start", data => {
        console.log("Start button cliscked");
        io.in(data).emit("game_start_true", true);
    }
    );
    //skiped question (currentQuestion) are removed from the list
    socket.on("remove_question", (session, currentQuestion, nextQuestion, availableQuestions)=> {
        console.log(currentQuestion);
        //Available questions for the session are initialized with available questions
        if (!sessionsQuestions[session]) {
            sessionsQuestions[session] = availableQuestions;
        }
        // skipped question is removed by id
        sessionsQuestions[session] = sessionsQuestions[session].filter((q) => q.id !== currentQuestion.id);
        console.log(sessionsQuestions[session]);
        // updated list and next question are emitted to client
        io.in(session).emit("receive_question", nextQuestion, sessionsQuestions[session]);
    }
    );
    //Removes approved question from the list so it doesn't come up more than once
    socket.on("approve_question", (session, currentQuestion, nextQuestion, availableQuestions)=> {
        console.log(currentQuestion);
        if (!sessionsQuestions[session]) {
            sessionsQuestions[session] = availableQuestions;
        }
        
        sessionsQuestions[session] = sessionsQuestions[session].filter((q) => q.id !== currentQuestion.id);
        console.log(sessionsQuestions[session]);

        io.in(session).emit("question_approved", currentQuestion, nextQuestion ,sessionsQuestions[session]);
    }
    );
    //Removes last approved question from the list so it doesn't come up more than once
    socket.on("approve_last_question", (session, currentQuestion, nextQuestion, availableQuestions)=> {
        console.log(currentQuestion);
        if (!sessionsQuestions[session]) {
            sessionsQuestions[session] = availableQuestions;
        }
        
        sessionsQuestions[session] = sessionsQuestions[session].filter((q) => q.id !== currentQuestion.id);
        console.log(sessionsQuestions[session]);

        io.in(session).emit("last_question_approved", currentQuestion, nextQuestion ,sessionsQuestions[session]);
    }
    );
     //Accepts session code and emits approved status = true for that client session
    socket.on("approved_status", data => {
        console.log("Approved button clicked");
        io.in(data).emit("approved_status_true", true);
    }
    );
     //Accepts session code and emits last question = true for that client session
    socket.on("approved_last_status", data => {
        console.log("Approved button clicked");
        io.in(data).emit("approved_last_status_true", true);
    }
    );
    //Adds player to list of players who have agreed in that session
    socket.on("add_player_to_agreed", (player) => {
        const sessionId = player.session;
        if (!sessionAgreed[sessionId]) {
            sessionAgreed[sessionId] = [];
        }

        // Add player to the session's agreed array
        if (!sessionAgreed[sessionId].some(p => p.playerID === player.playerID)) {
            sessionAgreed[sessionId].push(player);
            console.log({sessionAgreed});
        }
       // Emits the updated player array to all players in the session, including the new player
       io.in(sessionId).emit("get_agreed_players", sessionAgreed[sessionId]);
    


    });
    //Resets Agreed player list, and emits empty array
    socket.on("reset_agreed_list", (session) => {
        const sessionId = session;
        if (sessionAgreed[sessionId]) {
            sessionAgreed[sessionId] = [];
        }
       // Emit the updated player array to all players in the session, including the new player
       io.in(sessionId).emit("get_reset_agreed_list", sessionAgreed[sessionId]);


    });
    //Adds player to list of players who have disagreed in that session
    socket.on("add_player_to_disagreed", (player) => {
        const sessionId = player.session;
        if (!sessionDisagreed[sessionId]) {
            sessionDisagreed[sessionId] = [];
        }

        // Adds player to the session's disagreed array
        if (!sessionDisagreed[sessionId].some(p => p.playerID === player.playerID)) {
            sessionDisagreed[sessionId].push(player);
            console.log(`Sessions disagreed:" ${sessionDisagreed}`);
        }
       // Emits the updated player array to all players in the session, including the new player
       io.in(sessionId).emit("get_disagreed_players", sessionDisagreed[sessionId]);

    });
    //Resets disagreed player list, and emits empty array
    socket.on("reset_disagreed_list", (session) => {
        const sessionId = session;
        if (sessionDisagreed[sessionId]) {
            sessionDisagreed[sessionId] = [];
        }
       // Emit the updated player array to all players in the session, including the new player
       io.in(sessionId).emit("get_reset_disagreed_list", sessionDisagreed[sessionId]);
    });
    //Accepts session code and emits ready for follow up = true for that client session
    socket.on("follow_up_start", data => {
        console.log("Start button clicked");
        io.in(data).emit("follow_up_start_true", true);
    }
    );
    //Gets current index and emits index +1 for agree page
    socket.on("send_index_agree", (index, session) => {
        const newIndex = index + 1;
        console.log(newIndex);
        io.in(session).emit("get_index_agree", newIndex);
    })
    //Gets current index and emits index +1 for disagree page
    socket.on("send_index_disagree", (index, session) => {
        const newIndex = index + 1;
        console.log(newIndex);
        io.in(session).emit("get_index_disagree", newIndex);
    })
     //Accepts session code and emits round = true for that client session
    socket.on("set_round_finished", (session) => {
        io.in(session).emit("get_round_finished", true);
    })
    //Updates server data for group arrival and emits both groups ready 
    socket.on("status_check", ({ agreeDone, disagreeDone, session }) => {
        // Ensures the session record exists
        if (!sessionGroups[session]) {
          sessionGroups[session] = { agreeDone: false, disagreeDone: false };
        }
    
        // Updates session state based on received data
        sessionGroups[session].agreeDone = agreeDone || sessionGroups[session].agreeDone;
        sessionGroups[session].disagreeDone = disagreeDone || sessionGroups[session].disagreeDone;
    
        // Checks if both groups are ready
        const bothGroupsReady = sessionGroups[session].agreeDone && sessionGroups[session].disagreeDone;
    
        // Broadcasts updated status to all clients in the session
        io.in(session).emit("both_groups_status", bothGroupsReady);
      });
    
      // Handles the coming of individual groups
      socket.on("agreed_here", (session) => {
        if (!sessionGroups[session]) sessionGroups[session] = {};
        sessionGroups[session].agreeDone = true;
        io.in(session).emit("agreed_status_true", true);
      });
    
      socket.on("disagreed_here", (session) => {
        if (!sessionGroups[session]) sessionGroups[session] = {};
        sessionGroups[session].disagreeDone = true;
        io.in(session).emit("disagreed_status_true", true);
      });
    
      //Clears session data when a session ends (if needed)
      socket.on("session_end", (session) => {
        delete sessionGroups[session];
      });

      socket.on("new_question_round", (session) => {
        // Resets agree and disagree statuses for the new round
        if (sessionGroups[session]) {
          sessionGroups[session].agreeDone = false;
          sessionGroups[session].disagreeDone = false;
        }
    
        // Broadcasts reset status to all clients in the session
        io.to(session).emit("both_groups_status", false);
      });

    socket.on("last_question_to_true", data => {
        console.log("Last question set to true");
        io.in(data).emit("last_question_status", true);
    });

    socket.on("change_end_game_status", data => {
        console.log("Ending the session");
        io.in(data).emit("get_end_game_status", true);
    });


    socket.on("disconnect", () => {
        // removes player from player list upon disconnect
        for (const sessionId in sessions) {

            // Remove player from sessions
            sessions[sessionId] = sessions[sessionId].filter(player => player.playerID !== socket.id);
            io.in(sessionId).emit("get_player_array", sessions[sessionId]);
    
            // Removes player from sessionAgreed
            if (sessionAgreed[sessionId]) {
                sessionAgreed[sessionId] = sessionAgreed[sessionId].filter(player => player.playerID !== socket.id);
                io.in(sessionId).emit("get_agreed_players", sessionAgreed[sessionId]);
            }
    
            // Removes player from sessionDisagreed
            if (sessionDisagreed[sessionId]) {
                sessionDisagreed[sessionId] = sessionDisagreed[sessionId].filter(player => player.playerID !== socket.id);
                io.in(sessionId).emit("get_disagreed_players", sessionDisagreed[sessionId]);
            }
    
            // Check if all lists for the session are empty
            const isSessionEmpty = 
                sessions[sessionId].length === 0 &&
                (!sessionAgreed[sessionId] || sessionAgreed[sessionId].length === 0) &&
                (!sessionDisagreed[sessionId] || sessionDisagreed[sessionId].length === 0);
                console.log(sessions[sessionId].length === 0 &&
                    (!sessionAgreed[sessionId] || sessionAgreed[sessionId].length === 0) &&
                    (!sessionDisagreed[sessionId] || sessionDisagreed[sessionId].length === 0));
    
            // If session is empty, clean up all references
            if (isSessionEmpty) {
                console.log(`No players remaining in session ${sessionId}. Removing session data.`);
                delete sessions[sessionId];
                delete sessionAgreed[sessionId];
                delete sessionDisagreed[sessionId];
                delete sessionsQuestions[sessionId];
                delete sessionGroups[sessionId];
    
                // Optional: Notify any admins or other clients about the session ending
            
                console.log(io.to(sessionId).emit("session_ended", sessionId));
            }
            console.log("Player disconnected", socket.id);
            console.log(sessions);

            if (admins[sessionId] === socket.id) {
                // Admin is leaving, find a new admin
                console.log(`Admin ${socket.id} left session ${sessionId}`);
                
                
                    io.to(sessionId).emit("session_ended", sessionId);
                    console.log(`Session ${sessionId} ended due to no available admin.`);
                    delete sessions[sessionId];
                    delete admins[sessionId];
                    delete sessionAgreed[sessionId];
                    delete sessionDisagreed[sessionId];
                    delete sessionsQuestions[sessionId];
                    delete sessionGroups[sessionId];
            }
        }
    });
});

server.listen(PORT, () => {console.log('SERVER RUNNING')});

