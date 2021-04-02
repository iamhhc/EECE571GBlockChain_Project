import { Box, Button, TextField } from "@material-ui/core";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from '../Auth';
import { UserDataThumbnail, VerifyMetric } from "../CustomComponents";
import { useEthConnection } from '../EthConnection';
import useStyles from "../styles/style";
import CreateExperiencePage from "./CreateExperiencePage";
import { Redirect } from 'react-router';
import PageRoutes from './PageRoutes';

let VerifyExperiencePage = () => {
  const { record } = useLocation().state;
  const auth = useAuth();
  const ethConnection = useEthConnection();
  const classes = useStyles();

  const recordOwnerData = ethConnection.getUserByAddress(record.recordOwner);
  const [ethCV, setEthCV] = useState(null);
  const [shouldLeave, setShouldLeave] = useState(false);
  
  useEffect(() => {
    setEthCV(ethConnection.ethCV);
  }, [ethConnection.ethCV]);

  console.log(record, auth.user, ethConnection.ethData);

  const {isEducation, experience, education, startMonthYear, endMonthYear} = record;

  // TODO: implement accepting experience
  const acceptButtonClicked = async () => {
    if (!ethCV) {
      console.error('Contract not deployed, cannot approve');
      return;
    }
    try {
      await ethCV.methods.verifyRecord(record.recordId, true).send({from: auth.user.userAddress});
      ethConnection.updateEthData();
      setShouldLeave(true);
    } catch(err) {
      window.alert(err.message);
    }
  }

  // TODO: implement declining experience
  const declineButtonClicked = async () => {
    if (!ethCV) {
      console.error('Contract not deployed, cannot approve');
      return;
    }
    try {
      await ethCV.methods.verifyRecord(record.recordId, false).send({from: auth.user.userAddress});
      ethConnection.updateEthData();
      setShouldLeave(true);
    } catch(err) {
      window.alert(err.message);
    }
  }

  return (
    <Box padding={5} className={classes.content}>
      {shouldLeave ? <Redirect to={PageRoutes.MainPage} /> : null }
      <Box padding={2} width='50%' className={classes.formGridContainerRow}>
        <UserDataThumbnail value={recordOwnerData} />
        <VerifyMetric value={recordOwnerData} />
      </Box>
      <Box pt={2} width='50%' className={classes.formGridContainerRow}>
        <Box className={classes.textField}>
          <TextField 
            label={isEducation ? 'Institution Name' : 'Company Name'}
            value={isEducation ? education.orgName : experience.orgName}
            disabled
            fullWidth
            variant='outlined'
          />
        </Box>
        <Box className={classes.textField}>
          <TextField 
            label={isEducation ? 'Student ID' : 'Employee ID'}
            value={isEducation ? education.uId : experience.uId}
            disabled
            fullWidth
            variant='outlined'
          />
        </Box>
      </Box>
      <Box pt={2} width='50%' className={classes.formGridContainerRow}>
        <Box className={classes.textField}>
          <TextField 
            label={isEducation ? 'Degree Name' : 'Position'}
            value={isEducation ? education.degreeName : experience.position}
            disabled
            fullWidth
            variant='outlined'
          />
        </Box>
        {
          isEducation ? 
          <Box className={classes.textField}>
            <TextField 
              label='Field of Study'
              value={education.fieldsOfStudy}
              disabled
              fullWidth
              variant='outlined'
            />
          </Box> : null
        }
        <Box className={classes.textField}>
          <TextField 
            label='Period'
            value={startMonthYear + ' - ' + endMonthYear}
            disabled
            fullWidth
            variant='outlined'
          />
        </Box>
      </Box>
      <Box pt={2} width='50%' className={classes.formGridContainerRow}>
        <Box className={classes.textField}>
          <TextField 
            label='Description'
            value={isEducation ? education.description : experience.description}
            disabled
            fullWidth
            multiline
            rowsMax={10}
            rows={5}
            variant='outlined'
          />
        </Box>
      </Box>
      <Box pt={2} width='50%' className={classes.formGridContainerRow}>
        <Box width='50%' className={classes.button}>
          <Button
            size='large'
            color='primary'
            fullWidth
            variant='contained'
            onClick={acceptButtonClicked}
          >
            Verify This Experience
          </Button>
        </Box>
        <Box width='50%' className={classes.button}>
          <Button
            size='large'
            color='secondary'
            fullWidth
            variant='contained'
            onClick={declineButtonClicked}
          >
            Disapprove This Experience
          </Button>
        </Box>
      </Box>

    </Box>
  );
}

export default VerifyExperiencePage;