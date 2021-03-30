const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:7065",
  },
});

let moment = require('./config/moment')

let Session = require('./models/session')
let User = require('./models/user')
let Message = require('./models/message')
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

io.use((socket, next) => {

  //const sessionID = socket.handshake.auth;
  //console.log(sessionID)
  /*   if (sessionID) {
       // find existing session
      //const session = sessionStore.findSession(sessionID);
      //if (session[0].connected === true) {
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        return next();
      //}
    } */
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  // create new session
  socket.username = username;
  next();
});


io.on("connection", async (socket) => {

  //#region create or check user
  User.create(socket.username, function (result) {
    let userID = result[0].id
    let sessionID = randomId()
    socket.sessionID = sessionID
    socket.userID = userID
    // persist session
    Session.saveSession({
      id: sessionID,
      user_id: userID,
      connected: true,
    }, function (res) { });

    //#region  emit session details
    socket.emit("session", {
      sessionID,
      userID
    });
    //#endregion

    //#region  join the "userID" room
    socket.join(socket.userID);
    //#endregion



    //#region  fetch existing users
    let users = [];
    User.getAll(function (res) {
      res.forEach((user) => {
        Session.findUser(user.id, function (sessions) {
          users.push({ ...user, connected: sessions[0]?.connected })
          socket.emit("users", users);
        })
      })
    })
    //#endregion

    //#region  notify existing users
    socket.broadcast.emit("user connected", { ...result[0], connected: true, sessionID: sessionID });
    //#endregion
  })
  //#endregion


  //#region  forward the private message to the right recipient (and to other tabs of the sender)
  socket.on("private message", ({ content, created_at, to }) => {
    Message.create({content, from: socket.userID, to })
    socket.to(to).to(socket.userID).emit("private message", {
      content,
      created_at,
      from: socket.userID,
      to,
    });
  });
  //#endregion


  //#region  get user conversation
  socket.on("get messages", ({from, to})=>{
    Message.get(from, to, function(result){
      result.map((element)=>{
        element.created_at = moment(element.created_at).toLocaleString()
        if (element.from_id === from){
          return element.fromSelf = true
          
        }else{
          return element.fromSelf = false
           
        }
      })
      socket.emit("messages list", result)
    })
  })
  //#endregion

  //#region  notify users upon disconnection
  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      Session.disconnectUser(socket.sessionID)
    }
  });
  //#endregion
});


const PORT = process.env.PORT || 5765;


const URL = `http://localhost:${PORT}`

httpServer.listen(PORT, () =>
  console.log(`server listening at ${URL}`)
);

