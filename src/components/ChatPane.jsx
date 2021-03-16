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
    user.connected = true;
    user.messages = [];
    user.hasNewMessages = false;
    user.joinedTime = new Date().getTime()
  };

  componentDidMount() {
    socket.on("connect", () => {
      if (this.state.participants.length !== 0) {
        this.setState(prevState => {
          prevState.participants.forEach((user) => {
            if (user.self) {
              user.connected = true;
            }
          });
        }, () => {
          //callback
        })
      }
    });


    socket.on("users", (users) => {
      users.forEach((user) => {
        user.self = user.userID === socket.id;
        this.initReactiveProperties(user);
      });
      // put the current user first, and then sort by username
      const OrderUsers = users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });

      this.setState({ participants: OrderUsers }, () => {
        // callback
        console.table(OrderUsers)
      })
    });


    socket.on("user connected", (user) => {
      this.initReactiveProperties(user);
      this.setState(prevState => prevState.participants.push(user), () => {
        console.log('user connected')
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
        console.table('user disconnected', this.state.participants)
        //callback
      })

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