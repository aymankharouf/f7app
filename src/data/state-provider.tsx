import {createContext, useReducer, useEffect} from 'react'
import Reducer from './reducer'
import firebase from './firebase'
import {State, Context, Category, Pack, PackStore, Advert, PasswordRequest, Notification, Store, StoreRequest, UserInfo, Rating, ProductRequest, PackRequest} from './types'

export const StateContext = createContext({} as Context)

type Props = {
  children: React.ReactElement
}

const StateProvider = ({children}: Props) => {
  const initState: State = {
    categories: [], 
    basket: [], 
    packs: [],
    packStores: [],
    adverts: [],
    regions: [],
    countries: [],
    trademarks: [],
    passwordRequests: [],
    notifications: [],
    storeRequests: [],
    stores: [],
    ratings: [],
    productRequests: [],
    searchText: ''
  }
  const [state, dispatch] = useReducer(Reducer, initState)

  useEffect(() => {
    const unsubscribeCategories = firebase.firestore().collection('categories').where('isActive', '==', true).onSnapshot(docs => {
      let categories: Category[] = []
      docs.forEach(doc => {
        categories.push({
          id: doc.id,
          name: doc.data().name,
          mainId: doc.data().mainId,
          parentId: doc.data().parentId,
          ordering: doc.data().ordering,
          isLeaf: doc.data().isLeaf
        })
      })
      dispatch({type: 'SET_CATEGORIES', payload: categories})
    }, err => {
      unsubscribeCategories()
    })  
    const unsubscribePacks = firebase.firestore().collection('packs').where('isActive', '==', true).onSnapshot(docs => {
      let packs: Pack[] = []
      let packStores: PackStore[] = []
      docs.forEach(doc => {
        let minPrice = 0
        if (doc.data().stores) {
          const activePrices = doc.data().stores.filter((s: PackStore) => s.isRetail && s.isActive)
          const prices = activePrices.map((p: PackStore) => p.price)
          minPrice = prices.length > 0 ? Math.min(...prices) : 0
        }
        packs.push({
          id: doc.id,
          name: doc.data().name,
          product: doc.data().product,
          imageUrl: doc.data().imageUrl,
          unitsCount: doc.data().unitsCount,
          byWeight: doc.data().byWeight,
          subPackId: doc.data().subPackId,
          subCount: doc.data().subCount,
          withGift: doc.data().withGift,
          forSale: doc.data().forSale,
          price: minPrice,
          weightedPrice: minPrice / doc.data().unitsCount,
        })
        if (doc.data().stores) {
          doc.data().stores.forEach((s: any) => {
            packStores.push({
              packId: doc.id,
              storeId: s.storeId,
              isRetail: s.isRetail,
              isActive: s.isActive,
              claimUserId: s.claimUserId || null,
              price: s.price,
              time: s.time.toDate()
            })
          })
        }
      })
      dispatch({type: 'SET_PACKS', payload: packs})
      dispatch({type: 'SET_PACK_STORES', payload: packStores})
    }, err => {
      unsubscribePacks()
    })
    const unsubscribeAdverts = firebase.firestore().collection('adverts').where('isActive', '==', true).onSnapshot(docs => {
      let adverts: Advert[] = []
      docs.forEach(doc => {
        adverts.push({
          id: doc.id,
          type: doc.data().type,
          title: doc.data().title,
          text: doc.data().text,
          isActive: doc.data().isActive,
          imageUrl: doc.data().imageUrl
        })
      })
      dispatch({type: 'SET_ADVERTS', payload: adverts})
    }, err => {
      unsubscribeAdverts()
    })  
    const unsubscribeRegions = firebase.firestore().collection('lookups').doc('r').onSnapshot(doc => {
      if (doc.exists) dispatch({type: 'SET_REGIONS', payload: doc.data()!.values})
    }, err => {
      unsubscribeRegions()
    })  
    const unsubscribeCountries = firebase.firestore().collection('lookups').doc('c').onSnapshot(doc => {
      if (doc.exists) dispatch({type: 'SET_COUNTRIES', payload: doc.data()!.values})
    }, err => {
      unsubscribeCountries()
    })  
    const unsubscribeTrademarks = firebase.firestore().collection('lookups').doc('t').onSnapshot(doc => {
      if (doc.exists) dispatch({type: 'SET_TRADEMARKS', payload: doc.data()!.values})
    }, err => {
      unsubscribeTrademarks()
    }) 
    const unsubscribePasswordRequests = firebase.firestore().collection('password-requests').onSnapshot(docs => {
      let passwordRequests: PasswordRequest[] = []
      docs.forEach(doc => {
        passwordRequests.push({
          id: doc.id,
          mobile: doc.data().mobile
        })
      })
      dispatch({type: 'SET_PASSWORD_REQUESTS', payload: passwordRequests})
    }, err => {
      unsubscribePasswordRequests()
    })  
    firebase.auth().onAuthStateChanged(user => {
      dispatch({type: 'LOGIN', payload: user})
      if (user) {
        const unsubscribeUser = firebase.firestore().collection('users').doc(user.uid).onSnapshot(doc => {
          const notifications: Notification[] = []
          const ratings: Rating[] = []
          if (doc.exists){
            const userData: UserInfo = {
              name: doc.data()!.name,
              mobile: doc.data()!.mobile,
              position: doc.data()!.position,
              storeId: doc.data()!.storeId,
              storeName: doc.data()!.storeName,
              regionId: doc.data()!.regionId,
              isActive: doc.data()!.isActive,
              lastSeen: doc.data()!.lastSeen?.toDate(),
              time: doc.data()!.time?.toDate(),
              type: doc.data()!.type
            }
            doc.data()!.notifications?.forEach((n: any) => {
              notifications.push({
                id: n.id,
                message: n.message,
                title: n.title,
                time: n.time.toDate()
              })
            })
            doc.data()!.ratings?.forEach((r: any) => {
              ratings.push({
                productId: r.productId,
                value: r.value
              })
            })
            dispatch({type: 'SET_USER_INFO', payload: userData})
            dispatch({type: 'SET_NOTIFICATIONS', payload: notifications})
            dispatch({type: 'SET_RATINGS', payload: ratings})
            if (doc.data()!.basket) dispatch({type: 'SET_BASKET', payload:  doc.data()!.basket})
          } else {
            firebase.auth().signOut()
            dispatch({type: 'LOGOUT'})
          }
        }, err => {
          unsubscribeUser()
        })
        const unsubscribeStores = firebase.firestore().collection('stores').onSnapshot(docs => {
          const stores: Store[] = []
          const productRequests: ProductRequest[] = []
          const storeRequests: StoreRequest[] = []
          const packRequests: PackRequest[] = []
          docs.forEach(doc => {
            stores.push({
              id: doc.id,
              name: doc.data().name,
              type: doc.data().type,
              regionId: doc.data().regionId,
              address: doc.data().address,
              position: doc.data().position,
              mobile: doc.data().mobile,
              claimsCount: doc.data().claimsCount
            })
            doc.data().productRequests?.forEach((r: any) => {
              productRequests.push({
                id: r.id,
                storeId: doc.id,
                name: r.name,
                country: r.country,
                weight: r.weight,
                price: r.price,
                imageUrl: r.imageUrl,
                time: r.time?.toDate()
              })
            })
            doc.data().requests?.forEach((r: any) => {
              storeRequests.push({
                storeId: doc.id,
                packId: r.packId,
                time: r.time.toDate()
              })
            })
            doc.data().packRequests?.forEach((r: any) => {
              packRequests.push({
                id: r.id,
                storeId: doc.id,
                siblingPackId: r.siblingPackId,
                name: r.name,
                price: r.price,
                imageUrl: r.imageUrl,
                withGift: r.withGift,
                gift: r.gift,
                subCount: r.subCount,
                time: r.time?.toDate()
              })
            })
          })
          dispatch({type: 'SET_STORES', payload: stores})
          dispatch({type: 'SET_PRODUCT_REQUESTS', payload: productRequests})
          dispatch({type: 'SET_STORE_REQUESTS', payload: storeRequests})
          dispatch({type: 'SET_PACK_REQUESTS', payload: packRequests})
        }, err => {
          unsubscribeStores()
        }) 
      } else {
        dispatch({type: 'CLEAR_USER_INFO'})
        dispatch({type: 'LOGOUT'})
        dispatch({type: 'CLEAR_BASKET'})
      }
    })
  }, [])
  return (
    <StateContext.Provider value={{state, dispatch}}>
      {children}
    </StateContext.Provider>
  )
}
 
export default StateProvider

