import React from "react";
import PropTypes from "prop-types"

export default function StatusIcon (props) {
  return (
      props.connected ? 
        (<i className="icon_status connected"></i> ) :
        (<i className="icon_status"></i> )
  );
}

StatusIcon.propTypes = {
  connected: PropTypes.bool.isRequired
}
