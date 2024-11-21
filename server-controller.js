require('dotenv').config()
const connectdb = require('./db')
const PORT = process.env.PORT || 5000;
const express = require('express');
// const app = express()

const fetchServerStatus= require('./src/server-status/monitor')
const app= require("./app-controller");
const http = require('http');
const servers = http.createServer(app);




const server = (async () => {
  try {
    const { default: chalk } = await import('chalk');
    app.listen(PORT, () => {
      connectdb()
      fetchServerStatus()
      console.log(chalk.green(`\nServer is running on port: ${PORT}`));  
    })
    
  } catch (error) {
    console.log(chalk.red.bold('Error: Server failed to start!'));
    console.error('Error importing chalk:', error);
  }
})();

require('./src/sockets-io.js/socket')(server);


// Handle unhandled promise rejections
process.on("unhandledRejection", async (reason, promise) => {
  (async () => {
    try {
      const { default: chalk } = await import('chalk');
    console.error("Unhandled Rejection at:",chalk.red.bold(promise), "reason:", chalk.red.bold(reason));
    // You can add additional error handling or graceful shutdown logic here
  } catch (error) {
    console.error('Error handling unhandled rejection:',chalk.red.bold(error));
  }
})();
});

// Graceful shutdown on SIGINT signal (Ctrl+C)
process.on("SIGINT", () => {
  console.log("\nShutting down gracefully...");
  server.close(() => {
    console.log("Server has closed.");
    process.exit(0);
  });
});








