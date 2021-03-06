/* eslint-disable import/named */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-case-declarations */
/* eslint-disable max-len */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-shadow */
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {
  createTheme, ThemeProvider,
} from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDispatch, useSelector } from 'react-redux';
import backendServer from '../../Config';
// eslint-disable-next-line import/no-named-as-default-member
import NavigationBar from '../Navigation/NavigationBar';
import { store } from '../../state/store/store';
import { setRestaurant, setAllRestaurants } from '../../state/action-creators/restaurantActionCreator';
import setFavourites from '../../state/action-creators/loginActionCreator';

const theme = createTheme();

export default function CustomerDashBoard() {
  const [cards, setCards] = useState([]);
  const [initialLoad, setInitialLoad] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.login.user);
  const dishes = useSelector((state) => state.restaurant.dishes);

  useEffect(async () => {
    if (!customer.CustomerId) history.push('/');
    const url = `${backendServer}/restaurants`;
    const token = sessionStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common.Authorization = token;
    }
    const response = await axios.get(url);
    const restaurants = response.data;
    // if (country && country !== 'null') {
    //   restaurants = restaurants.filter((res) => res.Country.toLowerCase() === country.toLocaleLowerCase());
    // }
    // if (city && city !== 'null') {
    //   const cFilter = restaurants.filter((res) => res.City.toLowerCase() === city.toLocaleLowerCase());
    //   const noncityFilter = restaurants.filter((res) => res.City.toLowerCase() !== city.toLocaleLowerCase());
    //   restaurants = [...cFilter, ...noncityFilter];
    // }
    setInitialLoad(restaurants);
    setCards(restaurants);
    dispatch(setAllRestaurants(restaurants));
    console.log(cards);
    console.log('store is', store.getState());
  }, []);

  const onSearch = (type, searchTerm) => {
    if (searchTerm === '') {
      setCards(initialLoad);
    } else {
      switch (type) {
        case 'Restaurant':
          const rfilter = initialLoad.filter((card) => card.RestaurantName != null && card.RestaurantName.toLowerCase().includes(searchTerm.toLowerCase()));
          setCards(rfilter);
          break;
        case 'Location':
          const lfilter = initialLoad.filter((card) => card.City != null && card.City.toLowerCase().includes(searchTerm.toLowerCase()));
          setCards(lfilter);
          break;
        case 'Delivery Type':
          const tfilter = initialLoad.filter((card) => card.Mode != null && card.Mode.toLowerCase().includes(searchTerm.toLowerCase()));
          setCards(tfilter);
          break;
        case 'Dishes':
          const restaurants = dishes.filter((dish) => dish.DishName.toLowerCase().includes(searchTerm.toLowerCase())).map((dish) => dish.RestaurantId);
          const dfilter = initialLoad.filter((card) => restaurants.includes(card.RestaurantId));
          setCards(dfilter);
          break;
        default:
          break;
      }
    }
  };

  const onDeliveryChange = (event) => {
    if (event.target.checked) {
      const lfilter = cards.filter((card) => card.Mode != null && card.Mode.toLowerCase().includes('delivery'));
      setCards(lfilter);
    } else {
      setCards(initialLoad);
    }
  };

  const onView = (cart) => {
    dispatch(setRestaurant(cart));
    history.push('/customer/restaurant');
  };

  const onPersonlize = (restaurantId) => {
    const url = `${backendServer}/personalize/customer`;
    axios.post(url, { CustomerId: customer.CustomerId, RestaurantId: restaurantId })
      .then((response) => {
        // do nothing
        dispatch(setFavourites(response.data));
      })
      .catch(() => {
        // eslint-disable-next-line no-alert
        alert('error occured while adding to favourites');
      });
  };

  return (
    <>
      <NavigationBar type="customer" search onSearch={onSearch} view="customerdashboard" deliveryswitch onDeliveryChange={onDeliveryChange} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Hey!
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >

                <Button onClick={() => history.push('/customer/orders')} variant="outlined">View Orders</Button>
              </Stack>

            </Container>
          </Box>

          <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
              {cards.map((card) => (
                <Grid item key={card.RestaurantId} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(123,222,111,0.8)',
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        // 16:9
                        pt: '56.25%',
                      }}
                      image={card.ImageUrl}
                      alt="random"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.RestaurantName}
                      </Typography>
                      <Typography>
                        {card.RestaurantDesc}
                      </Typography>
                      <Typography>
                        Phone :
                        {' '}
                        {card.PhoneNumber}
                      </Typography>
                      <Typography>
                        Timings :
                        {' '}
                        {card.WorkHrsFrom}
                        {' '}
                        to
                        {' '}
                        {card.WorkHrsTo}
                      </Typography>
                      <Typography>
                        Location :
                        {' '}
                        {card.City}
                      </Typography>
                      <Typography>
                        Mode :
                        {' '}
                        {card.Mode}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton onClick={() => onView(card)} aria-label="view restaurant">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => onPersonlize(card.RestaurantId)} aria-label="add to favorites">
                        <FavoriteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
      </ThemeProvider>
    </>
  );
}
