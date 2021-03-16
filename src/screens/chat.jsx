

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