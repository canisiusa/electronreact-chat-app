import React from "react"
import TimeAgo from "react-timeago"
import PropTypes from "prop-types"

import StatusIcon from "./StatusIcon"
export default class Participants extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }
   static defaultProps = {
    participants: null,
    onSelectUser: null
  }
  // eslint-disable-next-line react/no-typos
  static propTypes = {
    participants: PropTypes.array.isRequired,
    onSelectUser: PropTypes.func.isRequired
  } 
  render() {
    return(
      <div className="pane pane-sm sidebar">
        <ul className="list-group">
          {this.props.participants.map((user) =>(
            <li className="list-group-item" key={user.userID} disabled={user.self} onClick={this.props.onSelectUser(user)}>
              <div className="media-body">
                <strong><span className="icon icon-user"></span>&nbsp;{user.username}</strong>
                <p>
                  <StatusIcon connected={user.connected}/>
                  {user.connected ? "online" : "offline"}
                </p>
                <p>Joined <TimeAgo date={user.joinedTime}/></p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}