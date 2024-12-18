require('dotenv').config();
const connectdb = require('./db');
const PORT = process.env.PORT || 5000;
const express = require('express');
const app = require("./app-controller"); // Assuming app-controller sets up express
const http = require('http');
const fetchServerStatus = require('./src/server-status/monitor');

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server

const socketHandler = require('./src/sockets-io.js/socket'); // Require the socket handler

// Pass the HTTP server to Socket.IO
socketHandler(server);

server.listen(PORT, async () => {
  try {
    await connectdb();  // Connect to the database
    // fetchServerStatus(); // Optionally monitor the server status
    console.log((`\nServer is running on port: ${PORT}`));
  } catch (error) {
    console.log(('Error: Server failed to start!'));
    console.error(error);
  }
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally add graceful shutdown here
});

// Graceful shutdown on SIGINT signal (Ctrl+C)
process.on("SIGINT", () => {
  console.log("\nShutting down gracefully...");
  server.close(() => {
    console.log("Server has closed.");
    process.exit(0);
  });
});
