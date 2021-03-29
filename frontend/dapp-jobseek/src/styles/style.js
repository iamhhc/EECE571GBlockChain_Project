import {makeStyles} from '@material-ui/core';

// Custome style added to material-ui

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(0, 10, 0, 10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(20, 0, 1, 0),
  },
  subtitle: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    padding: theme.spacing(2, 1, 2, 1),
    // margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textField: {
    padding: theme.spacing(1),
    // margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

export default useStyles;