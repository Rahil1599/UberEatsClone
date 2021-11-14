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
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import dishlogo from '../../images/dishlogo.png'
import { useHistory } from 'react-router-dom';
import NavigationBar from '../Navigation/NavigationBar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { store } from '../../state/store/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'


const theme = createTheme();

export default function AddDish() {
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState(`${dishlogo}`);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState('');
    const [disabled, setDisbled] = useState(true);


    const history = useHistory();
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event.currentTarget);
        const data = new FormData(event.currentTarget);
        let url;
        if (image) {
            let imageData = new FormData()
            imageData.append('image', image)
            let response = await axios.post(`${backendServer}/image/dish`, imageData);
            url = response.data.imageUrl;
            setImageUrl(url);
        }

        const restaurantId = sessionStorage.getItem('userId');
        const dishId = sessionStorage.getItem('dishId');
        let payload = {
            dishId: dishId,
            restaurantId: restaurantId,
            dishdesc: data.get('desc'),
            category: data.get('category'),
            price: data.get('price'),
            name: data.get('name'),
            type: data.get('type'),
            imageUrl: url
        }

        axios.post(`${backendServer}/restaurant/dishes`, payload)
            .then(response => {
                history.push("/restaurant/dashBoard")
            })
            .catch(err => {
                console.log("Error");
            });

    };

    useEffect(async () => {
        const dishId = sessionStorage.getItem('dishId');
        console.log(disabled);

        const action = sessionStorage.getItem("action");
        if (action == 'view') {
            setDisbled(true);
        } else {
            setDisbled(false);
        }

        if (dishId) {
            const response = await axios.get(`${backendServer}/dishes/${dishId}`);
            const dish = response.data;
            const url = dish.ImageUrl!=''?dish.imageUrl:dishlogo;
            setName(dish.DishName);
            setDesc(dish.DishDesc);
            setCategory(dish.Category);
            setType(dish.DishType);
            setPrice(dish.Price);
            setImageUrl(url);
        }
    }, [])

    const onPhotoChange = (event) => {
        if (event.target.files.length === 0)
            return;
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
            <NavigationBar type="restaurant" />

            <ThemeProvider theme={theme}>
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
                                        id="name"
                                        label="Name of the Dish"
                                        name="name"
                                        autoComplete="name"
                                        value={name}
                                        disabled={disabled}
                                        onChange={(e) => setName(e.target.value)}
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="none"
                                        required
                                        fullWidth
                                        id="desc"
                                        label="Description of the Dish"
                                        name="desc"
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        autoComplete="desc"
                                        disabled={disabled}
                                        autoFocus
                                        multiline
                                        minRows="2"
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="none"
                                        required
                                        fullWidth
                                        id="type"
                                        label="Type of the Dish"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        name="type"
                                        disabled={disabled}
                                        autoComplete="type"
                                        autoFocus
                                    />

                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        margin="none"
                                        required
                                        fullWidth
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        type="text"
                                        id="category"
                                        label="Category"
                                        name="category"
                                        disabled={disabled}
                                        autoComplete="category"
                                        autoFocus
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        margin="none"
                                        required
                                        fullWidth
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        type="number"
                                        id="price"
                                        label="Price"
                                        name="price"
                                        disabled={disabled}
                                        autoComplete="price"
                                        autoFocus
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={disabled}
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Save
                                    </Button>
                                </Grid>

                            </Grid>
                        </Box>
                    </Paper>
                </Container>
            </ThemeProvider>
        </>
    );
}