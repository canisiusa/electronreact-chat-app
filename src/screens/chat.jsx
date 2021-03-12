

import React from "react";
import ChatPane from "./components/ChatPane.jsx"
import Welcome from "./components/Welcome.jsx"
import Server from "./service/Server"
import Client from "./service/Client"

const HOST = "127.0.0.1"
const PORT = 8001

export default class Chat extends React.Component {

  constructor() {
    super()
    this.client = new Client()
    this.server = new Server()
    this.server.connect(HOST, PORT, this.client)
    this.state = {
      name: ""
    }
  }

  onNameChange = (userName) => {
    this.setState({ name: userName })
    this.client.join(userName)
  }

  render() {
    const name = this.state.name;
    const client = this.client;
    return (
      <div className="window">
        <div className="window-content">
          {
            name ?
              (<ChatPane client={client} />) :
              (<Welcome onNameChange={this.onNameChange} />)
          }
        </div>
      </div>
    );
  }
}