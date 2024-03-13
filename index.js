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
  size: [20, 20],
  gridDivision: 2,
  items: [
    //top walls
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
      gridPosition: [20, 0],
      rotation: 0,
    },
    {
      ...items.wall,
      gridPosition: [24, 0],
      rotation: 0,
    },
    {
      ...items.wall,
      gridPosition: [28, 0],
      rotation: 0,
    },
    {
      ...items.wall,
      gridPosition: [32, 0],
      rotation: 0,
    },
    {
      ...items.wall,
      gridPosition: [36, 0],
      rotation: 0,
    },

    //left walls
    {
      ...items.wall,
      gridPosition: [-1.5, 37.5],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [-1.5, 33.5],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [-1.5, 29.5],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [-1.5, 25.5],
      rotation: 1,
    },
    {
      ...items.wall,
      gridPosition: [-1.5, 21.5],
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
    {
      ...items.wall,
      gridPosition: [-1.5, 2],
      rotation: 1,
    },

    // // GasTank :
    // {
    //   ...items.gasTank,
    //   gridPosition: [9, 2],
    //   rotation: 0.2,
    // },

    // {
    //   ...items.gasTank,
    //   gridPosition: [12, 8],
    //   rotation: 2.5,
    // },

    // {
    //   ...items.gasTank,
    //   gridPosition: [12, 17.5],
    //   rotation: 0.8,
    // },
    // {
    //   ...items.gasTank,
    //   gridPosition: [8.4, 17.5],
    //   rotation: 0.3,
    // },
    // {
    //   ...items.gasTank,
    //   gridPosition: [7.2, 12.8],
    //   rotation: 0.3,
    // },
    // {
    //   ...items.gasTank,
    //   gridPosition: [17.2, 4.8],
    //   rotation: 0.3,
    // },
  ],
};

const generateRandomPosition = () => {
  return [Math.random() * map.size[0], 0, Math.random() * map.size[1]];
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
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
  });

  io.emit("characters", characters);

  socket.on("disconnect", () => {
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
