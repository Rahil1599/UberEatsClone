import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { store } from "../../state/store/store";
import { useEffect } from "react";
import axios from "axios";
import backendServer from "../../Config";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import NavigationBar from "../Navigation/NavigationBar";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";

const theme = createTheme();

export default function CustomerDashBoard() {
  const [cards, setCards] = useState([]);
  const [initialLoad, setInitialLoad] = useState([]);
  const history = useHistory();

  useEffect(async () => {
    const country = sessionStorage.getItem("country");
    const city = sessionStorage.getItem("city");
    const url = `${backendServer}/restaurant`;
    const response = await axios.get(url, {
      params: { country: country, city: city },
    });
    setInitialLoad(response.data);
    setCards(response.data);
    console.log(cards);
    console.log("store is", store.getState());
  }, []);

  const onSearch = (searchTerm) => {
    if (searchTerm == "") {
      setCards(initialLoad);
      return;
    } else {
      let rfilter = initialLoad.filter(
        (card) =>
          card.RestaurantName != null &&
          card.RestaurantName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCards(rfilter);
    }
  };

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

  const onView = (cart) => {
    sessionStorage.setItem("currentRestaurant", cart.RestaurantId);
    sessionStorage.setItem("currentRestaurantDetails", JSON.stringify(cart));
    history.push("/customer/restaurant");
  };

  const onPersonlize = (restaurantId) => {
    let customerId = sessionStorage.getItem("userId");
    const url = `${backendServer}/personalize/customer`;
    axios
      .post(url, { customerId: customerId, restaurantId: restaurantId })
      .then((response) => {
        //do nothing
      })
      .catch((err) => {
        alert("error occured while adding to favourites");
      });
  };

  return (
    <>
      <NavigationBar
        type="customer"
        onSearch={onSearch}
        view="customerdashboard"
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: "background.paper",
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
                Welcome back!
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                You deserve the best food in the city
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Button variant="outlined">View Orders</Button>
              </Stack>
            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="md">
            {console.log(cards)}
            <Grid container spacing={4}>
              {cards.map((card) => (
                <Grid item key={card.RestaurantId} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        // 16:9
                        pt: "56.25%",
                      }}
                      image={card.ImageUrl}
                      alt="random"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.RestaurantName}
                      </Typography>
                      <Typography>{card.RestaurantDesc}</Typography>
                      <Typography>Phone : {card.PhoneNumber}</Typography>
                      <Typography>
                        Timings : {card.WorkHrsFrom} to {card.WorkHrsTo}
                      </Typography>
                      <Typography>Location : {card.City}</Typography>
                      <Typography>Mode : {card.Mode}</Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        onClick={() => onView(card)}
                        aria-label="view restaurant"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => onPersonlize(card.RestaurantId)}
                        aria-label="add to favorites"
                      >
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
