import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Chat from './screens/Chat';
import Profile from './screens/Profile';
//import Header from './components/Header';
import Footer from './components/Footer';
function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <>
        {/* <Header></Header> */}
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
