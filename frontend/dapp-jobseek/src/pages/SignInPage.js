import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth';
import { Container, Box, Button, TextField, OutlinedInput, InputAdornment, IconButton, FormControl, InputLabel, FormHelperText } from '@material-ui/core';
import { Link } from 'react-router-dom';

import useStyles from '../styles/style';
import pageRoutes from './PageRoutes';
import { Title } from '../CustomComponents';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useEthConnection } from '../EthConnection';


let SignInPage = () => {

  let [state, setState] = useState({
    password: '',
    showPassword: false,
    signInFailed: false,
  });
  let [ethCV, setEthCV] = useState(null);
  let [activeEthAccount, setActiveEthAccount] = useState(null);

  const classes = useStyles();
  const auth = useAuth();
  const ethConnection = useEthConnection();
  
  useEffect(() => {
    setEthCV(ethConnection.ethCV);
  }, [ethConnection.ethCV]);

  useEffect(() => {
    setActiveEthAccount(ethConnection.activeEthAccount);
  }, [ethConnection.activeEthAccount]);


  let signInButtonClicked = async () => {
    // password cannot be empty
    if (state.password === '') {
      setState({...state, signInFailed:true});
      return;
    }

    let success = await auth.signin({
      ethAccount: activeEthAccount, password: state.password}, ethCV);
    if (!success) {
      setState({...state, signInFailed:true});
    }
  }
  

  return (
    <Container maxWidth='lg' className={classes.content}>
      <Title />
      <Box width='35%' className={classes.formGridItemColumn}>
        <Box className={classes.textField}>
          <TextField 
            value={activeEthAccount == null ? 
              'Please connect to metamask' : activeEthAccount}
            id='eth-account'
            label='Eth Account'
            variant='outlined'
            fullWidth={true}
            color='primary'
            disabled
          />
        </Box>
        <Box className={classes.textField}>
          <FormControl variant='outlined' fullWidth>
            <InputLabel className={classes.label}>Password</InputLabel>
            <OutlinedInput
              id='password'
              type={state.showPassword ? 'text' : 'password'}
              value={state.password}
              onChange={(event) => {
                setState({
                  ...state, 
                  password: event.target.value,
                  signInFailed: false
                });
              }}
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
              error={state.signInFailed}
            />
            {
              state.signInFailed ? 
              <FormHelperText
                error
                variant='outlined'
              >
                Incorrect Password
               </FormHelperText> : null
            } 
          </FormControl>
          
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