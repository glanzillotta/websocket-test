const WebSocket = require('ws');

// Server WebSocket
const wss = new WebSocket.Server({ port: 3005 }, () => {
  console.log('Server WebSocket avviato sulla porta 3005');
});

// Salviamo la conversazione (in memoria)
const conversation = [];

// Associamo ogni client al suo username
const clients = new Map();

wss.on('connection', (ws) => {
  console.log(`🟢 Nuovo client connesso, in attesa di username`);

  // Flag per verificare se l'utente è già autenticato
  let isAuthenticated = false;

  ws.on('message', (data) => {
    const messageData = JSON.parse(data.toString());

    // Se è il primo messaggio, consideriamolo come autenticazione
    if (!isAuthenticated) {
      if (messageData.type === 'auth' && messageData.username) {
        clients.set(ws, messageData.username);
        isAuthenticated = true;
        console.log(`🟢 Utente autenticato: ${messageData.username}`);
        return;
      }
      return; // Ignora messaggi se l'utente non è autenticato
    }

    const username = clients.get(ws);
    const message = {
      userId: username,
      text: messageData.text,
      timestamp: new Date().toISOString(),
    };

    // Salva nella conversazione
    conversation.push(message);

    // Inoltra il messaggio a tutti i client
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });

  ws.on('close', () => {
    const username = clients.get(ws);
    clients.delete(ws);
    console.log(`🔴 Utente disconnesso: ${username}`);
  });
});