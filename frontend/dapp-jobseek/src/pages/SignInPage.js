import React from 'react';
import { useAuth } from '../Auth';
import { Container, Box, Button, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';

import useStyles from '../styles/style';
import pageRoutes from './PageRoutes';
import { Title } from '../CustomComponents';


let SignInPage = () => {

  const classes = useStyles();
  const auth = useAuth();

  let signInButtonClicked = () => {
    // TODO: sign in here
    auth.signin(null);
    console.log('user signed in');
  }

  return (
    <Container maxWidth='lg' className={classes.content}>
      {Title()}
      <Box width='35%' className={classes.formGridItemColumn}>
        <Box className={classes.textField}>
          <TextField 
            id='eth-account'
            label='Eth Account'
            variant='outlined'
            fullWidth={true}
            color='primary'
          />
        </Box>
        <Box className={classes.textField}>
          <TextField 
            id='password'
            label='Password'
            variant='outlined'
            fullWidth={true}
            color='primary'
          />
        </Box>
        <Button 
          className={classes.button}
          variant='contained'
          fullWidth={true}
          color='primary'
          onClick={signInButtonClicked}>
          Sign In
        </Button>
        <Button 
          className={classes.button}
          variant='outlined'
          fullWidth={true}
          color='default'
          component= {Link}
          to={pageRoutes.SignUpPage}>
          Sign Up
        </Button>
      </Box>
    </Container>
  );
}

export default SignInPage;