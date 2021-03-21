import React from "react"
import Participants from "./Participants.jsx";
import Conversation from "./Conversation.jsx"

import socket from "../service/Client"


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
      console.log("liste des users",users)
      users.forEach((user) => {
        let updates = this.state.participants
        let userExist = false
        for (let i = 0; i < updates.length; i++) {
          const existingUser = updates[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            updates[i] = existingUser
            userExist = true
            return;
          }
        }
        this.setState({ participants: updates}, ()=>{
          if (!userExist) {
            user.self = user.userID === socket.userID;
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
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          existingUser.joinedTime = new Date().getTime()
          updates[i] = existingUser
          isSet = true
          return;
        }
      }
      this.setState({ participants: updates }, () => {

        if(isSet) {
          return
        } else {
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

    socket.on("private message", ({ content, from }) => {
      const audio = new Audio('../assets/media/notification.mp3')
      const updateState = this.state.participants
      for (let i = 0; i < updateState.length; i++) {
        const user = updateState[i];
        if (user.userID === from) {
          user.messages.push({
            content,
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
        to: this.state.selectedUser.userID,
      });
      const updatesSelectedUser = this.state.selectedUser
      updatesSelectedUser.messages.push({
        content,
        fromSelf: true
      }) 
      this.setState({ selectedUser: updatesSelectedUser })
    }

  }


  onSelectUser = (user) => {
    user.hasNewMessages = false;

    this.setState({
      selectedUser: user
    })
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