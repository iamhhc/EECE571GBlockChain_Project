import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { useAuth } from './Auth'; 
import theme from './styles/theme';

// Import pages
import MainPage from './pages/MainPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';

// page routes
import pageRoutes from './pages/PageRoutes';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

let App =  () => {

  let auth = useAuth();
  let signedIn = auth.user != null;

  return (
    <ThemeProvider theme={theme}>
        <Router>
          <div>
            {/* Switch of entry pages */}
            <Switch>
              <Route exact path='/'>
                <Redirect to={pageRoutes.SignInPage} />
              </Route>

              <Route path={pageRoutes.SignInPage}>
                {signedIn ? <Redirect to={pageRoutes.MainPage} /> : <SignInPage /> }
              </Route>

              <Route path={pageRoutes.SignUpPage}>
                {signedIn ? <Redirect to={pageRoutes.MainPage} /> : <SignUpPage /> }
              </Route>

              <Route path={pageRoutes.MainPage}>
                {signedIn ? <MainPage /> : <Redirect to={pageRoutes.SignInPage} /> }
              </Route>

              <Route path={pageRoutes.NotFoundPage}>
                <NotFoundPage />
              </Route>

              <Route path='*'>
                <Redirect to={pageRoutes.NotFoundPage} />
              </Route>

            </Switch>
          </div>
        </Router>
    </ThemeProvider>
  );
}

export default App;
