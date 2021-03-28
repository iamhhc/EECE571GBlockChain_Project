import React, { useState } from 'react';
import { useAuth, useProvideAuth, authContext } from 'Auth'; 

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

let App =  () => {
  return null;
}

export default App;


// Provide auth context at the highest level of the App
let ProvideAuth = ({ children }) => {
  let auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

// Redirect to sign in page if users are trying to access private routes
let PrivateRoute = ({ children, ...rest}) => {
  let auth = useAuth();
  return (
    <Route 
      {...rest}
      render={({ location }) => {
        auth.user ? (children) :
        (<Redirect
            to={{
              pathname: '/signin',
              state: {from:location},
            }}
        />)
      }}
    />
  );
}
