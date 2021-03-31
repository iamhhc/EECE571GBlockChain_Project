
import { Box, Button, Typography, Switch } from '@material-ui/core';
import useStyles from '../styles/style';
import { UserDataDisplay } from './DashboardPage';
import { useAuth } from '../Auth';
import { useEthConnection } from '../EthConnection';


let SettingPage = (props) => {
  const classes = useStyles();
  const auth = useAuth();
  const ethConnection = useEthConnection();

  let {userData} = props;

  let signOutClicked = () => {
    auth.signout(null);
    ethConnection.clearData();
    console.log('user signed out: ', auth.user);
  }

  return (
    <Box padding={5} width='30%' alignItems='center' justifyContent='center'>
      <UserDataDisplay value={userData} enableLogOutButton/>

      <Box className={classes.formGridContainerRow}>
            <Typography variant='body1' color='primary'>
              Are you actively looking for a job?
            </Typography>
            <Switch 
              checked={userData.isLookingForJobs}
              // onChange={}
              color='primary'
            />
      </Box>

      <Box className={classes.button}>
        <Button
          variant='contained'
          color='secondary'
          onClick={signOutClicked}
        >
          Log Out
        </Button> 
      </Box>
    </Box>
  );
}


export default SettingPage;

