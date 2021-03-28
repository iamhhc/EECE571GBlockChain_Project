import { createContext, useContext} from React;

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
    callback();
  }

  // TODO: implement sign out here
  const signout = () => {
    setUser(null);
    callback();
  }

  return {
    user,
    signin,
    signout,
  };
}