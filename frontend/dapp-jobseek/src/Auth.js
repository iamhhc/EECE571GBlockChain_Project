import { createContext, useContext, useState} from 'react';

// Create a context to provide authentication info
export let authContext = createContext();

export let useAuth = () => {
  return useContext(authContext);
}

export let useProvideAuth = () => {
  const [user, setUser] = useState(null);

  // TODO: implement sign in here
  const signin = (callback) => {
    setUser('user');
    if (typeof callback === 'function') {
      callback();
    }
    return true;
  }

  // TODO: implement sign out here
  const signout = (callback) => {
    setUser(null);
    if (typeof callback === 'function') {
      callback();
    }
    return true;
  }

  return {
    user,
    signin,
    signout,
  };
}