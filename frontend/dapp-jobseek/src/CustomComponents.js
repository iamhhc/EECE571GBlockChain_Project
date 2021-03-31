import React from 'react';
import { Box, IconButton, Button, Typography, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';

import SearchIcon from '@material-ui/icons/Search';
import PersonIcon from '@material-ui/icons/Person';

import useStyles from './styles/style';
import pageRoutes from './pages/PageRoutes';


export const Title = () => {
  let classes = useStyles();

  return (
    <Box>
      <Box className={classes.title}>
        <Typography variant='h1'>Distributed</Typography>
        <Typography variant='h1'>Job Seeking</Typography>
      </Box>
      <Box className={classes.subtitle}>
        <Typography variant='subtitle1'>EECE 571G Project</Typography>
      </Box>
    </Box>
  );
}

export const Header = (props) => {
  let classes = useStyles();

  return (
    <Box className={classes.header}>
      <Button 
        className={classes.button} 
        size='large' 
        color='primary'
        variant='contained'
        disableElevation
        component={Link}
        to={pageRoutes.MainPage}>
        Distributed Job Seeking
      </Button>
      <Box className={classes.formGridContainerRow}>
        <IconButton component={Link} to={pageRoutes.SearchPage}>
          <SearchIcon style={{color: '#fff'}}/>
        </IconButton>
        <IconButton component={Link} to={pageRoutes.SettingPage}>
          <PersonIcon style={{color: '#fff'}}/>
        </IconButton>
      </Box>
    </Box>
  );
}

export const UserDataThumbnail = (props) => {
  const classes = useStyles();
  const userData = props.value;

  return (
    <Box className={classes.content}>
      <Box textAlign='center'>
        <Typography variant='h4'>{userData.fullName}</Typography>
      </Box>
      <Box className={classes.subtitle} textAlign='center'>
        <Typography variant='body2'>{userData.email}</Typography>
      </Box>
      { userData.isLookingForJobs ? 
        <Box className={classes.subtitle}>
          <Box fontStyle='italic' textAlign='center'>
            <Typography variant='body2'>
              Actively looking for a job
            </Typography>
          </Box>
        </Box> : null
      }
    </Box>
  );
}

export const VerifyMetric = (props) => {
  const classes = useStyles();
  const userData = props.value;

  return (
    <Box className={classes.content}> 
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
    </Box>
  );
}

export const Record = ({record}) => {
  const {isEducation, education, experience} = record;

  return (
    <Box width='100%' borderColor='text.secondary' borderBottom={1} textAlign='left'>
      <Typography variant='subtitle1'>
            {isEducation ? education.orgName : experience.orgName}
      </Typography>
      <Box pl={1}>
        <Box fontStyle='italic'>
          <Typography variant='subtitle1'>
            {record.startMonthYear} - {record.endMonthYear}
          </Typography>
        </Box>
        {
          isEducation ?
          <Box width='100%' textAlign='left'> 
            <TextField 
              label='Degree'
              value={education.degreeName}
              disabled
              fullWidth
              InputProps={{disableUnderline: true}}
            />
            <TextField
              label='Field of Study'
              value={education.fieldOfStudy}
              disabled
              fullWidth
              InputProps={{disableUnderline: true}}
            />
            <TextField
              label='Description'
              value={education.description}
              disabled
              fullWidth
              rowsMax={5}
              rows={1}
              multiline
              InputProps={{disableUnderline: true}}
            />
          </Box>
          : <Box width='100%' textAlign='left'> 
            <TextField
              label='Position'
              value={experience.position}
              disabled
              fullWidth
              InputProps={{disableUnderline: true}}
            />
            <TextField
              label='Description'
              value={experience.description}
              disabled
              fullWidth
              multiline
              rowsMax={5}
              rows={1}
              InputProps={{disableUnderline: true}}
            />
          </Box>
        }
      </Box>
    </Box>
    
  )
}
