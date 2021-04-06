import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth';
import { Box, Container, Grid, IconButton, Select, LinearProgress, Typography, withStyles, TextField, MenuItem, FormControl, InputLabel, Button } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup, Autocomplete } from '@material-ui/lab';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import DoneIcon from '@material-ui/icons/Done';

import useStyles from '../styles/style';
import { Redirect } from 'react-router';
import { useLocation, Link } from "react-router-dom";
import PageRoutes from './PageRoutes';
import { useEthConnection } from '../EthConnection';

const StyledToggleButtonGroup = withStyles((theme) => ({
  groupedVertical: {
    margin: theme.spacing(2),
    border: 'none',
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup);

const StyledToggleButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#f1f9ff',
    color: '#2699fb',
    textTransform: 'capitalize',
    fontSize: '1.2em',
    margin: theme.spacing(2),
    padding: '12px 30px',
    border: '0',
    '&.Mui-selected': {
      backgroundColor: '#2699fb',
      color: 'white',
      '&:hover': {
        backgroundColor: '#2699fb',
        color: 'white'
      },
    },
    '&:hover': {
      backgroundColor: '#f1f9ff',
    },
  },
}))(ToggleButton);


let CreateExperiencePage = (props) => {

  const classes = useStyles();
  const auth = useAuth();
  let ethConnection = useEthConnection();
  let address = auth.user.userAddress;
  // console.log(address);
  // console.log(props);

  let [ethCV, setEthCV] = useState(null);
  
  let [state, setState] = useState({
    expType: 'eduExp',
    section: 'chooseType',
    shouldLeave: false,
    id: '',
    orgName: '',
    position: '',
    description: '',
    startMonthYear: '',
    endMonthYear: '',
    degreeName: '',
    fieldsOfStudy: '',
    verifier: null,
  });

  const [users, setUsers] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [idError, setIdError] = useState(false);
  const [posError, setPosError] = useState(false);
  const [dateError, setDateError] = useState(false);


  useEffect(() => {
    setUsers(ethConnection.getAllUsers());
  }, [ethConnection.ethData]);

  useEffect(() => {
    setEthCV(ethConnection.ethCV);
  }, [ethConnection.ethCV]);

  // console.log(users);

  let changeExpType = (ev, value) => {
    setState({...state, expType: value});
  }

  let validateForm = () => {
    let isValid = true;
    if (state.orgName === '') {
      setNameError(true);
      isValid = false;
    }
    else {
      setNameError(false);
    }
    if (state.id === '') {
      setIdError(true);
      isValid = false;
    } else {
      setIdError(false);
    }
    if (state.startMonthYear === '' || state.endMonthYear == '') {
      setDateError(true);
      isValid = false;
    } else {
      let startDate = new Date(state.startMonthYear);
      let endDate = new Date(state.endMonthYear);
      if (startDate > endDate) {
        setDateError(true);
        isValid = false;
      } else {
        setDateError(false);
      }
    }
    if ((state.expType === 'eduExp' && state.degreeName === '') || 
        (state.expType === 'workExp' && state.position === '')) 
    {
      setPosError(true);
      isValid = false;
    } else {
        setPosError(false);
    }

    if (isValid) {
      setState({...state, section: 'chooseVerifier'});
    }
  }

  const create = async (value, ethCV) => {
    if (ethCV == null) {
      console.error('Contract not deployed, cannot create record');
      return false;
    }
    console.log('value', value);
    // try {
    await ethCV.methods.createRecord(value.id, value.orgName, value.position, value.description, 
      value.startMonthYear, value.endMonthYear, value.degreeName, value.fieldsOfStudy, 
      value.verifier.userAddress, value.isEducation).send({from: address, value: '1000000000000000000'});
    // } catch (err) {
    //   window.alert(err.message);
    //   return false;
    // }
    // .once('receipt', async (receipt) => {
    //   console.log(receipt);
    // }).on('error', async (error) => { 
    //   console.log(error);
    // });
    return true;
  }

  let handleChange = (prop) => (event) => {
    setState({...state, [prop]: event.target.value});
  }

  let handleSubmit = async () => {
    console.log(state.verifier.userAddress);
    if (state.verifier != null) {
      // create record
      let success = await create({...state, isEducation: state.expType === 'eduExp' ? true : false}, ethCV);
      if (success) {
        ethConnection.updateEthData();
        setState({...state, section: 'done'});
      }
    }
  }

  let title = (
    <Box className={classes.addExpTitle}>
      <Typography variant='h4'>Add a New Experience</Typography>
    </Box>
  );

  let experienceType = (
    <Box width='70%'>
      {title}
      <Grid container className={classes.formGridContainerRow}>
        <Grid item xs={1}>
          <IconButton color='secondary'
            onClick={() => setState({...state, shouldLeave: !state.shouldLeave})}
          >
            <HighlightOffIcon fontSize='large' />
          </IconButton>
        </Grid>
        <Grid item xs={6}>
          <Box className={classes.formGridItemColumn}>
            <Box className={classes.subtitle}>
              <Typography variant='subtitle1'>What Kind of Experience?</Typography>
            </Box>
            <StyledToggleButtonGroup orientation='vertical' value={state.expType} onChange={changeExpType} exclusive>
              <StyledToggleButton value='eduExp'>
                Educational Experience
              </StyledToggleButton>
              <StyledToggleButton value='workExp'>
                Work Experience
              </StyledToggleButton>
            </StyledToggleButtonGroup>
          </Box>
        </Grid>
        <Grid item xs={1}>
          <IconButton color='primary'
            onClick={() => setState({...state, section: 'experience'})}
          >
            <NavigateNextIcon fontSize='large' />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );

  let eduExperience = (
    <form className={classes.form} noValidate>
      <Grid container>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='institution'
            value={state.orgName}
            label='Institution Name'
            variant='outlined'
            fullWidth
            color='primary'
            error={nameError}
            helperText={nameError ? 'cannot be empty' : ''}
            onChange={handleChange('orgName')}
            required
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='student-id'
            value={state.id}
            label='Student ID'
            variant="outlined"
            fullWidth
            color='primary'
            error={idError}
            helperText={idError ? 'cannot be empty' : ''}
            onChange={handleChange('id')}
            required
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='degree'
            value={state.degreeName}
            label='Degree Name'
            variant="outlined"
            fullWidth
            color='primary'
            error={posError}
            helperText={posError ? 'cannot be empty' : ''}
            onChange={handleChange('degreeName')}
            required
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='field-of-study'
            value={state.fieldsOfStudy}
            label='Field of Study'
            variant="outlined"
            fullWidth
            color='primary'
            onChange={handleChange('fieldsOfStudy')}
          />
        </Grid>
        <Grid item sm={12} md={6} className={classes.textField}>
          <TextField
            id="edu-start-date"
            value={state.startMonthYear}
            label="Start Date"
            type="date"
            error={dateError}
            helperText={dateError ? 'date empty or start date after end date' : ''}
            onChange={handleChange('startMonthYear')}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item sm={12} md={6} className={classes.textField}>
          <TextField
            id="edu-end-date"
            value={state.endMonthYear}
            label="End Date"
            type="date"
            error={dateError}
            helperText={dateError ? 'date empty or start date after end date' : ''}
            onChange={handleChange('endMonthYear')}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='description'
            label='Optional description'
            value={state.description}
            variant="outlined"
            fullWidth
            color='primary'
            multiline
            rows={8}
            rowsMax={8}
            onChange={handleChange('description')}
          />
        </Grid>
      </Grid>
    </form>
  );

  let workExperience = (
    <form className={classes.form} noValidate>
      <Grid container>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='company'
            label='Company Name'
            value={state.orgName}
            variant='outlined'
            fullWidth
            color='primary'
            error={nameError}
            helperText={nameError ? 'cannot be empty' : ''}
            onChange={handleChange('orgName')}
            required
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='employer-id'
            label='Employer ID'
            value={state.id}
            variant="outlined"
            fullWidth
            color='primary'
            error={idError}
            helperText={idError ? 'cannot be empty' : ''}
            onChange={handleChange('id')}
            required
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='position'
            label='Position'
            value={state.position}
            variant='outlined'
            fullWidth
            color='primary'
            error={posError}
            helperText={posError ? 'cannot be empty' : ''}
            onChange={handleChange('position')}
            required
          />
        </Grid>
        <Grid item sm={12} md={6} className={classes.textField}>
          <TextField
            id='work-start-date'
            label='Start Date'
            value={state.startMonthYear}
            type='date'
            error={dateError}
            helperText={dateError ? 'date empty or start date after end date' : ''}
            onChange={handleChange('startMonthYear')}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item sm={12} md={6} className={classes.textField}>
          <TextField
            id='work-end-date'
            label='End Date'
            value={state.endMonthYear}
            type='date'
            error={dateError}
            helperText={dateError ? 'date empty or start date after end date' : ''}
            onChange={handleChange('endMonthYear')}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='description'
            label='Optional description'
            value={state.description}
            variant='outlined'
            fullWidth
            color='primary'
            onChange={handleChange('description')}
            multiline
            rows={8}
            rowsMax={8}
          />
        </Grid>
      </Grid>
    </form>
  );

  let fillInExperience = (
    <Box width='70%'>
      {title}
      <Grid container className={classes.formGridContainerRow}>
        <Grid item xs={1}>
          <IconButton color='primary' 
            onClick={() => setState({...state, section: 'chooseType'})}
          >
            <NavigateBeforeIcon fontSize='large' />
          </IconButton>
        </Grid>
        <Grid item xs={6}>
          <Box className={classes.formGridItemColumn}>
            <Box className={classes.subtitle}>
              <Typography variant='subtitle1'>
              {state.expType === 'eduExp' ? 'Educational Experience' : 'Work Experience'}
              </Typography>
            </Box>
            {state.expType === 'eduExp' ? eduExperience : workExperience}
          </Box>
        </Grid>
        <Grid item xs={1}>
          <IconButton color='primary'
            onClick={validateForm}
          >
            <NavigateNextIcon fontSize='large' />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );

  let chooseVerifier = (
    <Box width='70%'>
      {title}
      <Grid container className={classes.formGridContainerRow}>
        <Grid item xs={1}>
          <IconButton color='primary'
            onClick={() => setState({...state, section: 'experience'})}
          >
            <NavigateBeforeIcon fontSize='large' />
          </IconButton>
        </Grid>
        <Grid item xs={6}>
          <Box className={classes.formGridItemColumn}>
            <Box className={classes.subtitle}>
              <Typography variant='subtitle1'>
                {state.expType === 'eduExp' ? 'Educational Experience' : 'Work Experience'}
              </Typography>
            </Box>
            <Autocomplete
              id="verifier"
              options={!users ? users : users.filter(user => user.userAddress.toUpperCase() != address.toUpperCase())}
              onChange={(ev, value) => setState({...state, verifier: value})}
              getOptionLabel={(option) => option.fullName}
              fullWidth
              renderInput={(params) => <TextField {...params} label="Select a Verifier" variant="outlined" />}
            />
          </Box>
        </Grid>
        <Grid item xs={1}>
          <IconButton color='primary'
            onClick={handleSubmit}
          >
            <NavigateNextIcon fontSize='large' />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );

  let done = (
    <Box className={classes.addExpDone}>
      <Typography variant='h5' className={classes.customTypography}>Done!</Typography>
      <Typography variant='h5' className={classes.customTypography}>Please Wait for Verification</Typography>
      <IconButton color='primary'
        onClick={() => setState({...state, shouldLeave: !state.shouldLeave})}
      >
        <DoneIcon fontSize='large' />
      </IconButton>
    </Box>
  );

  const sectionMap = {
    'chooseType': experienceType,
    'experience': fillInExperience,
    'chooseVerifier': chooseVerifier,
    'done': done
  };

  // console.log(users);

  return (
    <Container maxWidth='lg' className={classes.content}>
      {sectionMap[state.section]}
      {state.shouldLeave ? <Redirect to={PageRoutes.MainPage} /> : null }
    </Container>
  );
}

export default CreateExperiencePage;