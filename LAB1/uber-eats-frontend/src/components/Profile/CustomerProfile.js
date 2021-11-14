import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Input } from '@mui/material';
import axios from 'axios';
import backendServer from '../../Config';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import dishlogo from '../../images/dishlogo.png'
import { useHistory } from 'react-router-dom';
import NavigationBar from '../Navigation/NavigationBar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { store } from '../../state/store/store';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';



const theme = createTheme();

export default function CustomerProfile() {

    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState(`${dishlogo}`);
    const [name, setName] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [nickname, setNickName] = useState('');
    const [dob, setDOB] = useState('');
    const [phone, setPhone] = useState('');
    const [pincode, setPincode] = useState('');
    const [customerId, setCustomerId] = useState('');

    const history = useHistory();
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event.currentTarget);
        const data = new FormData(event.currentTarget);

        if (image) {
            let imageData = new FormData()
            imageData.append('image', image)
            let response = await axios.post(`${backendServer}/image/customer`, imageData);
            setImageUrl(response.data.imageUrl);
        }

        let payload = {
            customerId: customerId,
            name: data.get('name'),
            email: data.get('email'),
            country: data.get('country'),
            state: data.get('state'),
            pincode: data.get('pincode'),
            phone: data.get('phone'),
            city: data.get('city'),
            nickname: data.get('nickname'),
            dob: data.get('dob'),
            imageUrl: imageUrl
        }

        axios.post(`${backendServer}/customer/${customerId}`, payload)
            .then(response => {
                history.push("/customer/dashBoard")
            })
            .catch(err => {
                console.log("Error");
            });

    };
    useEffect(async () => {
        const customerId = sessionStorage.getItem('userId');
        setCustomerId(customerId);
        const response = await axios.get(`${backendServer}/customer/${customerId}`);
        const customer = response.data;
        setName(customer.CustomerName);
        setPhone(customer.PhoneNumber);
        setPincode(customer.Pincode);
        setDOB(customer.DateOfBirth);
        setNickName(customer.NickName);
        setCity(customer.City);
        setCountry(customer.Country);
        setState(customer.State);
        setImageUrl(customer.ImageUrl);
    }, [])

    const onPhotoChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setImageUrl(URL.createObjectURL(file));
    }

    const fileStyle = {
        display: 'none'
    }

    const imageStyle = {
        "margin-left": '45%'
    }

    return (
        <>
            <NavigationBar type="customer" />
            <ThemeProvider theme={theme}>
                <main>
                    {/* Hero unit */}
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            pt: 1,
                            pb: 1,
                        }}
                    >
                        <Container maxWidth="xs">
                            <Typography
                                component="h1"
                                variant="h4"
                                align="center"
                                color="text.primary"
                                gutterBottom
                            >
                                Your Profile!
                            </Typography>
                            <Typography variant="h6" align="center" color="text.secondary" paragraph>
                                Tell us more about yourself...
                            </Typography>
                        </Container>
                    </Box>
                    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                        <CssBaseline />
                        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                <Grid container spacing={2} >
                                    <Grid style={imageStyle} item xs={12} sm={6} alignItems="center">
                                        <Avatar
                                            src={imageUrl}
                                            sx={{ width: 50, height: 50 }}
                                        />
                                        <label htmlFor="image">
                                            <Input accept="image/*" style={fileStyle} id="image" name="image" required autoFocus type="file" onChange={onPhotoChange} />
                                            <IconButton color="primary" aria-label="upload picture" component="span">
                                                <PhotoCamera />
                                            </IconButton>
                                        </label>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            margin="none"
                                            required
                                            fullWidth
                                            type="text"
                                            id="name"
                                            label="Name"
                                            name="name"
                                            onChange={(e) => setName(e.target.value)}
                                            autoComplete="name"
                                            value={name}
                                            autoFocus
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            margin="none"
                                            required
                                            fullWidth
                                            type="text"
                                            id="nickname"
                                            label="Nick Name"
                                            name="nickname"
                                            onChange={(e) => setNickName(e.target.value)}
                                            autoComplete="nick name"
                                            value={nickname}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            margin="none"
                                            required
                                            fullWidth
                                            id="dob"
                                            type="text"
                                            value={dob && dob.split('T')[0]}
                                            label="Date of Birth"
                                            name="dob"
                                            onChange={(e) => setDOB(e.target.value)}
                                            autoComplete="dob"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            margin="none"
                                            required
                                            fullWidth
                                            type="text"
                                            id="country"
                                            label="Country"
                                            name="country"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            autoComplete="country"
                                        />
                                    </Grid>


                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            margin="none"
                                            required
                                            fullWidth
                                            type="text"
                                            id="state"
                                            label="State"
                                            value={state}
                                            name="state"
                                            onChange={(e) => setState(e.target.value)}
                                            autoComplete="state"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            margin="none"
                                            required
                                            fullWidth
                                            type="text"
                                            id="city"
                                            label="City"
                                            name="city"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            autoComplete="city"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            margin="none"
                                            required
                                            fullWidth
                                            type="text"
                                            id="phone"
                                            label="Phone Number"
                                            name="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            autoComplete="phone"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            margin="none"
                                            required
                                            fullWidth
                                            type="text"
                                            id="pin"
                                            label="Pin Code"
                                            name="pincode"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            autoComplete="pincode"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                        >
                                            Update Profile
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Container>
                </main>
            </ThemeProvider>
        </>
    );
}