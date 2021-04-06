
import { Box, Button, Typography, Switch, TextField } from '@material-ui/core';
import useStyles from '../styles/style';
import { useAuth } from '../Auth';
import { useEthConnection } from '../EthConnection';
import { useEffect, useState } from 'react';

import { UserDataThumbnail, VerifyMetric } from '../CustomComponents';


let SettingPage = (props) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState('');
  const [ethCV, setEthCV] = useState();

  const classes = useStyles();
  const auth = useAuth();
  const ethConnection = useEthConnection();

  const userAddress = auth.user.userAddress;

  let {userData} = props;
 
  useEffect(() => {
    setDescription(userData.selfDescription);
  }, []);

  useEffect(() => {
    setEthCV(ethConnection.ethCV);
  }, [ethConnection.ethCV]);

  let signOutClicked = () => {
    auth.signout();
    ethConnection.clearData();
    console.log('user signed out: ', auth.user);
  }

  let handleChangeDescription = (event) => {
    setIsEditingDescription(true);
    setDescription(event.target.value);
  }

  let handleCancelChangeDescription = () => {
    setIsEditingDescription(false);
    setDescription(userData.selfDescription);
  }

  let handleSubmitDescription = async () => {
    await ethCV.methods.changeDescription(userAddress, description)
    .send({from: userAddress});
    setIsEditingDescription(false);
    await ethConnection.updateEthData();
  }

  let handleSubmitJobStatus = async () => {
    await ethCV.methods.changeJobStatus(userAddress)
    .send({from: userAddress});
    await ethConnection.updateEthData();
  }

  return (
    <Box padding={5} width='30%' alignItems='center' justifyContent='center'>
      <Box className={classes.content}>
        <UserDataThumbnail value={userData} />
        
        <VerifyMetric value={userData} />
        
        <Box className={classes.selfDescription}>
          <TextField 
            label='Self Description'
            rowsMax={10}
            rows={5}
            multiline
            value={description}
            variant='outlined'
            fullWidth
            onChange={handleChangeDescription}
          />
        </Box>
        {
          isEditingDescription ? 
          <Box className={classes.formGridContainerRow}>
            <Box margin={1}>
              <Button
                onClick={handleCancelChangeDescription}
                variant='contained'
                color='secondary'
              >
                Cancel
              </Button> 
            </Box>
            <Box margin={1}>
              <Button
                onClick={handleSubmitDescription}
                variant='contained'
                color='primary'
              >
                Save
              </Button>
            </Box>
          </Box>: null
        }
      </Box>

      <Box className={classes.formGridContainerRow}>
            <Typography variant='body1' color='primary'>
              Are you actively looking for a job?
            </Typography>
            <Switch 
              checked={userData.isLookingForJobs}
              onChange={handleSubmitJobStatus}
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

