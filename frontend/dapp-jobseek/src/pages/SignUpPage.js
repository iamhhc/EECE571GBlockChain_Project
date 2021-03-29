import React, { useState } from 'react';
import { Box, IconButton, Container, Grid, TextField, LinearProgress, Typography, Switch } 
  from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import CheckIcon from '@material-ui/icons/Check';
import { Redirect } from 'react-router-dom';


import useStyles from '../styles/style';
import { Title } from '../CustomComponents';
import pageRoutes from './PageRoutes';
import { useAuth } from '../Auth';

let SignUpPage = () => {
  let classes = useStyles();
  let [displayForm1, setDisplayForm1] = useState(true);
  let [shouldLeave, setShouldLeave] = useState(false);
  let [jobStatus, setJobStatus] = useState(true);
  let auth = useAuth();

  let cancelButtonClicked = () => {
    setShouldLeave(true);
  }

  let nextButtonClicked = () => {
    setDisplayForm1(false);
  }

  let backButtonClicked = () => {
    setDisplayForm1(true);
  }

  let submitButtonClicked = () => {
    // TODO: Implement signup and signin 
    auth.signin(null);
  }

  let jobSwitchChanged = () => {
    setJobStatus(jobStatus => !jobStatus);
  }

  let accountInfo = (
      <Box width='70%' padding={1}>
        <Grid container className={classes.formGridContainerRow}>
          <Grid item xs={1}>
            <IconButton color='secondary' onClick={cancelButtonClicked}>
              <HighlightOffIcon fontSize='large' />
            </IconButton>
          </Grid>
          <Grid item xs={6}>
            <Box className={classes.formGridItemColumn}>
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
                  id='full-name'
                  label='Full Name'
                  variant='outlined'
                  fullWidth={true}
                  color='primary'
                />
              </Box>
              <Box className={classes.textField}>
                <TextField
                  id='email-address'
                  label='Email Address'
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
              <Box className={classes.linearProgress} >
                <LinearProgress 
                  variant='determinate'
                  value={50}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <IconButton color='primary' onClick={nextButtonClicked}>
              <NavigateNextIcon fontSize='large' />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
  );

  let description = (
      <Box width='70%' padding={1}>
        <Grid container className={classes.formGridContainerRow}>
          <Grid item xs={1}>
            <IconButton color='primary' onClick={backButtonClicked}>
              <NavigateBeforeIcon fontSize='large' />
            </IconButton>
          </Grid>
          <Grid item xs={6}>
            <Box className={classes.formGridItemColumn}>
              <Box className={classes.textField}>
                <TextField
                  id='description'
                  label='Discription of Yourself'
                  variant='outlined'
                  fullWidth={true}
                  color='primary'
                  multiline
                  rows={6}
                  rowsMax={6}
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
                      checked={jobStatus}
                      onChange={jobSwitchChanged}
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
            <IconButton color='primary' onClick={submitButtonClicked}>
              <CheckIcon fontSize='large' />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
  );

  return (
    <Container maxWidth='lg' className={classes.content}>
      {Title()}
      {displayForm1 ? accountInfo : description}
      {shouldLeave ? <Redirect to={pageRoutes.SignInPage}/> : null}
    </Container>
  );

}

export default SignUpPage;

