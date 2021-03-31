import { Box, Button, TextField } from "@material-ui/core";
import { useLocation } from "react-router-dom";

import { useAuth } from '../Auth';
import { UserDataThumbnail, VerifyMetric } from "../CustomComponents";
import { useEthConnection } from '../EthConnection';
import useStyles from "../styles/style";
import CreateExperiencePage from "./CreateExperiencePage";

let VerifyExperiencePage = () => {
  const { record } = useLocation().state;
  const auth = useAuth();
  const ethConnection = useEthConnection();
  const classes = useStyles();

  const recordOwnerData = ethConnection.getUserByAddress(record.recordOwner);

  console.log(record, auth.user, ethConnection.ethData);

  const {isEducation, experience, education, startMonthYear, endMonthYear} = record;

  // TODO: implement accepting experience
  const acceptButtonClicked = () => {

  }

  // TODO: implement declining experience
  const declineButtonClicked = () => {

  }

  return (
    <Box padding={5} className={classes.content}>
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
              value={education.fieldOfStudy}
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