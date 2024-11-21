const express = require('express');
const app = express(); 



// function checkExternalServiceStatus() {
  
//     return Math.random() < 0.8; // Simulate 80% availability
//   }
// app.get('/status', (req, res) => {
//     // Check the status of external service(s)
//     const isServiceUp = checkExternalServiceStatus();
  
//     if (isServiceUp) {
//       res.json({ status: 'up' });
//     } else {
//       res.json({ status: 'down' });
//     }
//   });


//   module.exports = app