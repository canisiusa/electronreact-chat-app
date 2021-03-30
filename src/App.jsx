import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Chat from './screens/chat';
import Profile from './screens/Profile';
import Footer from './components/Footer';
function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <>
          <Switch>
            <Route path="/" exact component={Chat} />
            <Route path="/profile" exact component={Profile} />
          </Switch>
          <Footer></Footer>
        </>
      </BrowserRouter>
    </React.StrictMode>
  )
}

export default App;
