import React from 'react';
import { Route } from 'react-router-dom'
import Login from './components/SignUp/Login'
import CustomerRegistration from './components/SignUp/CustomerRegistration';
import RestaurantRegistration from './components/SignUp/RestaurantRegistration'
import RestaurantDashBoard from './components/DashBoard/RestaurantDashBoard';
import AddDish from './components/DashBoard/AddDish';
import RestaurantProfile from './components/Profile/RestaurantProfile';
import RestaurantLogin from './components/SignUp/RestaurantLogin';
import CustomerDashBoard from './components/DashBoard/CustomerDashBoard';
import CustomerProfile from './components/Profile/CustomerProfile';
import CustomerRestaurantView from './components/DashBoard/CustomerRestaurantView';
import CustomerPersonalization from './components/DashBoard/CustomerPersonalization';
import CustomerCheckOut from './components/DashBoard/CustomerCheckOut';
import  CustomerOrders from './components/DashBoard/CustomerOrders';
import  RestaurantOrders from './components/DashBoard/RestaurantOrders';

function App() {
  console.info('started');
  return (
    <div>
      <Route exact path='/' component={Login} />
      <Route exact path='/restaurant/login' component={RestaurantLogin} />
      <Route exact path='/customer/register' component={CustomerRegistration} />
      <Route exact path='/restaurant/register' component={RestaurantRegistration} />
      <Route exact path='/restaurant/dashBoard' component={RestaurantDashBoard} />
      <Route exact path='/restaurant/dishes' component={AddDish} />
      <Route exact path='/restaurant/profile' component={RestaurantProfile} />
      <Route exact path='/customer/dashBoard' component={CustomerDashBoard} />
      <Route exact path='/customer/orders' component={CustomerOrders} />
      <Route exact path='/restaurant/orders' component={RestaurantOrders} />
      <Route exact path='/customer/profile' component={CustomerProfile} />
      <Route exact path='/customer/restaurant' component={CustomerRestaurantView} />
      <Route exact path='/customer/favorite' component={CustomerPersonalization} />
      <Route exact path='/customer/checkout' component={CustomerCheckOut} />
    </div>
  );
}

export default App;
