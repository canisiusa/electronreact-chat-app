/* eslint-disable no-restricted-globals */
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
  }
  static propTypes = {
    participants: PropTypes.array.isRequired,
    onSelectUser: PropTypes.func.isRequired
  } 

  handleClick(user) {
    event.stopImmediatePropagation()
    if (event.target.parentNode.parentNode.classList.contains('list-group-item')){
      event.target.parentNode.parentNode.classList.add('active')
      this.props.onSelectUser(user)
    }
  }
  render() {
    const data = this.props.participants
    return(
      <div className="pane pane-sm sidebar">
        <ul className="list-group">
          <li className="list-group-header">
            <input className="form-control" type="text" placeholder="Rechercher un participant"/>
           </li>
          {data? data.map((user) =>(
            <li className="list-group-item" key={user.id} disabled={user.self} onClick={this.handleClick.bind(this, user)}>
              <div className="media-body" style={{"cursor":"pointer"}}>
                <strong>
                  {
                    user.self ? 
                      <span className="icon icon-info-circled"></span> :
                      <span className="icon icon-user"></span>
                  }
                  &nbsp;{user.username} {user.self ? '(yourself)' : null}
                  </strong>
                <p>
                  <StatusIcon connected={user.connected}/>
                  {user.connected ? "online" : "offline"}
                </p>
                <div className="new-messages">
                  {
                  user.hasNewMessages? '!' : null
                  }
                </div>
                <time>Joined <TimeAgo date={user.joinedTime}/></time>
              </div>
            </li>
          )): <div>Aucun participant pour le moment</div> }
        </ul>
      </div>
    )
  }
}