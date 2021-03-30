import React, { useState } from 'react';
import { useAuth } from '../Auth';
import { Box, Container, Grid, IconButton, Select, LinearProgress, Typography, withStyles, TextField, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup, Autocomplete } from '@material-ui/lab';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import useStyles from '../styles/style';
import { Redirect } from 'react-router';
import PageRoutes from './PageRoutes';

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


let CreateExperiencePage = () => {

  const classes = useStyles();
  const auth = useAuth();

  const verifiers = [
    { name: 'Test 1', address: '' },
    { name: 'Test 2', address: '' },
  ];
  
  let [state, setState] = useState({
    expType: 'eduExp',
    section: 'chooseType',
    shouldLeave: false,
  });

  let changeExpType = (ev, value) => {
    setState({...state, expType: value});
  }

  let title = (
    <Box className={classes.expTitle}>
      <Typography variant='h2'>Add a New Experience</Typography>
    </Box>
  );

  let experienceType = (
    <Box width='70%'>
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
            label='Institution Name'
            variant='outlined'
            fullWidth
            color='primary'
            required
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='student-id'
            label='Student ID'
            variant="outlined"
            fullWidth
            color='primary'
            required
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='degree'
            label='Degree Name'
            variant="outlined"
            fullWidth
            color='primary'
            required
          />
        </Grid>
        <Grid item sm={12} md={6} className={classes.textField}>
          <TextField
            id="edu-start-date"
            label="Start Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item sm={12} md={6} className={classes.textField}>
          <TextField
            id="edu-end-date"
            label="End Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='description'
            label='Optional description'
            variant="outlined"
            fullWidth
            color='primary'
            multiline
            rows={8}
            rowsMax={8}
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
            variant='outlined'
            fullWidth
            color='primary'
            required
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='employer-id'
            label='Employer ID'
            variant="outlined"
            fullWidth
            color='primary'
            required
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='position'
            label='Position'
            variant="outlined"
            fullWidth
            color='primary'
            required
          />
        </Grid>
        <Grid item sm={12} md={6} className={classes.textField}>
          <TextField
            id="work-start-date"
            label="Start Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item sm={12} md={6} className={classes.textField}>
          <TextField
            id="work-end-date"
            label="End Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id='description'
            label='Optional description'
            variant="outlined"
            fullWidth
            color='primary'
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
            onClick={() => setState({...state, section: 'chooseVerifier'})}
          >
            <NavigateNextIcon fontSize='large' />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );

  let chooseVerifier = (
    <Box width='70%'>
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
            {/* <FormControl fullWidth>
              <InputLabel id='verifier-label'>Select a Verifier</InputLabel>
              <Select labelId='verifier-label'>
                <MenuItem  value='' />
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl> */}
            <Autocomplete
              id="verifier"
              options={verifiers}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => <TextField {...params} label="Select a Verifier" variant="outlined" />}
            />
          </Box>
        </Grid>
        <Grid item xs={1}>
          <IconButton color='primary'
            onClick={() => setState({...state, section: 'done'})}
          >
            <NavigateNextIcon fontSize='large' />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );

  let done = (
    <Box>
      <h1>Done!</h1>
    </Box>
  );

  const sectionMap = {
    'chooseType': experienceType,
    'experience': fillInExperience,
    'chooseVerifier': chooseVerifier,
    'done': done
  };

  return (
    <Container maxWidth='lg' className={classes.content}>
      {title}
      {sectionMap[state.section]}
      {state.shouldLeave ? <Redirect to={PageRoutes.MainPage} /> : null }
    </Container>
  );
}

export default CreateExperiencePage;