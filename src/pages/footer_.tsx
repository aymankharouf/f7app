import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import Home from '@material-ui/icons/Home';
import Search from '@material-ui/icons/Search';
import { StoreContext } from '../data/store'
import { useContext } from 'react'
import { useLocation } from 'react-router-dom'

const Footer = () => {
  const location = useLocation()
  const { state } = useContext(StoreContext)
  return (
    <AppBar position="fixed" color="default" style={{top: 'auto', bottom: 0}}>
      <Toolbar variant="dense">
        <IconButton color="primary">
          {location.pathname === '/' ? <Search /> : <Home />}
        </IconButton>
        <span style={{flexGrow: 1}} />
        <IconButton color="primary">
          {state.basket.length > 0 && <ShoppingCart />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Footer