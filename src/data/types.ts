import firebase from './firebase'

export type Label = {
    [key: string]: string
}
export type Category = {
  id: string,
  name: string,
  parentId: string,
  ordering: number,
  isLeaf: boolean
}
export type Error = {
  code: string,
  message: string
}
export type ProductRequest = {
  name: string,
  country: string,
  weight: string,
  price: number,
  imageUrl: string
}
export type Product = {
  id: string,
  name: string,
  alias?: string,
  description?: string,
  categoryId: string,
  countryId: string,
  trademarkId?: string,
  unitType: string,
  rating: number,
  ratingCount: number
}
export type Pack = {
  id?: string,
  name: string,
  product: Product,
  imageUrl: string,
  price: number,
  subPackId?: string,
  subQuantity?: number,
  weightedPrice: number,
  typeUnits: number,
  standardUnits: number,
  unitId: string,
  byWeight: boolean
}
export type PackPrice = {
  storeId: string,
  packId: string,
  price: number,
  time: Date
}
export type Notification = {
  id: string,
  title: string,
  message: string,
  status: string,
  time: string
}
export type Rating = {
  productId: string
}
export type Alarm = {
  packId: string,
  storeId: string,
  status: string
}
export type Position = {
  lat: number, 
  lng: number
}
export type UserInfo = {
  name: string,
  mobile: string,
  position: Position,
  storeId?: string,
  storeName?: string,
  notifications?: Notification[],
  ratings?: Rating[],
  favorites?: string[],
  alarms?: Alarm[]
}
export type BasketPack = {
  packId: string,
  productId: string,
  productName: string,
  productDescription: string,
  packName: string,
  imageUrl: string,
  price: number,
  quantity: number,
  offerId: string
  byWeight: boolean,
  weight?: number,
}
export type Advert = {
  id: string,
  type: string,
  title: string,
  text: string,
  isActive: boolean,
  imageUrl?: string
}
export type Location = {
  id: string,
  name: string,
  fees: number,
  ordering: number
}
export type Country = {
  id: string,
  name: string,
}
export type Trademark = {
  id: string,
  name: string,
}
export type PasswordRequest = {
  id: string,
  mobile: string
}
export type Discount = {
  value: number,
  type: string
}
export type Unit = {
  id: string,
  name: string,
  type: string,
  factor: number
}
export type Store = {
  id?: string,
  name: string,
  mobile: string,
  address: string,
  position: Position,
  locationId?: string
}
export type PackRequest = {
  storeId: string,
  packId: string
}
export type State = {
  user?: firebase.User,
  userInfo?: UserInfo,
  categories: Category[],
  basket: BasketPack[],
  packs: Pack[],
  packPrices: PackPrice[],
  adverts: Advert[],
  locations: Location[],
  countries: Country[],
  trademarks: Trademark[],
  passwordRequests: PasswordRequest[],
  notifications: Notification[],
  units: Unit[],
  packRequests: PackRequest[],
  stores: Store[]
}

export type Action = {
  type: string
  payload?: any
}

export type Context = {
  state: State;
  dispatch: React.Dispatch<Action>
}