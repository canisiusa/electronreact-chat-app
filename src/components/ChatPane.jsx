import React from "react"
import Participants from "./Participants.jsx";
import Conversation from "./Conversation.jsx"

import socket from "../service/Client"


export default class ChatPane extends React.Component {
  constructor() {
    super()
    this.state = {
      participants: [],
      selectedUser: null
    }
    const initReactiveProperties = (user) => {
      user.connected = true;
      user.messages = [];
      user.hasNewMessages = false;
      user.joinedTime = new Date().getTime()
    };

    socket.on("connect", () => {
      this.setState(prevState => {
        prevState.participants.forEach((user) => {
          if (user.self) {
            user.connected = true;
          }
        });
      })
    });

    socket.on("disconnect", () => {
      this.setState(prevState => {
        prevState.forEach((user) => {
          if (user.self) {
            user.connected = false;
          }
        });
      })
    });

    socket.on("users", (users) => {
      users.forEach((user) => {
        user.self = user.userID === socket.id;
        initReactiveProperties(user);
      });
      // put the current user first, and then sort by username
      const OrderUsers = users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });

      this.setState({ participants: OrderUsers })
    });

    socket.on("user connected", (user) => {
      initReactiveProperties(user);
      this.setState(prevState => prevState.participants.push(user))
    });

    socket.on("private message", ({ content, from }) => {
      this.setState((prevState) => {
        for (let i = 0; i < prevState.participants.length; i++) {
          const user = prevState.participants[i];
          if (user.userID === from) {
            user.messages.push({
              content,
              fromSelf: false,
            });
            if (user !== prevState.selectedUser) {
              user.hasNewMessages = true;
            }
            break;
          }
        }
      })
    });
  }

  onMessage(content) {
    if (this.state.selectedUser) {
      socket.emit("private message", {
        content,
        to: this.selectedUser.userID,
      });
      this.selectedUser.messages.push({
        content,
        fromSelf: true,
      });
    }
  }

  onSelectUser(user) {
    user.hasNewMessages = false;
    this.setState({
      selectedUser: user
    })
  }

  render() {
    return (
      <div className="pane-group" >
        <Participants participants={this.state.participants} onSelectUser={this.onSelectUser}/>
        { 
          this.state.selectedUser ? 
            (<Conversation user={this.state.selectedUser} onMessage={this.onMessage}/>): null
        }
      </div>
    )
  }
}