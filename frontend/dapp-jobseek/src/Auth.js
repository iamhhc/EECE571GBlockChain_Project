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
  const signin = (value) => {
    console.log(value);

    let user = {userAddress: value.ethAccount};
    // temporarily only supoort two accounts in the fake data
    if (user.userAddress !== 'testApplicant' && user.userAddress !== 'testCompany') {
      return false;
    }

    localStorage.setItem('user', JSON.stringify(user));
    setUser(JSON.parse(localStorage.getItem('user')));
    
    return true;
  }

  // TODO: implement sign up here
  const signup = (value) => {
    console.log(value);
    return true;
  }

  // TODO: implement sign out here
  const signout = () => { 
    localStorage.clear();
    setUser(null);

    return true;
  }

  return {
    user,
    refreshed,
    signin,
    signup,
    signout,
  };
}