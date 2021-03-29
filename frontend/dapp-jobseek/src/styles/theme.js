import { createMuiTheme } from "@material-ui/core";

// customized theme for material-ui

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2699FB',
      contrastText: '#ffffff',
    },
    background: {
      default: '#efefef'
    }
  }, 
  typography: {
    h1: {
      color: '#2699FB'
    }, 
    h2: {
      color: '#2699FB'
    }, 
    h3: {
      color: '#2699FB'
    }, 
    subtitle1: {
      color: '#7f7f7f'
    },
    subtitle2: {
      color: '#7f7f7f'
    },
  }
});

export default theme;