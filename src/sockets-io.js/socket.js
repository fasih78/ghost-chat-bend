module.exports = (server) => {
    const { Server } = require('socket.io');
    const io = new Server(server);
  
    // Handle client connections
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);
  
      // Listen for chat messages
      socket.on('chatMessage', (message) => {
        console.log(`Message from ${socket.id}: ${message}`);
        // Broadcast the message to all connected clients
        io.emit('chatMessage', { id: socket.id, message });
      });
  
      // Handle disconnects
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  };
  