import firebase from './firebase'

export interface Label {
    [key: string]: string
}
export interface Category {
  id: string,
  name: string,
  ename?: string,
  parentId: string,
  ordering: number,
  isLeaf: boolean
}
export interface Error {
  code: string,
  message: string
}
export interface Pack {
  id: string,
  name: string,
  ename: string,
  productId: string,
  productName: string,
  productEname: string,
  productDescription?: string,
  productEdescription?: string,
  imageUrl: string,
  price: number,
  categoryId: string,
  sales: number,
  rating: number,
  subPackId?: string,
  subQuantity?: number,
  subPercent?: number,
  subPackName?: string,
  bonusPackId?: string,
  bonusProductName?: string,
  bonusPackName?: string,
  bonusQuantity?: number,
  bonusPercent?: number,
  isOffer: boolean,
  offerEnd: Date,
  weightedPrice: number,
  isDivided: boolean,
  minStoreId?: string,
  trademarkId?: string,
  countryId: string,
  closeExpired: boolean,
  ratingCount: number,
  categoryName?: string,
  trademarkName?: string,
  countryName?: string
}
export interface PackPrice {
  storeId: string,
  packId: string,
  price: number,
  packInfo?: Pack
  time: Date
}
export interface Notification {
  id: string,
  title: string,
  message: string,
  status: string,
  time: Date
}
export interface Friend {
  mobile: string,
  name: string,
  status: string
}
export interface Rating {
  productId: string
}
export interface Alarm {
  packId?: string,
  type: string,
  price?: number,
  quantity?: number,
  alternative?: string,
  offerDays?: number,
  status: string
}
export interface UserInfo {
  mobile: string,
  locationId: string,
  notifications?: Notification[],
  friends?: Friend[],
  ratings?: Rating[],
  favorites?: string[],
  alarms?: Alarm[]
}
export interface CustomerInfo {
  storeId: string,
  isBlocked: boolean,
  orderLimit: number,
  deliveryFees: number,
  discounts: number,
  specialDiscount: number
}
export interface BasketPack {
  packId: string,
  productId: string,
  productName: string,
  productEname?: string,
  productDescription: string,
  productEdescription?: string,
  packName: string,
  packEname?: string,
  imageUrl: string,
  price: number,
  quantity: number,
  offerId: string
  closeExpired: boolean,
  byWeight: boolean,
  weight?: number,
  purchased?: number,
  returned?: number
}
export interface OrderPack extends BasketPack {
  gross: number,
  purchased: number,
  status: string,
  actual?: number,
  overPriced?: boolean,
  packInfo?: Pack,
  oldQuantity?: number
}
export interface BigBasketPack extends BasketPack {
  packInfo?: Pack,
  totalPriceText: string,
  priceText: string,
  otherProducts: number,
  otherOffers: number,
  otherPacks: number
}
export interface Order {
  id?: string,
  basket: OrderPack[],
  status: string,
  statusName?: string,
  total: number,
  fixedFees: number,
  deliveryFees: number,
  discount?: Discount,
  fraction: number,
  requestType?: string,
  time?: Date
}
export interface Advert {
  id: string,
  type: string,
  title: string,
  text: string,
  isActive: boolean,
  imageUrl?: string
}
export interface Location {
  id: string,
  name: string,
  fees: number,
  ordering: number
}
export interface Country {
  id: string,
  name: string,
  ename?: string
}
export interface Trademark {
  id: string,
  name: string,
  ename?: string
}
export interface PasswordRequest {
  id: string,
  mobile: string
}
export interface Discount {
  value: number,
  type: string
}
export interface PurchasedPack {
  packId: string,
  productId: string,
  productName: string,
  productEname: string,
  packName: string,
  imageUrl: string,
  bestPrice: number,
  lastPrice: number,
  quantity: number,
  lastQuantity: number,
  lastTime: Date
}
export interface State {
  user?: firebase.User,
  userInfo?: UserInfo,
  menuOpen?: boolean,
  customerInfo?: CustomerInfo,
  categories: Category[],
  basket: BasketPack[],
  orders: Order[],
  packs: Pack[],
  packPrices: PackPrice[],
  adverts: Advert[],
  locations: Location[],
  countries: Country[],
  trademarks: Trademark[],
  passwordRequests: PasswordRequest[],
  orderBasket: OrderPack[],
  pageTitle: string,
  searchText?: string
}

export interface Action {
  type: string
  payload?: any
}

export interface Context {
  state: State;
  dispatch: React.Dispatch<Action>
}