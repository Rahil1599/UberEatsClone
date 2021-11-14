import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import logo from "../../images/uberRats.svg";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Home, Favorite, ShoppingCart } from "@material-ui/icons";
import RestaurantMenu from "@material-ui/icons/RestaurantMenu";
import RecentActors from "@material-ui/icons/RecentActors";
import { Group } from "@material-ui/icons";
import { AccountCircle } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

import Box from "@mui/material/Box";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import { Badge } from "@mui/material";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useEffect, useState } from "react";
import { store } from "../../state/store/store";
import doLogoutUser from "../../state/action-creators/loginActionCreator";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import backendServer from "../../Config";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

const style = {
  background: "#bdbdbd",
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

const searchDashBoard = [
  {
    key: "restaurant",
    value: "Restaurant",
  },
];

const searchRestaurant = [
  {
    key: "dish",
    value: "Dishes",
  },
  {
    key: "type",
    value: "Dish Type",
  },
  {
    key: "category",
    value: "Category",
  },
];

export default function NavigationBar(props) {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    left: false,
  });

  const [cart, setCart] = useState([]);
  const [tempCart, setTempCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [multipleOrderDialog, setMultipleOrderDialog] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState("");
  const [newRestaurant, setNewRestaurant] = useState("");
  const [searchString, setSearchString] = useState("");
  const [searchBy, setSearchBy] = useState("Restaurant");
  const [orderOption, setOrderOption] = useState("delivery");
  const [restaurantMode, setRestaurantMode] = useState("");
  const [deliveryModes, setDeliveryModes] = useState([]);

  useEffect(async () => {
    let currentCart = JSON.parse(sessionStorage.getItem("currentCart")) || [];
    setCart(currentCart);
    if (props.view === "customerrestaurant") setSearchBy("Dishes");
  }, []);

  useEffect(() => {
    const cart = JSON.parse(sessionStorage.getItem("currentCart"));
    const restaurantId = cart && cart.length && cart[0].RestaurantId;
    axios.get(`${backendServer}/restaurant/mode/${restaurantId}`).then(({ data }) => {
      console.log("data", data);
      if (data.deliver && data.pickup) {
        setDeliveryModes(["pickup", "deliver"]);
      } else if (data.deliver) {
        setDeliveryModes(["deliver"]);
      } else {
        setDeliveryModes(["pickup"]);
      }
    });
  }, [openCart]);

  console.log("deliveryModes", deliveryModes);
  const persistCartOnSession = (cart) => {
    sessionStorage.setItem("checkoutCart", JSON.stringify(cart));
  };

  const showNewOrderMessage = (currentRestaurant, newRestaurant) => {
    console.log(currentRestaurant, newRestaurant);
    return `Your cart contains orders from restaurant ${currentRestaurant}. Create a new order to add items from restaurant ${newRestaurant}`;
  };

  const onAddToCart = (dish) => {
    if (cart.length != 0 && dish.RestaurantId != cart[0].RestaurantId) {
      setCurrentRestaurant(cart[0].RestaurantId);
      setNewRestaurant(dish.RestaurantId);
      setMultipleOrderDialog(true);
      setTempCart([dish]);
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

  const getTotalPrice = () => {
    return cart.reduce((price, item) => price + item.Price * item.Quantity, 0);
  };

  const onViewCart = () => {
    let currentCart = JSON.parse(sessionStorage.getItem("currentCart")) || [];
    setCart(currentCart);
    let currentRestaurantDetails = JSON.parse(
      sessionStorage.getItem("currentRestaurantDetails")
    );
    currentRestaurantDetails &&
      setRestaurantMode(currentRestaurantDetails.Mode);
    if (currentCart.length) {
      setOpenCart(true);
    } else {
      alert("Please add items to your cart");
    }
  };

  const onCheckOut = () => {
    persistCartOnSession(cart);
    sessionStorage.removeItem("currentCart");
    setCart([]);
    sessionStorage.setItem("mode", orderOption);
    history.push("/customer/checkout");
  };

  const cleanUpSession = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("currentCart");
    sessionStorage.removeItem("checkoutCart");
    sessionStorage.removeItem("deliveryAddress");
    sessionStorage.removeItem("currentRestaurantDetails");
    sessionStorage.removeItem("mode");
    sessionStorage.removeItem("currentRestaurant");
    sessionStorage.removeItem("city");
    sessionStorage.removeItem("country");
  };

  const onLogout = () => {
    cleanUpSession();
    store.dispatch(doLogoutUser());
    if (props.type == "restaurant") {
      history.push("/restaurant/login");
    } else {
      history.push("/");
    }
  };

  const alreadyLoggedIn = () => {
    if (props.type == "restaurant") {
      history.push("/restaurant/dashboard");
    } else {
      history.push("/customer/dashboard");
    }
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const avoidPaths = [
      "/restaurant/login",
      "/restaurant/register",
      "/customer/register",
      "/",
    ];
    if (
      !userId &&
      !avoidPaths.find((path) => path === window.location.pathname)
    ) {
      onLogout();
    }
  });

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const avoidPaths = [
      "/restaurant/login",
      "/restaurant/register",
      "/customer/register",
      "/",
    ];
    if (
      userId &&
      avoidPaths.find((path) => path === window.location.pathname)
    ) {
      alreadyLoggedIn();
    }
  });

  const getNumberOfItemsInCart = () => {
    let cart = JSON.parse(sessionStorage.getItem("currentCart")) || [];
    let noOfItems = cart.reduce(
      (quantity, item) => quantity + item.Quantity,
      0
    );
    return noOfItems;
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const menuItems = [
    {
      listIcon: <Home />,
      listText: "Dashboard",
      listPath: "/restaurant/dashboard",
    },

    {
      listIcon: <AccountBoxIcon />,
      listText: "Profile",
      listPath: "/restaurant/profile",
    },
    {
      listIcon: <FormatListBulletedIcon />,
      listText: "Orders",
      listPath: "/restaurant/orders",
    },
  ];

  const general = [
    {
      listIcon: <AccountCircle />,
      listText: "Customer Login",
      listPath: "/",
    },
    {
      listIcon: <AccountCircle />,
      listText: "Customer Sign Up",
      listPath: "/customer/register",
    },
    {
      listIcon: <Group />,
      listText: "Restaurant Login",
      listPath: "/restaurant/login",
    },
    {
      listIcon: <Group />,
      listText: "Restaurant Sign Up",
      listPath: "/restaurant/register",
    },
  ];

  const customer = [
    {
      listIcon: <Home />,
      listText: "Dashboard",
      listPath: "/customer/dashboard",
    },
    {
      listIcon: <RecentActors />,
      listText: "Profile",
      listPath: "/customer/profile",
    },
    {
      listIcon: <Favorite />,
      listText: "Favorites",
      listPath: "/customer/favorite",
    },
    {
      listIcon: <RestaurantMenu />,
      listText: "Orders",
      listPath: "/customer/orders",
    },
  ];
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {props.type === "restaurant" &&
          menuItems.map((listItem, key) => (
            <ListItem button key={key} component={Link} to={listItem.listPath}>
              <ListItemIcon className={classes.listItem}>
                {listItem.listIcon}
              </ListItemIcon>
              <ListItemText
                className={classes.listItem}
                primary={listItem.listText}
              />
            </ListItem>
          ))}
        {props.type === "customer" &&
          customer.map((listItem, key) => (
            <ListItem button key={key} component={Link} to={listItem.listPath}>
              <ListItemIcon className={classes.listItem}>
                {listItem.listIcon}
              </ListItemIcon>
              <ListItemText
                className={classes.listItem}
                primary={listItem.listText}
              />
            </ListItem>
          ))}
        {props.type === "customer" && (
          <ListItem
            button
            onClick={(e) => {
              console.log("hey");
              onViewCart();
            }}
          >
            <ListItemIcon className={classes.listItem}>
              <ShoppingCart />
            </ListItemIcon>
            <ListItemText className={classes.listItem} primary={"Cart"} />
          </ListItem>
        )}
        {props.type === "signup" &&
          general.map((listItem, key) => (
            <ListItem button key={key} component={Link} to={listItem.listPath}>
              <ListItemIcon className={classes.listItem}>
                {listItem.listIcon}
              </ListItemIcon>
              <ListItemText
                className={classes.listItem}
                primary={listItem.listText}
              />
            </ListItem>
          ))}
      </List>
    </div>
  );

  const buttonStyle = {
    display: "block",
    "margin-left": "auto",
  };

  const onSearchCriteriaChange = async (e) => {
    setSearchBy(e.target.value);
    if (e.target.value == "Dishes") {
      const country = sessionStorage.getItem("country");
      const city = sessionStorage.getItem("city");
      const url = `${backendServer}/dishes`;
      const response = await axios.get(url, {
        params: { country: country, city: city },
      });
      sessionStorage.setItem("dishes", JSON.stringify(response.data));
    }
  };

  return (
    <>
      <div className={classes.root}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar style={style} position="static">
            <Toolbar style={{ display: "flex", width: "100%" }}>
              <IconButton
                onClick={toggleDrawer("left", true)}
                edge="start"
                className={classes.menuButton}
                color="black"
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="left"
                open={state["left"]}
                onClose={toggleDrawer("left", false)}
              >
                {list("left")}
              </Drawer>

              <Typography variant="h6" className={classes.title}>
                <img src={logo} width={"120"} height={"80"} alt="" />
              </Typography>
              {props.type === "customer" && (
                <>
                  <Box sx={{ flexGrow: 1 }} />
                  <TextField
                    required
                    fullWidth
                    name="searchCriteria"
                    label="Search By"
                    value={searchBy}
                    style={{ width: "20%" }}
                    autoComplete="Search By"
                    onChange={(e) => {
                      onSearchCriteriaChange(e);
                    }}
                    placeholder="Search By"
                    select
                  >
                    {props.view === "customerdashboard" &&
                      searchDashBoard.map((option) => (
                        <MenuItem key={option.key} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    {props.view === "customerrestaurant" &&
                      searchRestaurant.map((option) => (
                        <MenuItem key={option.key} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                  </TextField>

                  <Search
                    style={{ width: "50%" }}
                    onChange={(event) =>
                      props.onSearch(searchBy, event.target.value)
                    }
                  >
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search.."
                      inputProps={{ "aria-label": "search" }}
                      fullWidth
                      type="text"
                      margin="normal"
                    />
                  </Search>
                </>
              )}

              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {props.type === "customer" && (
                  <IconButton aria-label="view cart" onClick={onViewCart}>
                    <Badge
                      badgeContent={getNumberOfItemsInCart()}
                      color="primary"
                    >
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                )}
                <IconButton
                  onClick={() => {
                    onLogout();
                  }}
                  aria-label="Log out"
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
      <div>
        <Dialog open={openCart} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Order Summary</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Here's what your cart looks like
            </DialogContentText>
            <List disablePadding>
              {cart.map((item) => (
                <ListItem key={item.DishId} sx={{ py: 1, px: 0 }}>
                  <ListItemText primary={item.DishName} />
                  <IconButton
                    onClick={() => {
                      onRemoveFromCart(item);
                    }}
                    aria-label="remove from cart"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  <Typography variant="body2">{item.Quantity} nos</Typography>
                  <IconButton
                    onClick={() => {
                      onAddToCart(item);
                    }}
                    aria-label="add to cart"
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    ${item.Price} x {item.Quantity} nos = $
                    {item.Price * item.Quantity}
                  </Typography>
                </ListItem>
              ))}
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ${getTotalPrice()}
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Order Option" />
                <TextField
                  required
                  fullWidth
                  name="mode"
                  value={orderOption}
                  style={{ width: "50%" }}
                  onChange={(e) => setOrderOption(e.target.value)}
                  defaultValue="pickup"
                  select
                >
                  {deliveryModes.map((mode) => (
                    <MenuItem key={mode} value={mode}>
                      {mode}
                    </MenuItem>
                  ))}
                </TextField>
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => onCheckOut()}
              variant="contained"
              color="primary"
            >
              Check Out
            </Button>
            <Button
              onClick={() => setOpenCart(false)}
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
