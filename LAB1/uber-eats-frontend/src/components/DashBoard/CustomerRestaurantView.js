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
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const theme = createTheme();

export default function CustomerRestaurantView() {
  const [cards, setCards] = useState([]);
  const [initialLoad, setInitialLoad] = useState([]);
  const [cart, setCart] = useState([]);
  const [tempCart, setTempCart] = useState([]);
  const history = useHistory();
  const [openCart, setOpenCart] = useState(false);
  const [multipleOrderDialog, setMultipleOrderDialog] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState("");
  const [newRestaurant, setNewRestaurant] = useState("");

  useEffect(async () => {
    const restaurantId = sessionStorage.getItem("currentRestaurant");
    if (!restaurantId) {
      history.push("/customer/dashboard");
    }
    const url = `${backendServer}/restaurant/${restaurantId}/dishes`;
    const response = await axios.get(url);
    //getGroups(response.data);
    setCards(response.data);
    setInitialLoad(response.data);
    //setselectGroups(array);
    let currentCart = JSON.parse(sessionStorage.getItem("currentCart")) || [];
    setCart(currentCart);
    console.log(cards);
    console.log("store is", store.getState());
  }, []);

  const persistCartOnSession = (cart) => {
    sessionStorage.setItem("currentCart", JSON.stringify(cart));
  };

  const onNewOrder = () => {
    setCart(tempCart);
    setCurrentRestaurant(newRestaurant);
    setNewRestaurant("");
    persistCartOnSession(tempCart);
    setMultipleOrderDialog(false);
  };

  const onAddToCart = (dish) => {
    if (cart.length != 0 && dish.RestaurantId != cart[0].RestaurantId) {
      setCurrentRestaurant(cart[0].RestaurantId);
      setNewRestaurant(dish.RestaurantId);
      setTempCart([{ ...dish, Quantity: 1 }]);
      setMultipleOrderDialog(true);
      return;
    }
    let newCart = [...cart, dish];
    let index = cart.findIndex((item) => item.DishId === dish.DishId);
    if (index == -1) {
      newCart = [...cart, { ...dish, Quantity: 1 }];
    } else {
      newCart = [...cart];
      newCart[index].Quantity++;
    }
    setCart(newCart);
    persistCartOnSession(newCart);
    console.log("cart", newCart);
  };

  const onRemoveFromCart = (dish) => {
    let newCart = [...cart];
    let index = newCart.findIndex((item) => item.DishId === dish.DishId);
    if (index == -1) return;
    newCart[index].Quantity > 1
      ? newCart[index].Quantity--
      : newCart.splice(index, 1);
    if (newCart.length == 0) setOpenCart(false);
    setCart(newCart);
    persistCartOnSession(newCart);
    console.log("cart", newCart);
  };

  const onSearch = (type, searchTerm) => {
    if (searchTerm == "") {
      setCards(initialLoad);
      return;
    } else {
      switch (type) {
        case "Dishes":
          let dfilter = initialLoad.filter(
            (card) =>
              card.DishName != null &&
              card.DishName.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setCards(dfilter);
          break;
        case "Dish Type":
          let tfilter = initialLoad.filter(
            (card) =>
              card.DishType != null &&
              card.DishType.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setCards(tfilter);
          break;
        case "Category":
          let cfilter = initialLoad.filter(
            (card) =>
              card.Category != null &&
              card.Category.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setCards(cfilter);
          break;
      }
    }
  };

  return (
    <>
      <NavigationBar
        type="customer"
        view="customerrestaurant"
        onSearch={onSearch}
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
                Make a choice
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                From wide variety of dishes served with love...
              </Typography>
            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
              {cards.map((card) => (
                <Grid item key={card.DishId} xs={12} sm={6} md={4}>
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
                        {card.DishName}
                      </Typography>
                      <Typography>{card.DishDesc}</Typography>
                      <Typography>${card.Price}</Typography>
                      <Typography>Category: {card.Category}</Typography>
                      <Typography>Type: {card.DishType}</Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        onClick={() => {
                          onAddToCart(card);
                        }}
                        aria-label="add to cart"
                      >
                        <AddShoppingCartIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          onRemoveFromCart(card);
                        }}
                        aria-label="remove from cart"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
        <div>
          <Dialog
            open={multipleOrderDialog}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Create new order?</DialogTitle>
            <DialogContent>
              <Typography variant="body2">
                Your cart contains orders from restaurant {currentRestaurant}.
                Create a new order to add items from restaurant {newRestaurant}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => onNewOrder()}
                variant="contained"
                color="primary"
              >
                New Order
              </Button>
              <Button
                onClick={() => setMultipleOrderDialog(false)}
                variant="contained"
                color="primary"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </ThemeProvider>
    </>
  );
}
