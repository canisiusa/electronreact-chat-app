import React from "react";
import PropTypes from "prop-types"

export default function StatusIcon(props) {
  return (
    <i style={iconStyles && props.connected ? connected : null} ></i>
  );
}

StatusIcon.propTypes = {
  connected: PropTypes.bool.isRequired
}
const iconStyles = `
  .icon {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    display: inline-block;
    background-color: #e38968;
    margin-right: 6px;
  }
`
const connected = `
  .icon.connected {
    background-color: #86bb71;
  } 
`