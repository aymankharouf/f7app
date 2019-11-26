import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import Categories from './pages/Categories'
import PanelPage from './pages/PanelPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Packs from './pages/Packs'
import PackDetails from './pages/PackDetails'
import Basket from './pages/Basket'
import ConfirmOrder from './pages/ConfirmOrder'
import OrdersList from './pages/OrdersList';
import OrderDetails from './pages/OrderDetails';
import PriceAlarm from './pages/PriceAlarm';
import ForgetPassword from './pages/ForgetPassword';
import InviteFriend from './pages/InviteFriend';
import StoreOwner from './pages/StoreOwner';
import OwnerPacks from './pages/OwnerPacks';
import ChangePassword from './pages/ChangePassword';
import OtherOffers from './pages/OtherOffers';
import ContactUs from './pages/ContactUs';
import RateProduct from './pages/RateProduct';
import Ratings from './pages/Ratings';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    name: 'home',
    path: '/home/',
    component: HomePage,
  },
  {
    path: '/panel/',
    component: PanelPage
  },
  {
    path: '/login/',
    component: Login,
    options: {
      reloadCurrent: true,
    },
  },
  {
    path: '/panelLogin/',
    component: Login,
  },
  {
    path: '/forgetPassword/',
    component: ForgetPassword
  },
  {
    path: '/changePassword/',
    component: ChangePassword
  },
  {
    path: '/register/',
    component: Register,
    options: {
      reloadCurrent: true,
    },
  },
  {
    path: '/storeOwner/',
    component: StoreOwner
  },
  {
    path: '/inviteFriend/',
    component: InviteFriend
  },
  {
    path: '/section/:id',
    component: Categories,
  },
  {
    path: '/category/:id',
    component: Packs,
  },
  {
    path: '/pack/:id',
    component: PackDetails,
  },
  {
    path: '/priceAlarm/:id',
    component: PriceAlarm,
  },
  {
    path: '/basket/',
    component: Basket,
  },
  {
    path: '/confirmOrder/',
    component: ConfirmOrder,
  },
  {
    path: '/search/',
    component: Packs,
  },
  {
    path: '/ordersList/',
    component: OrdersList,
  },
  {
    path: '/order/:id',
    component: OrderDetails,
  },
  {
    path: '/ownerPacks/:id',
    component: OwnerPacks,
  },
  {
    path: '/otherOffers/:id',
    component: OtherOffers
  },
  {
    path: '/contactUs/',
    component: ContactUs
  },
  {
    path: '/rateProduct/:productId/value/:value',
    component: RateProduct
  },
  {
    path: '/ratings/:id',
    component: Ratings
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },

];
