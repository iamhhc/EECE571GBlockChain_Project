import React from 'react';
import { useAuth } from '../Auth';
import { Container, Box, Button, Typography, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';

import useStyles from '../styles/style';
import pageRoutes from './PageRoutes';


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
      <Box className={classes.title}>
        <Typography variant='h1'>Distributed</Typography>
        <Typography variant='h1'>Job Seeking</Typography>
      </Box>
      <Box className={classes.subtitle}>
        <Typography variant='subtitle1'>EECE 571G Project</Typography>
      </Box>
      <Box width='40%'>
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
        <Box className={classes.button}>
          <Button 
            className={classes.button}
            variant='contained'
            fullWidth={true}
            color='primary'
            onClick={signInButtonClicked}>
            Sign In
          </Button>
        </Box>
        <Box className={classes.button}>
          <Button 
            className={classes.button}
            variant='contained'
            fullWidth={true}
            color='default'
            component= {Link}
            to={pageRoutes.SignUpPage}>
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SignInPage;