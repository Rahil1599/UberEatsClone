import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import bgImage from '../../images/Login/Uber-Eats-Register.jpeg'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import backendServer from '../../Config';
import NavigationBar from '../Navigation/NavigationBar';
import { store } from '../../state/store/store';
import { setUser } from '../../state/action-creators/loginActionCreator';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

const theme = createTheme();

const locations = [
  {
    value: 'United States',
    key: 'USA',
    cities: [{
      key: "SJC",
      value: "San Jose",
    },
    {
      key: "MPS",
      value: "Milpitas"
    },
    {
      key: "SVA",
      value: "Sunny Vale"
    }]
  },
  {
    value: 'India',
    key: 'IN',
    cities: [{
      key: "DEL",
      value: "Delhi"
    }, {
      key: "BLR",
      value: "Bangalore"
    }]
  }
];

export default function RestaurantRegistration() {
  const history = useHistory();
  const [country,setCountry] = useState('');
  const [cities,setCities] = useState([]);
  const onRegister = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const url = `${backendServer}/restaurant/register`;

    axios
      .post(url, {
        email: data.get('email'),
        password: data.get('password'),
        name: data.get('name'),
        country: data.get('country'),
        city: data.get('city')
      })
      .then((response) => {
        store.dispatch(setUser(response.data));
        sessionStorage.setItem('userId', response.data.RestaurantId);
        history.push("/restaurant/dashBoard")
      })
      .catch((err) => {

      });
  }

  const onCountryChange = (event)=>{
    setCountry(event.target.value);
    const records = locations.filter(loc => loc.value==event.target.value);
    setCities(records[0].cities||[]);
  }

  return (
    <>
      <NavigationBar type="signup" />
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: `url(${bgImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Restaurant Sign Up
              </Typography>
              <Box component="form" noValidate onSubmit={onRegister} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Restaurant Name"
                  name="name"
                  autoComplete="restaurant-name"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  type="email"
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
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  select
                  name="country"
                  label="Country"
                  type="text"
                  id="country"
                  value={country}
                  onChange={(event)=>{onCountryChange(event)}}
                  autoComplete="country"
                >
                  {locations.map((option) => (
                    <MenuItem key={option.key} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  select
                  name="city"
                  label="City"
                  type="text"
                  id="city"
                  defaultValue=""
                  autoComplete="city"
                >
                  {cities.map((option) => (
                    <MenuItem key={option.key} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}