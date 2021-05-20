import {IonBadge, IonContent, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { StateContext } from '../data/state-provider';
import { logout } from '../data/actions';
import labels from '../data/labels';

const Panel = () => {
  const {state, dispatch} = useContext(StateContext)
  const [notificationsCount, setNotificationsCount] = useState(0)
  const menuEl = useRef<HTMLIonMenuElement | null>(null);
  const history = useHistory()
  useEffect(() => {
    let notifications = 0, alarms = 0
    if (state.userInfo) {
      notifications = state.notifications.filter(n => n.time > (state.userInfo!.lastSeen || state.userInfo!.time!)).length
    }
    if (state.userInfo?.storeId) {
      alarms = state.alarms.filter(a => a.time > (state.userInfo!.lastSeen || state.userInfo!.time!)).length
    }
    setNotificationsCount(notifications + alarms)
  }, [state.userInfo, state.alarms, state.notifications])
  const handleLogout = () => {
    logout()
    dispatch({type: 'LOGOUT'})
    history.push('/')
    if (menuEl.current) menuEl.current.close()
    dispatch({type: 'CLEAR_BASKET'})
  }

  return (
    <IonMenu contentId="main" type="overlay" ref={menuEl} className="dark">
      <IonContent>
        <IonList>
          <IonMenuToggle autoHide={false}>
            {state.user ?
              <>
                <IonItem href="#" onClick={handleLogout}>
                  <IonLabel style={{marginBottom: '5px'}}>{labels.logout}</IonLabel>
                </IonItem>
                <IonItem routerLink="/change-password" style={{marginBottom: '0px', marginTop: '0px'}}>
                  <IonLabel>{labels.changePassword}</IonLabel>
                </IonItem>
                <IonItem routerLink="/notifications">
                  <IonLabel>{labels.notifications}</IonLabel>
                  {notificationsCount > 0 && <IonBadge color="danger">{notificationsCount}</IonBadge>}
                </IonItem>
              </>
            : <IonItem routerLink='/login'>
                <IonLabel>{labels.login}</IonLabel>
              </IonItem>
            }
            {state.user && state.userInfo?.storeId &&
              <>
                <IonItem routerLink='/packs/0/s'>
                  <IonLabel>{labels.myPacks}</IonLabel>
                </IonItem>
                <IonItem routerLink='/product-requests'>
                  <IonLabel>{labels.productRequests}</IonLabel>
                </IonItem>
                <IonItem routerLink={`/store-details/${state.userInfo?.storeId}/0`}>
                  <IonLabel>{labels.myInfo}</IonLabel>
                </IonItem>
              </>
            }
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Panel;