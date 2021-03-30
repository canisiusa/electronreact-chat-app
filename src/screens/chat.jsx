

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
      socket.auth = { ...socket.auth, sessionID };
      socket.userID = userID;
    });


    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        this.setState({ usernameAlreadySelected: false })
        alert('invalid username or already exist')
      }
    });
  }

  componentWillUnmount() {
    socket.off("connect_error");
  }

  onNameChange = (username) => {
    this.setState({ usernameAlreadySelected: true })
    socket.auth = { username };
    socket.connect();
  }

  render() {
    const usernameAlreadySelected = this.state.usernameAlreadySelected
    return (
      <div className="window-content">
        {
          usernameAlreadySelected ?
            (<ChatPane />) :
            (<Welcome onNameChange={this.onNameChange} />)
        }
      </div>
    );
  }
}