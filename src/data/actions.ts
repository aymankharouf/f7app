import firebase from './firebase'
import labels from './labels'
import { randomColors, setup } from './config'
import { Error, OrderPack, BasketPack, Category, UserInfo, Alarm, Pack } from './types'
import { f7 } from 'framework7-react'

export const getMessage = (path: string, error: Error) => {
  const errorCode = error.code ? error.code.replace(/-|\//g, '_') : error.message
  if (!labels[errorCode]) {
    firebase.firestore().collection('logs').add({
      userId: firebase.auth().currentUser?.uid || '',
      error,
      page: path,
      time: firebase.firestore.FieldValue.serverTimestamp()
    })
  }
  return labels[errorCode] || labels['unknownError']
}

export const showMessage = (messageText: string) => {
  const message = f7.toast.create({
    text: `<span class="success">${messageText}<span>`,
    closeTimeout: 3000,
  })
  message.open()
}

export const showError = (messageText: string) => {
  const message = f7.toast.create({
    text: `<span class="error">${messageText}<span>`,
    closeTimeout: 3000,
  })
  message.open()
}


export const quantityText = (quantity: number, weight?: number): string => {
  return weight && weight !== quantity ? `${quantityText(quantity)}(${quantityText(weight)})` : quantity === Math.trunc(quantity) ? quantity.toString() : quantity.toFixed(3)
}

export const quantityDetails = (basketPack: BasketPack) => {
  let text = `${labels.requested}: ${quantityText(basketPack.quantity)}`
  if ((basketPack.purchased ?? 0) > 0) {
    text += `, ${labels.purchased}: ${quantityText(basketPack.purchased ?? 0, basketPack.weight)}`
  }
  if ((basketPack.returned ?? 0) > 0) {
    text += `, ${labels.returned}: ${quantityText(basketPack.returned ?? 0)}`
  }
  return text
}

export const addQuantity = (q1: number, q2: number, q3 = 0) => {
  return Math.trunc(q1 * 1000 + q2 * 1000 + q3 * 1000) / 1000
}

export const productOfText = (trademarkName: string | undefined, countryName: string | undefined) => {
  return trademarkName ? `${labels.productFrom} ${trademarkName}-${countryName}` : `${labels.productOf} ${countryName}`
}

export const getChildren = (categoryId: string, categories: Category[]) => {
  let childrenArray = [categoryId]
  let children = categories.filter(c => c.parentId === categoryId)
  children.forEach(c => {
    const newChildren = getChildren(c.id, categories)
    childrenArray = [...childrenArray, ...newChildren]
  })
  return childrenArray
}

export const rateProduct = (productId: string, value: number) => {
  firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
    ratings: firebase.firestore.FieldValue.arrayUnion({
      productId,
      value,
      status: 'n'  
    })
  })
}

export const login = (mobile: string, password: string) => {
  return firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(9, 2) + password)
}

export const logout = () => {
  firebase.auth().signOut()
}

export const addPasswordRequest = (mobile: string) => {
  firebase.firestore().collection('password-requests').add({
    mobile,
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const registerUser = async (mobile: string, name: string, storeName: string, locationId: string, password: string) => {
  await firebase.auth().createUserWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(9, 2) + password)
  let colors = []
  for (var i = 0; i < 4; i++){
    colors.push(randomColors[Number(password.charAt(i))].name)
  }
  firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).set({
    mobile,
    name,
    storeName,
    locationId,
    colors,
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const changePassword = async (oldPassword: string, newPassword: string) => {
  let user = firebase.auth().currentUser
  if (user) {
    const mobile = user.email?.substring(0, 10)
    if (mobile) {
      await firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(9, 2) + oldPassword)
      user = firebase.auth().currentUser
      if (user) {
        await user.updatePassword(mobile.substring(9, 2) + newPassword)
        let colors = []
        for (var i = 0; i < 4; i++){
          colors.push(randomColors[Number(newPassword.charAt(i))].name)
        }
        return firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
          colors
        }) 
      }
    }
  }
}

export const addAlarm = (alarm: Alarm) => {
  firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
    alarms: firebase.firestore.FieldValue.arrayUnion({
      ...alarm,
      id: Math.random().toString(),
      time: new Date()  
    })
  })
}

export const inviteFriend = (mobile: string, name: string) => {
  firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
    friends: firebase.firestore.FieldValue.arrayUnion({
      mobile,
      name,
      status: 'n'
    })
  })
}

export const readNotification = (user: UserInfo, notificationId: string) => {
  const notifications = user.notifications?.slice()
  if (notifications) {
    const notificationIndex = notifications.findIndex(n => n.id === notificationId)
    notifications.splice(notificationIndex, 1, {
      ...notifications[notificationIndex],
      status: 'r'
    })
    firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
      notifications
    })  
  }
}

export const updateFavorites = (user: UserInfo, productId: string) => {
  const favorites = user.favorites?.slice() || []
  const found = favorites.indexOf(productId)
  if (found === -1) {
    favorites.push(productId) 
  } else {
    favorites.splice(found, 1)
  }
  firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
    favorites
  })
}

export const deleteNotification = (user: UserInfo, notificationId: string) => {
  const notifications = user.notifications?.slice()
  if (notifications) {
    const notificationIndex = notifications.findIndex(n => n.id === notificationId)
    notifications.splice(notificationIndex, 1)
    firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
      notifications
    })  
  }
}

export const deleteFriend = (user: UserInfo, mobile: string) => {
  const friends = user.friends?.slice()
  if (friends) {
    const friendIndex = friends.findIndex(f => f.mobile === mobile)
    friends.splice(friendIndex, 1)
    firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
      friends
    })
  }
}

export const getBasket = (stateBasket: BasketPack[], packs: Pack[]) => {
  const basket = stateBasket.map(p => {
    const packInfo = packs.find(pa => pa.id === p.packId)
    let lastPrice
    if (p.offerId) {
      const offerInfo = packs.find(pa => pa.id === p.offerId)
      if (!offerInfo) {
        lastPrice = 0
      } else if (offerInfo.subPackId === p.packId) {
        lastPrice = Math.round(offerInfo.price / (offerInfo.subQuantity ?? 0) * (offerInfo.subPercent ?? 0) * (1 + setup.profit))
      } else {
        lastPrice = Math.round(offerInfo.price / (offerInfo.bonusQuantity ?? 0) * (offerInfo.bonusPercent ?? 0) * (1 + setup.profit))
      }
    } else {
      lastPrice = packInfo?.price ?? 0
    }
    const totalPriceText = `${(Math.round(lastPrice * p.quantity) / 100).toFixed(2)}${p.byWeight ? '*' : ''}`
    const priceText = lastPrice === 0 ? labels.itemNotAvailable : (lastPrice === p.price ? `${labels.price}: ${(p.price / 100).toFixed(2)}` : `${labels.priceHasChanged}, ${labels.oldPrice}: ${(p.price / 100).toFixed(2)}, ${labels.newPrice}: ${(lastPrice / 100).toFixed(2)}`)
    const otherProducts = packs.filter(pa => pa.categoryId === packInfo?.categoryId && (pa.sales > packInfo.sales || pa.rating > packInfo.rating))
    const otherOffers = packs.filter(pa => pa.productId === packInfo?.productId && pa.id !== packInfo.id && (pa.isOffer || pa.offerEnd))
    const otherPacks = packs.filter(pa => pa.productId === packInfo?.productId && pa.weightedPrice < packInfo.weightedPrice)
    return {
      ...p,
      price: lastPrice,
      packInfo,
      totalPriceText,
      priceText,
      otherProducts: otherProducts.length,
      otherOffers: otherOffers.length,
      otherPacks: otherPacks.length
    }
  })
  return basket
}
