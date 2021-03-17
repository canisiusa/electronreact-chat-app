

import React from "react";
import ChatPane from "../components/ChatPane.jsx"
import Welcome from "../components/Welcome.jsx"
import socket from "../service/Client"

export default class Chat extends React.Component {

  constructor() {
    super()
    this.state = {
      name: ""
    }
  }
  componentDidMount() {

    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
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

  onNameChange = (username) => {
    this.setState({ name: username })
    socket.auth = { username };
    socket.connect();
  }

  render() {
    const name = this.state.name;
    return (
      <div className="window-content">
        {
          name ?
            (<ChatPane />) :
            (<Welcome onNameChange={this.onNameChange} />)
        }
      </div>
    );
  }
}