import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, LinearProgress } from "@material-ui/core";

import { useAuth } from "../Auth";
import useStyles from '../styles/style';
import { useEthConnection } from '../EthConnection';
import { Header, UnverifiedExperienceDisplay, UserDataDisplay, VerifiedExperienceDisplay, VerifyingInvitationDisplay } from '../CustomComponents';

let MainPage = () => {

  let auth = useAuth();
  let classes = useStyles();
  let ethConnection = useEthConnection();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [verifiedExps, setVerifiedExps] = useState(null);
  const [unverifiedExps, setUnverifiedExps] = useState(null);
  const [verifyingInvitations, setVerifyingInvitations] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    auth.refreshed();
    ethConnection.fakeData();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let address = auth.user.userAddress;
    setIsLoading(true);
    setUserData(ethConnection.getUserByAddress(address)); 
    setVerifiedExps(ethConnection.getVerifiedExperiencesByAddress(address));
    setUnverifiedExps(ethConnection.getUnverifiedExperiencesByAddress(address));
    setVerifyingInvitations(ethConnection.getVerifiyingInvitationsByAddress(address));
    setIsLoading(false);
  }, [ethConnection.ethData]);

  let signOutClicked = () => {
    auth.signout(null);
    ethConnection.clearData();
    console.log('user signed out: ', auth.user);
  }

  console.log(userData, verifiedExps, unverifiedExps, verifyingInvitations);

  return(
    <Box className={classes.content}>
      <Header />
      {isLoading ? <LinearProgress className={classes.content}/>:  
        <Box className={classes.content}>
          <Grid container className={classes.mainPageContent}>
            {
              userData == null ? null :
              <Grid item xs={3}>
                <Box padding={2}>
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
            {
              verifyingInvitations == null ? null :
              <Grid item xs={3}> 
                <Box padding={2}>
                  <VerifyingInvitationDisplay value={verifyingInvitations} />
                </Box>
              </Grid>
            }
            
          </Grid>


          <Button onClick={signOutClicked}>Sign Out</Button>

        </Box>
      }
      
      
    </Box>
  );
}

export default MainPage;

