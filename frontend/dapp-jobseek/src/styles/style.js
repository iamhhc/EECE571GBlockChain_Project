import {makeStyles} from '@material-ui/core';

// Custome style added to material-ui

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(0, 5, 0, 5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(15, 0, 1, 0),
  },
  subtitle: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    padding: theme.spacing(1.5, 2, 1.5, 2),
    // margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconButton: {
    padding: theme.spacing(1),
    // margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textField: {
    padding: theme.spacing(2),
    // margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  linearProgress: {
    margin: theme.spacing(2),

  },
  formGridContainerRow: {
    direction: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  formGridItemColumn: {
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

export default useStyles;