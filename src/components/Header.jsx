import React from "react"
//const { ipcRenderer } = require('electron');


export default class Header extends React.Component {

  constructor(props) {
    super(props)
    this.state = { isMaximized: false }
  }
   /* onRestore = () => {
     (async () => {
       await ipcRenderer.invoke('restore-window');
     })();
   }
   onMaximize = () => {
     (async () => {
       await ipcRenderer.invoke('maximize-window');
     })();
   }
   onClose = () => {
     (async() => {
       await ipcRenderer.invoke('close-app');
     })();
   }  */
  render() {
    //const { isMaximized } = this.state;
    return (
      <header className="toolbar toolbar-header margin-bottom-more">
        {/* <div className="toolbar-actions">
          <button className="btn btn-default pull-right" onClick={this.onClose}>
            <span className="icon icon-cancel"></span>
          </button>
          {
            isMaximized ? 
            (<button className="icon icon-resize-small"></button>) : 
            (<button className="btn btn-default pull-right" onClick={this.onMaximize}>
                <span className="icon icon-resize-full"></span>
            </button>)
          }
        </div> */}
        <div className="toolbar-actions">
          <div className="btn-group">
            <button className="btn btn-default">
              <span className="icon icon-home icon-text"></span>
              Acceuil
            </button>
            <button className="btn btn-default active">
              <span className="icon icon-cloud icon-text"></span>
              Chat
            </button>

            <button className="btn btn-default">
              <span className="icon icon-shuffle icon-text"></span>
              Profil
            </button>
            <button className="btn btn-default">
              <span className="icon icon-logout icon-text"></span>
              Se déconnecter
            </button>
          </div>


          <button className="btn btn-default">
            <span className="icon icon-megaphone icon-text"></span>
              Send location
            </button>

          <div className="btn-group pull-right">

            <button className="btn btn-default">
              <span className="icon icon-popup"></span>
            </button>
            <button className="btn btn-default">
              <span className="icon icon-resize-full"></span>
            </button>

            <button className="btn btn-default">
              <span className="icon icon-cancel"></span>
            </button>
          </div>
        </div>
      </header>
    )
  }
}