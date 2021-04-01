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
  const signin = async (value, ethCV) => {
    if (ethCV == null) {
      console.error('Contract not deployed, cannot sign in');
      return;
    }

    let response = await ethCV.methods.Login(value.ethAccount, value.password)
    .send({from: value.ethAccount});
    console.log(response);
    // if (success) {
    //   let user = {userAddress: value.ethAccount};
    //   localStorage.setItem('user', JSON.stringify(user));
    //   setUser(JSON.parse(localStorage.getItem('user')));
    //   return true;
    // } else {
    //   return false;
    // }
  }

  // TODO: implement sign up here
  const signup = async (value, ethCV) => {
    if (!ethCV) {
      console.error('Contract not deployed, cannot sign up');
      return;
    }



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