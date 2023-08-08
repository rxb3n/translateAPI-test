const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const TranslationAPI = require('./TranslationAPI');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = 3000;

// Use cors middleware to enable CORS for all origins for HTTP requests
app.use(cors());


const rooms = {};


// Store connected players and their data
const players = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', ({ username, roomCode }) => {
    // Make sure to handle the unique player ID (socket.id)
    const playerId = socket.id;
    const playerData = {
      id: playerId,
      username,
      roomCode, // Make sure roomCode is correctly added here
      ready: false,
      score: 0,
    };
    players[playerId] = playerData;
    

    // Add player data to players object using socket ID as the key
    players[playerId] = playerData;

    // Join the room using the provided roomCode
    socket.join(roomCode);

    // Emit 'player-list' event to the room with updated player list
    updatePlayerList(roomCode);

    console.log('Player joined:', playerData);
  });

  // Handle "Player Ready" event
  socket.on('player-ready', ({ isReady }) => {
    console.log('Player is ready on server:', isReady);
  
    const roomCode = findRoomCode(socket.id);
    console.log('Room code:', roomCode);
    console.log('Current room players:', rooms[roomCode]);
    if (roomCode && rooms[roomCode]) {
      const player = rooms[roomCode].find((player) => player.id === socket.id);
      player.isReady = isReady;
      updatePlayerList(roomCode);
      
      // Check if all players are ready
      const allPlayersReady = rooms[roomCode].every((player) => player.isReady);
      console.log('All players ready:', allPlayersReady);
  
      if (allPlayersReady) {
        io.to(roomCode).emit('start-game');
      }
    }
  });

  // Handle "Answer Selected" event
  socket.on('answer-selected', (selectedAnswer) => {
    const player = players[socket.id];
    if (player && player.correctAnswer) {
      if (player.correctAnswer.id === selectedAnswer.id) {
        player.score += 1;
      }
      player.correctAnswer = null;
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete players[socket.id];
    updatePlayerList();
  });
});

// Update the player list for a specific room or all rooms
function updatePlayerList(roomCode) {
  console.log('Emitting player list for room:', roomCode);
  const playersInRoom = Object.values(players).filter((player) => player.roomCode === roomCode);
  io.to(roomCode).emit('player-list', playersInRoom);
  console.log('Emitted player list:', playersInRoom);
}


// Check if all players in a room are ready
function areAllPlayersReady(roomCode) {
  const playersInRoom = Object.values(players).filter((player) => player.roomCode === roomCode);
  return playersInRoom.every((player) => player.ready);
}

function findRoomCode(socketId) {
  console.log('Searching for room code for socket ID:', socketId);
      console.log("current rooms are", rooms)
  for (const roomCode in rooms) {
    if (rooms[roomCode].some((player) => player.id === socketId)) {
      console.log('Room code found:', roomCode);
      return roomCode;
    }
  }
  console.log('No matching room code found');
  return null; // Return null if room is not found
}


// Start the game for a specific room
async function startGame(roomCode) {
  const word = 'apple'; // Replace with your logic to get a random word
  const translations = await TranslationAPI.getTranslations(word);
  const correctAnswer = {
    id: translations[0].language,
    text: translations[0].text
  };
  const allAnswers = [
    correctAnswer,
    { id: 'en', text: 'orange' }, // Replace with other random choices
    { id: 'en', text: 'banana' },
    { id: 'en', text: 'grape' },
  ].sort(() => Math.random() - 0.5);

  // Send game data to all players in the room
  io.to(roomCode).emit('game-data', { word, answers: allAnswers });

  // Update players with the correct answer
  const playersInRoom = Object.values(players).filter((player) => player.roomCode === roomCode);
  playersInRoom.forEach((player) => {
    player.correctAnswer = correctAnswer;
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
