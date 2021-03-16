
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:7065",
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  // fetch existing users
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});


const PORT = process.env.PORT || 5765;


const URL = `http://localhost:${PORT}`

httpServer.listen(PORT, () =>
  console.log(`server listening at ${URL}`)
);

module.exports = {URL}











/* import * as ws from "nodejs-websocket";
import {Message} from './Message'

export default class Server {
  constructor(){
    this.participants = new Map()
    this.server = ws.createServer((conn) =>{
      conn.on("error", (err) =>{
        console.error("Server error", err)
      })
      conn.on("close", (code, reason) =>{
        console.log("Server closes a connection", code, reason)
      })
      conn.on("connexion", () => {
        console.info("Server creates a new connection")
      })
      conn.on("text", (text) => {
        const msg = Message.fromString(text),
              method = `on${msg.event}`;
        if(!this[method]){
          return;
        }
        console.log("this[method]", this[method])
        this[method](msg.data, conn)
      })
    })
  }//end constructor

  broadcast(event, data) {
    const text = Message.toString(event, data);
    this.server.connections.forEach(conn => {
      conn.sendText(text)
    })
  }//end broadcast

  connect(host,port, client){
    client.connect(host, port).catch(() => {
      this.server.listen(port, host, () => {
        console.info("server is ready");
        client.connect(host, port).catch(() => {
          console.error("Client's error");
        })
      })
    })
  }

  onjoin(name, conn) {
    const datetime = new Date()
    this.participants.set(conn, {
      name: name,
      time: datetime.toString()
    })
    console.log("this.participants.values()", this.participants.values())
    this.broadcast("participants", Array.from(this.participants.values()));
  }
  ontext(data, conn) {
    const name = this.participants.get(conn).name;
    this.broadcast('text', {name, ...data})
  }
} */