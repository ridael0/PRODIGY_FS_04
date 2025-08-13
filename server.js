const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server is running');
});

// Create WebSocket server by passing the HTTP server
const wss = new WebSocket.Server({ server });

// Store all connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Add the new client to the clients set
  clients.add(ws);
  
  // Send welcome message to the new client
  //ws.send('Welcome to the chat server! There are ' + clients.size + ' users connected.');

  // Handle messages from this client
  ws.on('message', (message) => {
    console.log('Received: %s', message);
    
    // Broadcast the message to all clients
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});