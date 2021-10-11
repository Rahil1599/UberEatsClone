import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
import { Link } from 'react-router-dom'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import bgimage from '../../images/Login/ubereatsphoto.jpeg';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import backendServer from '../../Config';
import NavigationBar from '../Navigation/NavigationBar';
import { store } from '../../state/store/store';
import { setUser } from '../../state/action-creators/loginActionCreator';

const theme = createTheme();

export default function Login() {
  const history = useHistory();
  const onLogin = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    let email = data.get('email');
    let password = data.get('password');
    let url = `${backendServer}/customer/login`
    axios
      .post(url, { email: email, password: password })
      .then((response) => {
        store.dispatch(setUser(response.data));
        sessionStorage.setItem('userId',response.data.CustomerId);
        sessionStorage.setItem('country',response.data.Country);
        sessionStorage.setItem('city',response.data.City);
        sessionStorage.setItem('currentCart', "[]");
        history.push('/customer/dashBoard')
      })
      .catch((error) => {
        alert("Invald username or password");
      });
  };

  return (
    <>
      <NavigationBar type="signup"/>
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid item
            xs={false}
            sm={10}
            md={25}
            sx={{
              backgroundImage: `url(${bgimage})`,
              backgroundRepeat: 'repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'auto',
              backgroundPosition: 'center',
            }}>
            <Box
              sx={{
                my: 4,
                mx: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'white',
              }}
        
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Customer Sign in
              </Typography>
              <Box component="form" noValidate onSubmit={onLogin} sx={{ mt: 1 }} >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="email"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs >
                    <Link to="/restaurant/register">
                      Do you own a Restaurant? Sign Up
                    </Link>
                  </Grid>
                  </Grid>
                  <Grid container>
                  <Grid item>
                    <Link to="/customer/register">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}