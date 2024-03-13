const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  //   path: "/back/socket.io", // Spécifiez le chemin ici
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  },
  transports: [
    "websocket",
    "flashsocket",
    "htmlfile",
    "xhr-polling",
    "jsonp-polling",
    "polling",
  ],
  allowEIO3: true,
  serveClient: true,
});

const characters = [];

const items = {
  wall: {
    name: "Wall",
    size: [4, 1],
  },

  gasTank: {
    name: "GasTank",
    size: [1, 1],
  },
};

const map = {
  size: [10, 10],
  gridDivision: 2,
  items: [
    {
      ...items.wall,
      gridPosition: [0, 0],
      rotation: 0,
    },
    {
      ...items.wall,
      gridPosition: [4, 0],
      rotation: 0,
    },
    {
      ...items.wall,
      gridPosition: [8, 0],
      rotation: 0,
    },
    {
      ...items.wall,
      gridPosition: [12, 0],
      rotation: 0,
    },
    {
      ...items.wall,
      gridPosition: [16, 0],
      rotation: 0,
    },
    {
      ...items.wall,
      gridPosition: [17.5, 1.5],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [17.5, 5.5],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [17.5, 9.5],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [17.5, 13.5],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [17.5, 17.5],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [17.5, 17.5],
      rotation: 1,
    },

    {
      ...items.wall,
      gridPosition: [-1.5, 17.5],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [-1.5, 13.5],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [-1.5, 9.5],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [-1.5, 6],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [-1.5, 2],
      rotation: 1,
    },
  ],
};

const generateRandomPosition = () => {
  return [Math.random() * map.size[0], 0, Math.random() * map.size[1]];
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
  console.log("Un client est connecté");
  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
  });

  socket.emit("hello", {
    id: socket.id,
    map,
    items,
    characters,
  });

  socket.on("move", (position) => {
    const character = characters.find(
      (character) => character.id === socket.id
    );
    character.position = position;
    io.emit("characters", characters);
    console.log("walk detected");
  });

  io.emit("characters", characters);

  socket.on("disconnect", () => {
    console.log("disconnected");
    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });
});

server.listen(3000, () => {
  console.log("Serveur en écoute sur le port 3000");
});
