

import React from "react";
import ChatPane from "../components/ChatPane.jsx"
import Welcome from "../components/Welcome.jsx"
import socket from "../service/Client"

export default class Chat extends React.Component {

  constructor() {
    super()
    this.state = {
      name: "",
      usernameAlreadySelected: false
    }
  }
  componentDidMount() {


      socket.on("session", ({ sessionID, userID }) => {
        // attach the session ID to the next reconnection attempts
        socket.auth = { sessionID };
        // save the ID of the user
        socket.userID = userID;
      });


    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        this.setState({ name: "" })
      }
    });
  }

  componentWillUnmount() {
    socket.off("connect_error");
  }

  onNameChange = (username, password) => {
    this.setState({ usernameAlreadySelected: true })
    socket.auth = { username };
    socket.connect();
  }

  render() {
    const usernameAlreadySelected = this.state.usernameAlreadySelected
    return (
      <div className="window-content">
        {
          usernameAlreadySelected?
            (<ChatPane />) :
            (<Welcome onNameChange={this.onNameChange} />)
        }
      </div>
    );
  }
}