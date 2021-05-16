import {useContext, useState, useEffect} from 'react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {deleteProductRequest, getMessage} from '../data/actions'
import Footer from './footer'
import { IonContent, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonThumbnail, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { ProductRequest } from '../data/types'
import { useLocation } from 'react-router'
import { trashOutline } from 'ionicons/icons'

const ProductRequests = () => {
  const {state} = useContext(StateContext)
  const [error, setError] = useState('')
  const [productRequests, setProductRequests] = useState<ProductRequest[]>([])
  const [message] = useIonToast();
  const location = useLocation()
  const [alert] = useIonAlert();
  useEffect(() => {
    setProductRequests(() => {
      const productRequests = state.productRequests.filter(r => r.storeId === state.userInfo?.storeId)
      return productRequests.sort((r1, r2) => r1.time! > r2.time! ? 1 : -1)
    })
  }, [state.productRequests, state.userInfo])
  useEffect(() => {
    if (error) {
      message(error, 3000)
      setError('')
    }
  }, [error])
  const handleDelete = (productRequest: ProductRequest) => {
    alert({
      header: labels.confirmationTitle,
      message: labels.confirmationText,
      buttons: [
        {text: labels.cancel},
        {text: labels.ok, handler: async () => {
          try{
            await deleteProductRequest(productRequest, state.productRequests)
            message(labels.deleteSuccess, 3000) 
          } catch(err) {
            setError(getMessage(location.pathname, err))
          }    
        }},
      ],
    })
  }
  return(
    <IonPage>
      <Header title={labels.productRequests} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          {productRequests.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : productRequests.map(p => 
              <IonItem key={p.id}>
                <IonThumbnail slot="start">
                  <IonImg src={p.imageUrl} alt={labels.noImage} />
                </IonThumbnail>
                <IonLabel>
                  <div className="list-row1">{p.name}</div>
                  <div className="list-row2">{p.weight}</div>
                  <div className="list-row3">{p.country}</div>
                  <div className="list-row4">{`${labels.price}: ${p.price.toFixed(2)}`}</div>
                </IonLabel>
                <IonIcon 
                  ios={trashOutline} 
                  slot="end" 
                  style={{fontSize: '20px', marginRight: '10px'}} 
                  onClick={()=> handleDelete(p)}
                />
              </IonItem>    
            )
          }
        </IonList>
      </IonContent>
      <Footer />
    </IonPage>
  )
}

export default ProductRequests