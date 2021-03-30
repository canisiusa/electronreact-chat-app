import React from "react"
import PropTypes from "prop-types"


export default class Welcome extends React.Component {
  onSubmit = (e) => {
    e.preventDefault()
    this.props.onNameChange(this.nameEl.value, this.pwdEl.value)
  }

  static defaultProps = {
    onNameChange: () => {

    }
  }
  static propTypes = {
    onNameChange: PropTypes.func.isRequired
  }
  render() {
    return (
      <div class="centered-form">
        <div class="centered-form__form">
          <form onSubmit={this.onSubmit}>
            <div class="form-field">
              <h2>Welcome!</h2>
            </div>
            <div class="form-field">
              <label for="name">Display name</label>
              <input
                required
                className="form-control"
                placeholder="Your userName"
                ref={(input) => { this.nameEl = input }}
              />
            </div>
            <div class="form-field">
              <label for="name">Display password</label>
              <input
                required
                className="form-control"
                type="password"
                placeholder="Your password"
                ref={(input) => { this.pwdEl = input }}
              />
            </div>
            <div class="form-field">
              <button className="btn btn-form btn-primary">OK</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

