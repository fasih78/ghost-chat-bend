// module.exports = (server) => {
//   const { Server } = require('socket.io');
//   const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:9999",  // React app's URL
//       methods: ["GET", "POST"]
//     }
//   });

//   io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);


//     socket.emit('message1', 'Welcome to the chat server!');

//     socket.broadcast.emit('user connected', 'A new user has joined the chat!');

//     socket.on('reconnect', () => {
//       console.log('Reconnected to the server');
//     });

//     io.emit('broadcast message', () => {
//       console.log('Broadcast message to all users')
//     });


//     socket.emit('message', (data) => {
//       console.log('Received message from server:', data);
//     });


//     socket.on('chat message', (msg) => {
//       console.log('Message from client:', msg);

//       io.emit('chat message', msg);

//     });


//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);
//     });
//   });
// };



module.exports = (server) => {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:9999",  // React app's URL
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Emit a welcome message to the client when they connect
    socket.emit('message', 'Welcome to the chat server!');

    // Listen for chat messages from the client
    socket.on('chat message', (msg) => {
      console.log('Message from client:', msg);

      // Broadcast the message to all connected clients (including the sender)
      io.emit('chat message', msg);
    });

    
    socket.on('reconnect', () => {
            console.log('Reconnected to the server');
          });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
