import firebase from './firebase'
import labels from './labels'
import {randomColors} from './config'
import {Error, Category, Alarm, Pack, ProductRequest, PackStore, Product, Notification, UserInfo, StoreRequest, PackRequest} from './types'
import {f7} from 'framework7-react'

export const getMessage = (path: string, error: Error) => {
  const errorCode = error.code ? error.code.replace(/-|\//g, '_') : error.message
  if (!labels[errorCode]) {
    firebase.firestore().collection('logs').add({
      userId: firebase.auth().currentUser?.uid || '',
      error: errorCode,
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

export const addQuantity = (q1: number, q2: number, q3 = 0) => {
  return Math.trunc(q1 * 1000 + q2 * 1000 + q3 * 1000) / 1000
}

export const productOfText = (countryName: string, trademarkName?: string) => {
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

export const rateProduct = (product: Product, value: number, packs: Pack[]) => {
  const batch = firebase.firestore().batch()
  const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid)
  batch.update(userRef, {
    ratings: firebase.firestore.FieldValue.arrayUnion({
      productId: product.id,
      value
    })
  })
  const oldRating = product.rating ?? 0
  const ratingCount = product.ratingCount ?? 0
  const newRating = Math.round((oldRating * ratingCount + value) / (ratingCount + 1))
  const productRef = firebase.firestore().collection('products').doc(product.id)
  batch.update(productRef, {
    rating: newRating,
    ratingCount: ratingCount + 1
  })
  const affectedPacks = packs.filter(p => p.product.id === product.id)
  affectedPacks.forEach(p => {
    const packRef = firebase.firestore().collection('packs').doc(p.id)
    batch.update(packRef, {
      product: {
        ...product,
        rating: newRating,
        ratingCount: ratingCount + 1
      }
    })
  })
  batch.commit()
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

export const registerUser = async (user: UserInfo) => {
  await firebase.auth().createUserWithEmailAndPassword(user.mobile + '@gmail.com', user.mobile.substring(9, 2) + user.password)
  let colors = []
  for (var i = 0; i < 4; i++){
    colors.push(randomColors[Number(user.password!.charAt(i))].name)
  }
  const {password, ...others} = user
  firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).set({
    ...others,
    colors,
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
  
  return firebase.auth().currentUser?.updateProfile({
    displayName: user.type === 'n' ? 'n' : 's'
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
  const batch = firebase.firestore().batch()
  const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid)
  batch.update(userRef, {
    alarms: firebase.firestore.FieldValue.arrayUnion(alarm)
  })
  const storeRef = firebase.firestore().collection('stores').doc(alarm.storeId)
  const {storeId, ...others} = alarm
  batch.update(storeRef, {
    alarms: firebase.firestore.FieldValue.arrayUnion(others)
  })
  batch.commit()
}

export const deleteNotification = (notifications: Notification[], notificationId: string) => {
    const newNotifications = notifications.filter(n => n.id !== notificationId)
    firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
      notifications: newNotifications
    })  
}

export const addProductRequest = async (productRequest: ProductRequest, image?: File) => {
  const storeRef = firebase.firestore().collection('stores').doc(productRequest.storeId)
  const {storeId, ...others} = productRequest
  let imageUrl = ''
  if (image) {
    const filename = image.name
    const ext = filename.slice(filename.lastIndexOf('.'))
    const fileData = await firebase.storage().ref().child('requests/' + productRequest.id + ext).put(image)
    imageUrl = await firebase.storage().ref().child(fileData.metadata.fullPath).getDownloadURL()
  }
  others['imageUrl'] = imageUrl
  storeRef.update({
    productRequests: firebase.firestore.FieldValue.arrayUnion(others)
  })
}

export const changePrice = (packStore: PackStore, packStores: PackStore[], batch?: firebase.firestore.WriteBatch) => {
  const newBatch = batch || firebase.firestore().batch()
  const otherStores = packStores.filter(p => p.packId === packStore.packId && p.storeId !== packStore.storeId)
  otherStores.push(packStore)
  const stores = otherStores.map(p => {
    const {packId, ...others} = p
    return others
  })
  let packRef = firebase.firestore().collection('packs').doc(packStore.packId)
  newBatch.update(packRef, {
    stores,
    lastTrans: firebase.firestore.FieldValue.serverTimestamp()
  })
  if (!batch) {
    newBatch.commit()
  }
}

export const addPackRequest = async (packRequest: PackRequest, image?: File) => {
  const storeRef = firebase.firestore().collection('stores').doc(packRequest.storeId)
  const {storeId, ...others} = packRequest
  if (image) {
    console.log('image ... ')
    const filename = image.name
    const ext = filename.slice(filename.lastIndexOf('.'))
    const fileData = await firebase.storage().ref().child('requests/' + packRequest.id + ext).put(image)
    others.imageUrl = await firebase.storage().ref().child(fileData.metadata.fullPath).getDownloadURL()
  }
  storeRef.update({
    packRequests: firebase.firestore.FieldValue.arrayUnion(others),
  })
}

export const deleteStorePack = (packStore: PackStore, packStores: PackStore[], packs: Pack[], withRequest: boolean) => {
  const batch = firebase.firestore().batch()
  const pack = packs.find(p => p.id === packStore.packId)!
  const otherStores = packStores.filter(p => p.packId === packStore.packId && p.storeId !== packStore.storeId)
  const stores = otherStores.map(p => {
    const {packId, ...others} = p
    return others
  })
  const packRef = firebase.firestore().collection('packs').doc(pack.id)
  batch.update(packRef, {
    stores,
    lastTrans: firebase.firestore.FieldValue.serverTimestamp()
  })
  if (withRequest) {
    const storeRef = firebase.firestore().collection('stores').doc(packStore.storeId)
    batch.update(storeRef, {
      requests: firebase.firestore.FieldValue.arrayUnion(packStore.packId)
    })
  }
  batch.commit()
}

export const addPackStore = (packStore: PackStore, packs: Pack[], storeRequests: StoreRequest[]) => {
  const batch = firebase.firestore().batch()
  const {packId, ...others} = packStore
  const packRef = firebase.firestore().collection('packs').doc(packId)
  batch.update(packRef, {
    stores: firebase.firestore.FieldValue.arrayUnion(others),
    lastTrans: firebase.firestore.FieldValue.serverTimestamp()
  })
  const storeRequest = storeRequests.find(r => r.storeId === packStore.storeId && r.packId === packId)
  if (storeRequest) {
    const storeRef = firebase.firestore().collection('stores').doc(packStore.storeId)
    batch.update(storeRef, {
      requests: firebase.firestore.FieldValue.arrayRemove(packId)
    })
  }
  batch.commit()
}

export const addStoreRequest = (storeId: string, packId: string) => {
  const storeRef = firebase.firestore().collection('stores').doc(storeId)
  storeRef.update({
    requests: firebase.firestore.FieldValue.arrayUnion(packId)
  })
}

export const deleteStoreRequest = (storeRequest: StoreRequest) => {
  const storeRef = firebase.firestore().collection('stores').doc(storeRequest.storeId)
  storeRef.update({
    requests: firebase.firestore.FieldValue.arrayRemove(storeRequest.packId)
  })
}

export const sendNotification = (userId: string, title: string, message: string, batch?: firebase.firestore.WriteBatch) => {
  const newBatch =  batch || firebase.firestore().batch()
  const userRef = firebase.firestore().collection('users').doc(userId)
  newBatch.update(userRef, {
    notifications: firebase.firestore.FieldValue.arrayUnion({
      id: Math.random().toString(),
      title,
      message,
      status: 'n',
      time: new Date()
    })
  })
  if (!batch) {
    newBatch.commit()
  }
}
export const updateLastSeen = () => {
  firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const deleteProductRequest = async (productRequest: ProductRequest, productRequests: ProductRequest[]) => {
  const storeRef = firebase.firestore().collection('stores').doc(productRequest.storeId)
  const otherRequests = productRequests.filter(r => r.storeId === productRequest.storeId && r.id !== productRequest.id)
  storeRef.update({
    productRequests: otherRequests
  })
  const ext = productRequest.imageUrl.slice(productRequest.imageUrl.lastIndexOf('.'), productRequest.imageUrl.indexOf('?'))
  const image = firebase.storage().ref().child('requests/' + productRequest.id + ext)
  await image.delete()
}

