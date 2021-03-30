import React, { useEffect } from 'react';
import { Button, Container } from "@material-ui/core";

import { useAuth } from "../Auth";
import useStyles from '../styles/style';
import { useEthConnection } from '../EthConnection';

let MainPage = () => {

  let auth = useAuth();
  let classes = useStyles();
  let ethConnection = useEthConnection();

  useEffect(() => {
    ethConnection.refreshed();
  }, []);

  let signOutClicked = () => {
    auth.signout(null);
    console.log('user signed out: ', auth.user);
  }

  return(
        <Container maxWidth='lg' className={classes.content}>
          <h1>Main Page</h1>
          <Button onClick={signOutClicked}>Sign Out</Button>
        </Container>
  );
}

export default MainPage;

