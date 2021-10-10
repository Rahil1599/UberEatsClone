import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import logo from '../images/uberRats.svg'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const style = {
    background : '#eeeff3'
};


export default function ButtonAppBar() {
  const classes = useStyles();

  const onLogin = () => {

  }

  return (
    <div className={classes.root}>
      <AppBar style={style} position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="black" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
          <img src={logo} width={'120'} height={'80'} alt='' />
          </Typography>
          <Button onClick={() => {
              onLogin()
          }} color="black">Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
