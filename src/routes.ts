import Home from './pages/home'
import NotFoundPage from './pages/not-found-page'
import Categories from './pages/categories'
import Panel from './pages/panel'
import Login from './pages/login'
import Register from './pages/register'
import Packs from './pages/packs'
import PackDetails from './pages/pack-details'
import PasswordRequest from './pages/password-request'
import StoreSummary from './pages/store-summary'
import StorePacks from './pages/store-packs'
import ChangePassword from './pages/change-password'
import Hints from './pages/hints'
import Notifications from './pages/notifications'
import NotificationDetails from './pages/notification-details'
import Advert from './pages/advert'
import AddProductRequest from './pages/add-product-request'
import AddPack from './pages/add-pack'
import AddGroup from './pages/add-group'
import StoreDetails from './pages/store-details'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/home/',
    component: Home,
  },
  {
    path: '/panel/',
    component: Panel
  },
  {
    path: '/login/',
    component: Login,
    options: {
      reloadCurrent: true,
    },
  },
  {
    path: '/panel-login/',
    component: Login,
  },
  {
    path: '/password-request/',
    component: PasswordRequest
  },
  {
    path: '/change-password/',
    component: ChangePassword
  },
  {
    path: '/register/:type',
    component: Register,
    // options: {
    //   reloadCurrent: true,
    // },
  },
  {
    path: '/categories/:id',
    component: Categories,
  },
  {
    path: '/packs/:id/type/:type',
    component: Packs,
  },
  {
    path: '/pack-details/:id',
    component: PackDetails,
  },
  {
    path: '/search/',
    component: Packs,
  },
  {
    path: '/store-summary/',
    component: StoreSummary,
  },
  {
    path: '/store-packs/:type',
    component: StorePacks,
  },
  {
    path: '/hints/:id/type/:type',
    component: Hints
  },
  {
    path: '/notifications/',
    component: Notifications
  },
  {
    path: '/notification-details/:id',
    component: NotificationDetails
  },
  {
    path: '/advert/',
    component: Advert
  },
  {
    path: '/add-product-request/',
    component: AddProductRequest
  },
  {
    path: '/add-pack/:id',
    component: AddPack,
  },
  {
    path: '/add-group/:id',
    component: AddGroup,
  },
  {
    path: '/store-details/:id',
    component: StoreDetails
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
]


export default routes