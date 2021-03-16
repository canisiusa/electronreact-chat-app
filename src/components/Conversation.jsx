import React from "react"
import PropTypes from "prop-types"
const ENTER_KEY = 13


export default class Conversation extends React.Component {
  constructor(props) {
    super(props)
    this.messages = []
    this.state = {
      messages: []
    }
  }
  static defaultProps = {
    onMessage: null
  }
  static propTypes = {
    onMessage: PropTypes.func.isRequired
  }
  static normalizeTime(date, now, locale) {
    const isToday = (now.toDateString() === date.toDateString())
    return isToday ? date.toLocaleTimeString(locale) : date.toLocaleDateString(locale) + ` ` + date.toLocaleTimeString(locale)
  }
  onKeydown = (e) => {
    if (e.which === ENTER_KEY && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault()
      this.submit()
    }
  }
  onSubmit = (e) => {
    e.preventDefault()
    this.submit()
  }
  submit() {
    this.props.onMessage(this.inputEl.value)
    this.inputEl.value = ""
  }
  render() {
    const messages = this.props.user.messages;
    const user = this.props.user;
    return (
      <div className="pane padded-more l-chat">
        <ul className="list-group l-chat-conversation">
          {messages.map((msg, i) => (
            <li className="list-group-item" key={i}>
              <div className="media-body">
                {/* <time className="media-body__time">{Conversation.normalizeTime(msg.time, new Date())}</time> */}
                <strong>{msg.fromSelf ? "(yourself)" : user.username}:</strong>
                {msg.content.split("\n").map((line, inx) => (
                  <p key={inx}>{line}</p>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <form className="l-chat-form" onSubmit={this.onSubmit}>
          <div className="form-group">
            <textarea
              onKeyDown={this.onKeydown}
              required
              placeholder="Say something..."
              className="form-control"
              ref={el => { this.inputEl = el }}
            ></textarea>
          </div>
          <div className="form-actions">
            <button className="btn btn-form btn-primary">OK</button>
          </div>
        </form>
      </div>
    );
  }

}