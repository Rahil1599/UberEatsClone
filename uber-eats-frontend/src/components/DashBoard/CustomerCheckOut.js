import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './AddressForm';
import Review from './Review';
import { useEffect } from 'react';
import NavigationBar from '../Navigation/NavigationBar';
import { useState } from 'react';
import axios from 'axios';
import backendServer from '../../Config';

const steps = ['Review your order', 'Delivery address', 'Place Order'];

const theme = createTheme();

export default function CustomerCheckOut() {
    const [cart, setCart] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [addr1, setAddr1] = useState('');
    const [addr2, setAddr2] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [addressName, setAddressName] = useState('');
    const [checked, setChecked] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [postedOrder, setPostedOrder] = useState([]);

    const isPlaceOrder = () => {
        return activeStep + 1 == steps.length;
    }

    const isAddressfilled = () => {
        return activeStep + 1 == 2 && (selectedAddress == "None" || selectedAddress == "");
    }

    const cleanUpTransaction = () => {
        setCart([]);
        sessionStorage.removeItem('currentCart');
        sessionStorage.removeItem('checkoutCart');
        sessionStorage.removeItem('deliveryAddress');
        sessionStorage.removeItem('mode');
    }
    
    const postOrder = (customerId, addressId) => {
        const mode = sessionStorage.getItem('mode');
        axios.post(`${backendServer}/orders/customer/${customerId}`, { mode, addressId: addressId, cart: cart })
            .then(response => {
                setPostedOrder(response.data);
                cleanUpTransaction();
            })
            .catch(error => {
                alert("error occured while saving the address");
            })
    }

    const handleNext = () => {
        setActiveStep(activeStep + 1);
        if (isAddressfilled()) {
            let address = {
                "addressLine1": addr1,
                "addressLine2": addr2,
                "city": city,
                "state": state,
                "country": country,
                "pincode": pincode,
                "addressName": addressName,
                "save": checked,
                "addressSelect": selectedAddress
            }
            sessionStorage.setItem('deliveryAddress', JSON.stringify(address));
        }
        if (isPlaceOrder()) {
            let customerId = sessionStorage.getItem('userId');
            let payload = {
                "addressLine1": addr1,
                "addressLine2": addr2,
                "city": city,
                "country": country,
                "pincode": pincode,
                "addressName": addressName,
                "save": checked
            }
            console.log(cart);
            if(!selectedAddress || selectedAddress == 'None' ){
              axios.post(`${backendServer}/deliveryAddress/customer/${customerId}`, payload)
              .then(response => {
                postOrder(customerId, response.data.addressId);
              })
              .catch(error => {
                alert("error occured while saving the address");
              })
            } else {
              postOrder(customerId, selectedAddress.AddressId);
              
            }
            console.log(payload)
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    useEffect(() => {
        let currentCart = JSON.parse(sessionStorage.getItem('checkoutCart')) || [];
        setCart(currentCart);

    }, []);

    const onAddressChange = (event) => {
        switch (event.target.id) {
            case 'address1':
                setAddr1(event.target.value);
                break;
            case 'address2':
                setAddr2(event.target.value);
                break;
            case 'country':
                setCountry(event.target.value);
                break;
            case 'city':
                setCity(event.target.value);
                break;
            case 'state':
                setState(event.target.value);
                break;
            case 'zip':
                setPincode(event.target.value);
                break;
            case 'saveAddress':
                setChecked(event.target.value);
                break;
            case 'addressName':
                setAddressName(event.target.value);
                break;
            case 'checked':
                setChecked(event.target.value);
                break;
        }
        if (event.target.name == 'addressSelect') {
            setSelectedAddress(event.target.value);
        }
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <Review deliveryAddress={false} />;
            case 1:
                return <AddressForm onAddressChange={onAddressChange} />;
            case 2:
                return <Review deliveryAddress={true} />;
            default:
                throw new Error('Unknown step');
        }
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <NavigationBar type="customer" />
                <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Typography component="h1" variant="h4" align="center">
                            Checkout
                        </Typography>
                        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <React.Fragment>
                            {activeStep === steps.length ? (
                                <React.Fragment>
                                    <Typography variant="h5" gutterBottom>
                                        Thank you for your order.
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        Your order id is placed. You can check the status of your order in your orders page.
                                    </Typography>
                                    <Button variant="outlined">Check Status</Button>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {getStepContent(activeStep)}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {activeStep !== 0 && (
                                            <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                                Back
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{ mt: 3, ml: 1 }}
                                        >
                                            {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                                        </Button>
                                    </Box>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    </Paper>
                </Container>
            </ThemeProvider>
        </>
    );
}
