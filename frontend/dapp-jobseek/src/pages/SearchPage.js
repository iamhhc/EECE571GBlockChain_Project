import { useState, useEffect } from 'react';
import { Box, IconButton, Button, Typography, TextField, Grid, Container } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Redirect } from 'react-router';

import useStyles from '../styles/style';
import PageRoutes from './PageRoutes';
import { useEthConnection } from '../EthConnection';
import { UserDataDisplay, VerifiedExperienceDisplay, UnverifiedExperienceDisplay } from './DashboardPage';

const SearchPage = () => {

  const classes = useStyles();
  let ethConnection = useEthConnection();

  let [state, setState] = useState({
    shouldLeave: false,
    searchTarget: null,
    section: 'searchBar',
  });

  const [users, setUsers] = useState(null);
  const [userData, setUserData] = useState(null);
  const [verifiedExps, setVerifiedExps] = useState(null);
  const [unverifiedExps, setUnverifiedExps] = useState(null);

  // useEffect(() => {
  //   ethConnection.fakeData();
  // }, []);

  useEffect(() => {
    setUsers(ethConnection.getAllUsers());
  }, [ethConnection.ethData]);

  let handleSearch = () => {
    console.log(state.searchTarget);
    if (state.searchTarget != null) {
      let address = state.searchTarget.userAddress;
      setUserData(ethConnection.getUserByAddress(address));
      setVerifiedExps(ethConnection.getVerifiedExperiencesByAddress(address));
      setUnverifiedExps(ethConnection.getUnverifiedExperiencesByAddress(address));
      // console.log(userData, verifiedExps, unverifiedExps);
      setState({...state, section: 'result'});
    }
  }

  let searchBox = (
    <Box width='70%'>
      <IconButton color='secondary' className={classes.searchExit}
        onClick={() => { setState({...state, shouldLeave: !state.shouldLeave});
          ethConnection.updateEthData();
        }}
      >
        <HighlightOffIcon fontSize='large' />
      </IconButton>
      <Box className={classes.searchTitle}>
        <Typography variant='h4'>
          Search for an Applicant or Company
        </Typography>
      </Box>
      <Grid container className={classes.searchBar}>
        <Grid item xs={9}>
          <Autocomplete
            id="search"
            options={users}
            onChange={(ev, value) => setState({...state, searchTarget: value})}
            getOptionLabel={(option) => option.fullName}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Name" variant="outlined" />}
          />
        </Grid>
        <Grid item xs={3}>
          <Button 
            className={classes.button} color='primary' variant='contained' size='large' fullWidth
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  let displayResult = (
    <Box className={classes.content}>
      <Grid container className={classes.mainPageContent}>
        {
          userData == null ? null :
          <Grid item xs={3}>
            <Box pt={4}>
              <UserDataDisplay value={userData} />
            </Box>
          </Grid>
        }       
        {
          verifiedExps == null ? null :
          <Grid item xs={3}>
            <Box padding={2}>
              <VerifiedExperienceDisplay value={verifiedExps} />
            </Box>
          </Grid>
        }
        {
          unverifiedExps == null ? null :
          <Grid item xs={3}> 
            <Box padding={2}>
              <UnverifiedExperienceDisplay value={unverifiedExps} />
            </Box>
          </Grid>
        }
      </Grid>
      <IconButton color='secondary'
        onClick={() => setState({...state, section: 'searchBar'})}
      >
        <HighlightOffIcon fontSize='large' />
      </IconButton>
    </Box>
  );

  return (
    <Container maxWidth='lg' className={classes.content}>
      {state.section === 'searchBar' ? searchBox : displayResult}
      {state.shouldLeave ? <Redirect to={PageRoutes.MainPage} /> : null }
    </Container>
  );
}

export default SearchPage;

