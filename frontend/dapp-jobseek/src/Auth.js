import { createContext, useContext, useState} from 'react';

// Create a context to provide authentication info
export const authContext = createContext();

export const useAuth = () => {
  return useContext(authContext);
}

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);

  // should call this function on page refreshed to reload user from local storage
  const refreshed = () => {
    setUser(JSON.parse(localStorage.getItem('user')));;
  }

  // TODO: implement sign in here
  const signin = (callback) => {
    let user = {userAddress: 'testApplicant'};
    localStorage.setItem('user', JSON.stringify(user));
    setUser(JSON.parse(localStorage.getItem('user')));
    
    if (typeof callback === 'function') {
      callback();
    }
    return true;
  }

  // TODO: implement sign out here
  const signout = (callback) => { 
    localStorage.clear();
    setUser(null);

    if (typeof callback === 'function') {
      callback();
    }
    return true;
  }

  return {
    user,
    refreshed,
    signin,
    signout,
  };
}