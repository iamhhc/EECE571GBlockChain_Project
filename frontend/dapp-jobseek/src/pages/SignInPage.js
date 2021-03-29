import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth';
import { Container, Box, Button, TextField, OutlinedInput, InputAdornment, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';

import useStyles from '../styles/style';
import pageRoutes from './PageRoutes';
import { Title } from '../CustomComponents';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


let SignInPage = () => {

  let [state, setState] = useState({
    ethAccount: '',
    password: '',
    showPassword: false,
  });

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
            onChange={(event) => setState({...state, ethAccount:event.target.value})}
          />
        </Box>
        <Box className={classes.textField}>
          <OutlinedInput
            id='password'
            type={state.showPassword ? 'text' : 'password'}
            value={state.password}
            onChange={(event) => setState({...state, password:event.target.value})}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggel password visibility'
                  onClick={() => setState({...state, showPassword: !state.showPassword})}
                  edge='end'
                >
                  {state.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            color='primary'
            fullWidth={true}
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