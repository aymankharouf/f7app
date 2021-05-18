import {useState, useEffect} from 'react'
import {getMessage, registerUser} from '../data/actions'
import labels from '../data/labels'
import { IonButton, IonButtons, IonContent, IonFooter, IonInput, IonItem, IonLabel, IonList, IonPage, IonToolbar, useIonLoading, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation } from 'react-router'
import { UserInfo } from '../data/types'
import { patterns } from '../data/config'

const Register = () => {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [storeName, setStoreName] = useState('')
  const [nameInvalid, setNameInvalid] = useState(true)
  const [passwordInvalid, setPasswordInvalid] = useState(true)
  const [mobileInvalid, setMobileInvalid] = useState(true)
  const [position, setPosition] = useState({lat: 0, lng: 0})
  const [positionError, setPositionError] = useState(false)
  const [address, setAddress] = useState('')
  const [type, setType] = useState('n')
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast();
  const [loading, dismiss] = useIonLoading();
  useEffect(() => {
    setPasswordInvalid(!password || !patterns.password.test(password))
  }, [password])
  useEffect(() => {
    setNameInvalid(!name || !patterns.name.test(name))
  }, [name])
  useEffect(() => {
    setMobileInvalid(!mobile || !patterns.mobile.test(mobile))
  }, [mobile])
  const handleSetPosition = () => {
    loading()
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dismiss()
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        dismiss()
        setPositionError(true)
        message(labels.positionError, 3000)
      }
    );
  }
  const handleRegister = async () => {
    try{
      loading()
      let user: UserInfo = {
        mobile,
        name,
        password,
        position,
        type
      }
      if (type === 's') user.storeName = storeName
      if (positionError) user.address = address
      await registerUser(user)
      dismiss()
      message(type === 'n' ? labels.registerSuccess : labels.registerStoreOwnerSuccess, 3000)
      history.push('/')
    } catch (err){
      dismiss()
      message(getMessage(location.pathname, err), 3000)
    }
  }
  return (
    <IonPage>
      <Header title={labels.newUser} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating" color={nameInvalid ? 'danger' : ''}>
              {labels.name}
            </IonLabel>
            <IonInput 
              value={name} 
              type="text" 
              placeholder={labels.namePlaceholder}
              autofocus
              clearInput
              onIonChange={e => setName(e.detail.value!)} 
              color={nameInvalid ? 'danger' : ''}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color={mobileInvalid ? 'danger' : 'primary'}>
              {labels.mobile}
            </IonLabel>
            <IonInput 
              value={mobile} 
              type="number" 
              placeholder={labels.mobilePlaceholder}
              clearInput
              onIonChange={e => setMobile(e.detail.value!)} 
              color={mobileInvalid ? 'danger' : ''}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color={passwordInvalid ? 'danger' : 'primary'}>
              {labels.password}
            </IonLabel>
            <IonInput 
              value={password} 
              type="number" 
              placeholder={labels.passwordPlaceholder}
              clearInput
              onIonChange={e => setPassword(e.detail.value!)} 
              color={passwordInvalid ? 'danger' : ''}
            />
          </IonItem>
          {type === 's' &&
            <IonItem>
              <IonLabel position="floating" color="primary">
                {labels.storeName}
              </IonLabel>
              <IonInput 
                value={storeName} 
                type="text" 
                clearInput
                onIonChange={e => setStoreName(e.detail.value!)} 
              />
            </IonItem>
          }
          {type !== 'd' && !positionError && !position.lat &&
            <IonButton 
              expand="block" 
              fill="clear" 
              onClick={handleSetPosition}
            >
              {labels.setPosition}
            </IonButton>
          }
          {positionError && 
            <IonItem>
              <IonLabel position="floating" color="primary">
                {labels.address}
              </IonLabel>
              <IonInput 
                value={address} 
                type="text" 
                clearInput
                onIonChange={e => setAddress(e.detail.value!)} 
              />
            </IonItem>
          }
        </IonList>
        {(position.lat || address || type ==='d') && (storeName || type !== 's') && !nameInvalid && !mobileInvalid && !passwordInvalid &&
          <IonButton expand="block" fill="clear" onClick={handleRegister}>{labels.register}</IonButton>
        }
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton fill="clear" onClick={() => setType(type === 's' ? 'n': 's')}>{type === 's' ? labels.normalUser : labels.storeOwner}</IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={() => setType(type === 'd' ? 'n' : 'd')}>{type === 'd' ? labels.normalUser : labels.salesman}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  )
}
export default Register
