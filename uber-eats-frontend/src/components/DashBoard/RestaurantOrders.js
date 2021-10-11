import React, { useCallback } from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import backendServer from "../../Config";
import { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
import { capitalize } from "@material-ui/core";

export default function Review(props) {
  const [orders, updateOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = useCallback(() => {
    setLoading(true);
    const userId = sessionStorage.getItem("userId");
    const url = `${backendServer}/orders/restaurant/${userId}`;
    axios.get(url).then(({ data }) => {
      console.log(data);
      updateOrders(data);
    });
    setLoading(false);
    // console.log(orders);
  }, []);

  const updateOrderStatus = useCallback((OrderId, OrderStatus) => {
    setLoading(true);
    const userId = sessionStorage.getItem("userId");
    const url = `${backendServer}/orders/restaurant/${userId}`;
    axios.post(url, { OrderId, OrderStatus }).then(() => {
      fetchData();
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  // const getTotalPrice = () => {
  //     return orders.reduce((price, item) => price + item.Price * item.Quantity, 0);
  // }

  // const getTotal = () => {
  //   let netSum = 0;
  //   let sum = 0;
  //   orders.map(order => {
  //     sum =0;
  //     order.items.forEach(item=>{
  //       sum += item.Price;
  //     })
  //     netSum += sum;
  //   })
  //   console.log(netSum);
  //   return netSum;
  // }

  const getServiceTaxForOrder = (order) => {
    let value = getPricePerRestaurant(order);
    let tax = (5 / 100) * value;
    return tax;
  };
  const getTotalPriceForOrder = (order) => {
    let sum = getPricePerRestaurant(order);
    sum += getServiceTaxForOrder(order);
    return sum;
  };

  // const getFinalPrice = () => {
  //     let subtotal = getTotalPrice();
  //     let deliveryFee = (subtotal * 0.01).toFixed(2);
  //     let serviceFee = (subtotal * 0.02).toFixed(2);
  //     let tax = (subtotal * 0.09).toFixed(2);
  //     return (parseFloat(subtotal) + parseFloat(deliveryFee) + parseFloat(serviceFee) + parseFloat(tax));
  // }

  const getPricePerRestaurant = (order) => {
    console.log(order);
    let sum = 0;
    order.items.forEach((item) => {
      sum += item.Price * (item.Quantity || 1);
    });
    console.log(sum);
    return sum;
  };

  // const getAddressVisibility = ()=>{
  // //     let visibility = (mode=="Delivery"&&props.deliveryAddress)?'visible':'hidden';
  //     // return visibility;
  //     return 'visible';
  // }

  console.log(orders);
  return (
    <React.Fragment>
      {!loading && (
        <>
          <Typography variant="h3" gutterBottom>
            Orders
          </Typography>
          <List>
            {orders.map((order) => {
              return (
                <>
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Divider></Divider>
                      <Divider></Divider>
                      <Divider></Divider>
                      <Divider></Divider>
                      <Typography variant="h5">{order.CustomerName}</Typography>

                      {order.items.map((item) => {
                        return (
                          <ListItem>
                            {capitalize(item.DishName)} | ${item.Price} | qty:{" "}
                            {item.Quantity}
                          </ListItem>
                        );
                      })}

                      <Typography variant="h9" fontWeight="600">
                        Sub Total: {getPricePerRestaurant(order)}
                      </Typography>
                      <br />
                      <Typography variant="h9" fontWeight="600">
                        Service Tax: {getServiceTaxForOrder(order)}
                      </Typography>
                      <br />
                      <Typography variant="h9" fontWeight="600">
                        Total: {getTotalPriceForOrder(order)}
                      </Typography>
                      <br />
                      <Typography variant="h9" fontWeight="600">
                        Current Order Status:{" "}
                        <TextField
                          required
                          fullWidth
                          name="mode"
                          value={order.OrderStatus.toLowerCase()}
                          style={{ width: "50%" }}
                          onChange={(e) =>
                            updateOrderStatus(order.OrderId, e.target.value)
                          }
                          defaultValue="pickup"
                          select
                        >
                          {["new", "preparing", "ready"].map((mode) => (
                            <MenuItem key={mode} value={mode}>
                              {mode}
                            </MenuItem>
                          ))}
                        </TextField>
                        <br />
                      </Typography>
                      <Typography variant="h9" fontWeight="600">
                        Delivery Type : {order.DeliveryType}
                        <br />
                      </Typography>
                      <Typography fontWeight="600">
                        Delivered To: {order.DeliveryAddress}
                      </Typography>
                      <Divider></Divider>
                      <Divider></Divider>
                      <Divider></Divider>
                      <Divider></Divider>
                    </CardContent>
                  </Card>
                </>
              );
            })}
          </List>
        </>
      )}
    </React.Fragment>
  );
}

// {orders.map((order) => (
//   <ListItem key={order.OrderId} sx={{ py: 1, px: 0 }}>
//     <ListItemText primary={order.DishName} secondary={order.Res} />
//     <Typography variant="body2">${10}</Typography>
//   </ListItem>
// ))}

{
  /* <Grid container spacing={2}>
<Grid visibility={getAddressVisibility()} item xs={12} sm={6}>
  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
    Payment Due: ${getTotal()}
  </Typography>
  <Typography variant="h7" gutterBottom sx={{ mt: 2 }}>
    Delivery Address
  </Typography>
</Grid>
<Grid item container direction="column" xs={12} sm={6}>
  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
    Details
  </Typography>
  <Grid container>
    <React.Fragment>
      <Grid item xs={6}>
        <Typography gutterBottom>Sub Total</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography gutterBottom>
          ${getTotalPrice().toFixed(2)}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography gutterBottom>Delivery fee</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography gutterBottom>
          5$
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography gutterBottom>Service fee</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography gutterBottom>
          3$
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography gutterBottom>Tax</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography gutterBottom>
          10$
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography gutterBottom>Total</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography gutterBottom>${getFinalPrice()}</Typography>
      </Grid>
    </React.Fragment>
  </Grid>
</Grid>
</Grid> */
}
