import React, { useEffect, useState } from 'react';
import { Box, Button, LinearProgress } 
  from '@material-ui/core';
import { Route, Switch as RouterSwitch} from 'react-router-dom';

import { useAuth } from "../Auth";
import { useEthConnection } from '../EthConnection';
import { Header } from '../CustomComponents';
import pageRoutes from './PageRoutes';
import useStyles from '../styles/style';
import SearchPage from './SearchPage';
import SettingPage from './SettingPage';
import DashboardPage from './DashboardPage';
import VerifyExperiencePage from './VerifyExperiencePage';
import CreateExperiencePage from './CreateExperiencePage';

let MainPage = () => {

  let auth = useAuth();
  let classes = useStyles();
  let ethConnection = useEthConnection();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [verifiedExps, setVerifiedExps] = useState(null);
  const [unverifiedExps, setUnverifiedExps] = useState(null);
  const [verifyingInvitations, setVerifyingInvitations] = useState(null);
  const [ethData, setEthData] = useState(null);

  useEffect(() => {
    let address = auth.user.userAddress;
    setIsLoading(true);
    setUserData(ethConnection.getUserByAddress(address)); 
    setVerifiedExps(ethConnection.getVerifiedExperiencesByAddress(address));
    setUnverifiedExps(ethConnection.getUnverifiedExperiencesByAddress(address));
    setVerifyingInvitations(ethConnection.getVerifiyingInvitationsByAddress(address));
    setEthData(ethConnection.ethData);
    setIsLoading(false);
  }, []);

  console.log(userData, verifiedExps, unverifiedExps, verifyingInvitations, ethData);

  return(
    <Box className={classes.content}>
      <Header />
      { isLoading ? 
        <LinearProgress className={classes.content}/>
      : <Box className={classes.content}>
          
          <RouterSwitch>
          
            <Route path={pageRoutes.SearchPage}>
              <SearchPage userData={userData}/>
            </Route>

            <Route path={pageRoutes.SettingPage}>
              <SettingPage userData={userData}/>
            </Route>

            <Route path={pageRoutes.VerifyExperiencePage}>
              <VerifyExperiencePage />
            </Route>

            <Route path={pageRoutes.CreateExperiencePage}>
              <CreateExperiencePage userData={userData}/>
            </Route>

            <Route path={pageRoutes.MainPage}>
              <DashboardPage 
                userData={userData} 
                verifiedExps={verifiedExps}
                unverifiedExps={unverifiedExps}
                verifyingInvitations={verifyingInvitations}
              />
            </Route>

          </RouterSwitch>

        </Box>
      }
      
      
    </Box>
  );
}

export default MainPage;

