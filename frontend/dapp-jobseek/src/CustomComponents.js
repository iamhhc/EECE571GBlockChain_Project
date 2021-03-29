import React from 'react';
import { Box, Typography} from '@material-ui/core';
import useStyles from './styles/style';

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