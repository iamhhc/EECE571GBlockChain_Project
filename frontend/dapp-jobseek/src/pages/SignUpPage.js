import React, { useState, useEffect } from 'react';
import { Box, IconButton, Container, Grid, TextField, LinearProgress, 
  Typography, Switch, OutlinedInput, InputAdornment, FormControl, InputLabel } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import CheckIcon from '@material-ui/icons/Check';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import useStyles from '../styles/style';
import { Title } from '../CustomComponents';
import pageRoutes from './PageRoutes';
import { useAuth } from '../Auth';
import { useEthConnection } from '../EthConnection';

let SignUpPage = () => {
  let classes = useStyles();
  let [state, setState] = useState({
    section: 'accountInfo', // alternate between accountInfo and description
    shouldLeave: false, // set this to true to leave sign up page to sign in page
    fullName: '',
    email: '',
    password: '',
    showPassword: false,
    description: '',
    jobStatus: true, // whether the user is looking for a job
  });
  let [activeEthAccount, setActiveEthAccount] = useState(null);

  let auth = useAuth();
  let ethConnection = useEthConnection();

  useEffect(() => {
    setActiveEthAccount(ethConnection.activeEthAccount);
  }, [ethConnection.activeEthAccount]);

  let handleChange = (prop) => (event) => {
    setState({...state, [prop]: event.target.value});
  }

  let submitButtonClicked = () => {
    auth.signup({...state, ethAccount: activeEthAccount});
    auth.signin({
      ethAccount: activeEthAccount,
      password: state.password,
    });
    ethConnection.fakeData();
  }

  let accountInfo = (
      <Box width='70%'>
        <Grid container className={classes.formGridContainerRow}>
          <Grid item xs={1}>
            <IconButton color='secondary' onClick={() => 
              setState({...state, shouldLeave: !state.shouldLeave})}>
              <HighlightOffIcon fontSize='large' />
            </IconButton>
          </Grid>
          <Grid item xs={6}>
            <Box className={classes.formGridItemColumn} height='350px'>
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
                <TextField
                  value={state.fullName}
                  id='full-name'
                  label='Full Name'
                  variant='outlined'
                  fullWidth={true}
                  color='primary'
                  onChange={handleChange('fullName')}
                />
              </Box>
              <Box className={classes.textField}>
                <TextField
                  value={state.email}
                  id='email'
                  label='Email Address'
                  variant='outlined'
                  fullWidth={true}
                  color='primary'
                  onChange={handleChange('email')}
                />
              </Box>
              <Box className={classes.textField}>
              <FormControl variant='outlined' fullWidth>
                <InputLabel className={classes.label}>Password</InputLabel>
                <OutlinedInput
                  id='password'
                  type={state.showPassword ? 'text' : 'password'}
                  value={state.password}
                  onChange={handleChange('password')}
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
              </FormControl>
              </Box>
              <Box className={classes.linearProgress} >
                <LinearProgress 
                  variant='determinate'
                  value={50}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <IconButton color='primary' 
              onClick={() => setState({...state, section: 'description'})}
            >
              <NavigateNextIcon fontSize='large' />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
  );

  let description = (
      <Box width='70%'>
        <Grid container className={classes.formGridContainerRow}>
          <Grid item xs={1}>
            <IconButton color='primary' 
              onClick={() => setState({...state, section: 'accountInfo'})}
            >
              <NavigateBeforeIcon fontSize='large' />
            </IconButton>
          </Grid>
          <Grid item xs={6}>
            <Box className={classes.formGridItemColumn} height='350px' >
              <Box className={classes.textField}>
                <TextField
                  value={state.description}
                  id='description'
                  label='Discription of Yourself'
                  variant='outlined'
                  fullWidth={true}
                  color='primary'
                  multiline
                  rows={10}
                  rowsMax={10}
                  onChange={handleChange('description')}
                />
              </Box>
              <Box className={classes.textField}>
                <Grid component='label' container className={classes.formGridContainerRow}>
                <Grid item> 
                    <Typography variant='body1' color='primary'>
                      Are you actively looking for a job?
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Switch 
                      checked={state.jobStatus}
                      onChange={() => setState({...state, jobStatus: !state.jobStatus})}
                      color='primary'
                    />
                  </Grid>
                </Grid>
                
              </Box>
              <Box className={classes.linearProgress} >
                <LinearProgress 
                  variant='determinate'
                  value={100}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <IconButton color='primary' 
              onClick={(submitButtonClicked)}
            >
              <CheckIcon fontSize='large' />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
  );

  return (
    <Container maxWidth='lg' className={classes.content}>
      <Title />
      {state.section === 'accountInfo' ? accountInfo : description}
      {state.shouldLeave ? <Redirect to={pageRoutes.SignInPage}/> : null}
    </Container>
  );

}

export default SignUpPage;

