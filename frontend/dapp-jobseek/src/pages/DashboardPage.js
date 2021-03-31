import React from 'react';
import { Box, Button, Grid, TextField, Typography } 
  from '@material-ui/core';
import { Link} from 'react-router-dom';

import { useAuth } from "../Auth";
import { useEthConnection } from '../EthConnection';
import { UserDataThumbnail, Record } from '../CustomComponents';
import pageRoutes from './PageRoutes';
import useStyles from '../styles/style';

export const UserDataDisplay = (props) => {
  const classes = useStyles();

  const { enableCreateExpButton } = props;
  const userData = props.value;

  


  return (
    <Box className={classes.content}>
      <UserDataThumbnail value={userData}/>
      
      <Box className={classes.verifyNumber} textAlign='center'>
        <Typography variant='subtitle2'>
          Verified By {userData.verifiedByNum} Accounts
        </Typography>
      </Box>
      <Box className={classes.verifyNumber} textAlign='center'>
        <Typography variant='subtitle2'>
          Has Verified {userData.hasVerifiedNum} Accounts
        </Typography>
      </Box>
      
      <Box className={classes.selfDescription}>
        <TextField 
          label='Self Description'
          rowsMax={10}
          rows={5}
          multiline
          value={userData.selfDescription}
          disabled
          variant='outlined'
          fullWidth
        />
      </Box>

      { enableCreateExpButton ? 
        <Box className={classes.button}>
          <Button
            variant='contained'
            color='primary'
            component={Link} to={pageRoutes.CreateExperiencePage}
            fullWidth
          > 
            Create a New Experience
          </Button> 
        </Box> : null }
      
    </Box>
  );
}

const VerifiedExperienceDisplay = (props) => {
  const classes = useStyles();
  const records = props.value;

  return (
    <Box className={classes.content}>
      <Box className={classes.experienceTitle1}>
        <Typography variant='subtitle2'>Verified Experience</Typography>
      </Box>
      <Grid container direction='column' justify='space-evenly' alignItems='flex-start'>
        {records.map((record) => (
          <Grid key={record.recordId} item>
            <Box className={classes.content}>
              <Record record={record} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

const UnverifiedExperienceDisplay = (props) => {
  const classes = useStyles();
  const records = props.value;

  return (
    <Box className={classes.content}>
      <Box className={classes.experienceTitle2}>
        <Typography variant='subtitle2'>Unverified Experience</Typography>
      </Box>
      <Grid container direction='column' justify='space-evenly' alignItems='flex-start'>
        {records.map((record) => (
          <Grid key={record.recordId} item>
            <Box className={classes.content}>
              <Record record={record} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

const VerifyingInvitationDisplay = (props) => {
  const classes = useStyles();
  const records = props.value;

  return (
    <Box className={classes.content}>
      <Box className={classes.experienceTitle3}>
        <Typography variant='subtitle2'>Verifying Invitations</Typography>
      </Box>

      <Grid container direction='column' justify='space-evenly' alignItems='flex-start'>
        {records.map((record) => (
          <Grid key={record.recordId} item>
            <Box className={classes.content}>
              <Button 
                component={Link} 
                to={{
                  pathname: pageRoutes.VerifyExperiencePage,
                  state: {
                    record
                  },
                }} 
                value={record}>
                <Record record={record}/>
              </Button>
              
            </Box>
          </Grid>
        ))}
      </Grid>
      
    </Box>
  );
}

let DashboardPage = (props) => {
  const classes = useStyles();

  let {userData, verifiedExps, unverifiedExps, verifyingInvitations} = props;

  return (
    <Box className={classes.content}>
      <Grid container className={classes.mainPageContent}>
        {
          userData == null ? null :
          <Grid item xs={3}>
            <Box padding={2}>
              <UserDataDisplay value={userData} enableCreateExpButton/>
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
        {
          verifyingInvitations == null ? null :
          <Grid item xs={3}> 
            <Box padding={2}>
              <VerifyingInvitationDisplay value={verifyingInvitations} />
            </Box>
          </Grid>
        }
        
      </Grid>
    </Box>
  );
}

export default DashboardPage;