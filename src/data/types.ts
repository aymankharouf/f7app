import firebase from './firebase'

export type Label = {
    [key: string]: string
}
export type Category = {
  id: string,
  name: string,
  mainId: string | null,
  parentId: string,
  ordering: number,
  isLeaf: boolean
}
export type Error = {
  code: string,
  message: string
}
export type ProductRequest = {
  id: string,
  storeId: string,
  name: string,
  country: string,
  weight: string,
  price: number,
  imageUrl: string,
  time: Date
}
export type Product = {
  id: string,
  name: string,
  alias: string,
  description: string,
  categoryId: string,
  countryId: string,
  trademarkId: string,
  unit: string,
  rating: number,
  ratingCount: number,
  imageUrl: string,
  isActive: boolean,
}
export type Pack = {
  id?: string,
  name: string,
  product: Product,
  imageUrl?: string,
  subPackId: string | null,
  subCount: number | null,
  unitsCount: number,
  byWeight: boolean,
  withGift: boolean,
  forSale: boolean,
}
export type PackRequest = {
  id: string,
  storeId: string,
  siblingPackId: string,
  name: string,
  imageUrl?: string,
  price: number,
  subCount?: number,
  withGift?: boolean,
  gift?: string,
  time: Date
}

export type PackStore = {
  storeId: string,
  isRetail: boolean,
  packId: string,
  price: number,
  claimUserId?: string | null,
  isActive: boolean,
  time: Date
}
export type Notification = {
  id: string,
  userId: string | null,
  userName: string,
  isResponse: boolean,
  title: string,
  message: string,
  time: Date
}
export type Rating = {
  productId: string,
  value: number
}
export type Position = {
  lat: number,
  lng: number
}
export type UserInfo = {
  name: string,
  password?: string,
  mobile: string,
  position: Position,
  address?: string,
  storeId?: string,
  storeName: string | null,
  lastSeen?: Date,
  regionId: string | null,
  isActive: boolean,
  time?: Date,
  type: string
}
export type Advert = {
  id: string,
  title: string,
  text: string,
  startDate: number,
  endDate: number,
  imageUrl?: string
}
export type Region = {
  id: string,
  name: string,
  ordering: number,
  position: Position
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
export type Store = {
  id?: string,
  name: string,
  mobile: string,
  address: string,
  position: Position,
  regionId: string | null,
  claimsCount: number,
  type: string,
  ownerId: string | null
}
export type StoreRequest = {
  storeId: string,
  packId: string,
  time: Date
}
export type BasketItem = {
  packId: string,
  quantity: string | null
}
export type CachedPack = Pack & {
  price: number,
  weightedPrice: number,
  categoryName: string,
  countryName: string,
  trademarkName?: string
}
export type State = {
  user?: firebase.User,
  userInfo?: UserInfo,
  categories: Category[],
  basket: BasketItem[],
  packs: Pack[],
  packStores: PackStore[],
  adverts: Advert[],
  regions: Region[],
  countries: Country[],
  trademarks: Trademark[],
  passwordRequests: PasswordRequest[],
  notifications: Notification[],
  storeRequests: StoreRequest[],
  stores: Store[],
  ratings: Rating[],
  productRequests: ProductRequest[]
  searchText: string,
  mapPosition?: Position,
  cachedPacks: CachedPack[]
}
export type Action = {
  type: string
  payload?: any
}
export type Context = {
  state: State;
  dispatch: React.Dispatch<Action>
}