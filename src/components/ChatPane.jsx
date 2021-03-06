import React from "react"
import Participants from "./Participants.jsx";
import Conversation from "./Conversation.jsx"

import socket from "../service/Client"

import song from '../assets/media/notification.mp3'

export default class ChatPane extends React.Component {
  constructor() {
    super()
    this.state = {
      participants: [],
      selectedUser: null,
    }
  }

  initReactiveProperties = (user) => {
    user.messages = [];
    user.hasNewMessages = false;
    user.joinedTime = new Date().getTime()
  };

  componentDidMount() {
   /*  socket.on("connect", () => {
     // if (this.state.participants.length !== 0) {
       const updateState = this.state.participants
      const updates = updateState.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }
      })
        this.setState({ participants: updates}, () => {
          //callback
        })
     // }
    }); */


    socket.on("users", (users) => {
      users.forEach((user) => {
        let updates = this.state.participants
        let userExist = false
        user.connected === 1 ? user.connected = true : user.connected = false
        for (let i = 0; i < updates.length; i++) {
          const existingUser = updates[i]
          if (existingUser.id === user.id) {
            existingUser.connected = user.connected;
            existingUser.self = user.id === socket.userID;
            updates[i] = existingUser
            userExist = true
            return;
          }
        }
        this.setState({ participants: updates}, ()=>{
          if (!userExist) {
            user.self = user.id === socket.userID;
            this.initReactiveProperties(user);
            let updateState = this.state.participants
            updateState.push(user)
            this.setState({ participants: updateState })
          }
        })        
      });
      // put the current user first, and then sort by username
      const OrderUsers = this.state.participants.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      
      this.setState({ participants: OrderUsers }, () => {
        // callback
      })
    });


    socket.on("user connected", (user) => {
      let updates = this.state.participants
      let isSet = false
      for (let i = 0; i < updates.length; i++) {
        let existingUser = updates[i];
        if (existingUser.id === user.id) {
          existingUser.connected = true;
          existingUser.joinedTime = new Date().getTime()
          updates[i] = existingUser
          isSet = true
          return;
        }
      }
      this.setState({ participants: updates }, () => {

        if(!isSet) {
          this.initReactiveProperties(user);
          this.setState((prevState) => ({participants: [...prevState.participants, user]}), () => {
            console.info(`new user ${user.username}  connected`,this.state.participants)
          })
        }

      })

    });


    socket.on("disconnect", () => {
      const updateUser = this.state.participants
      updateUser.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
      this.setState({ participants: updateUser})
    });

    socket.on("user disconnected", (id) => {
      let updates = this.state.participants
      for (let i = 0; i < updates.length; i++) {
        const user = updates[i];
        if (user.userID === id) {
          user.connected = false;
          updates[i] = user
          break;
        }
      };
      this.setState({
        participants: updates
      }, () => {
        //callback
      })

    });

    socket.on("private message", ({ content, created_at, from }) => {
      var audio = new Audio(song);
      const updateState = this.state.participants
      for (let i = 0; i < updateState.length; i++) {
        const user = updateState[i];
        if (user.id === from) {
          user.messages.push({
            content,
            created_at,
            fromSelf: false,
          });
          if (user !== this.state.selectedUser) {
            user.hasNewMessages = true;
            audio.play()
          }
          updateState[i] = user
          break;
        }
      }
      this.setState({ participants: updateState})
    });

    socket.on("messages list", (messages)=>{
      const setmessages = this.state.selectedUser
      setmessages.messages = messages
      this.setState({ selectedUser: setmessages })
    })
  }



  componentWillUnmount() {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("users");
    socket.off("user connected");
    socket.off("user disconnected");
    socket.off("private message");
  }

  onMessage = (content) => {
    if (this.state.selectedUser) {
      socket.emit("private message", {
        content,
        created_at: new Date().toUTCString(),
        to: this.state.selectedUser.id,
      });
      const updatesSelectedUser = this.state.selectedUser
      updatesSelectedUser.messages.push({
        content,
        created_at: new Date().toUTCString(),
        fromSelf: true
      }) 
      this.setState({ selectedUser: updatesSelectedUser })
    }

  }


  onSelectUser = (user) => {
    socket.emit("get messages", {
      from: socket.userID,
      to: user.id
    });
    user.hasNewMessages = false;
    this.setState({selectedUser: user}, function(){})
  }

  render() {
    return (
      <div className="pane-group" >
        <Participants participants={this.state.participants} onSelectUser={this.onSelectUser} />
        {
          this.state.selectedUser !== null ?
            (<Conversation user={this.state.selectedUser} onMessage={this.onMessage} />) : null
        }
      </div>
    )
  }
}