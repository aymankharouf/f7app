import React, { useState, useContext } from 'react'
import {Page, Navbar, List, ListInput, Block, Fab, Icon, Card, CardContent, CardHeader} from 'framework7-react';
import { StoreContext } from '../data/Store';
import { addLessPrice } from '../data/Actions'
import ReLogin from './ReLogin'


const LessPrice = props => {
  const { state, user } = useContext(StoreContext)
  const product = state.products.find(rec => rec.id === props.id)
  const [price, setPrice] = useState('')
  const [storeName, setStoreName] = useState('')
  const [storePlace, setStorePlace] = useState('')
  const [error, setError] = useState('')
  const handleSubmit = () => {
    try{
      if (price === '' || Number(price) === 0) {
        throw new Error(state.labels.enterPrice)
      }
      if (storeName === '') {
        throw new Error(state.labels.enterStore)
      }
      if (Number(price) >= product.price) {
        throw new Error(state.labels.invalidPrice)
      }
      const lessPrice = {
        productId: product.id,
        price: price * 1000,
        storeName,
        storePlace
      }
      addLessPrice(lessPrice).then(() => {
        props.f7router.back()
      })  
    } catch (err){
      setError(err.message)
    }
  }
  if (!user) return <ReLogin callingPage='home'/>
  return (
    <Page>
      <Navbar title={state.labels.lessPrice} backLink="Back" />
      {error ? <Block strong className="error">{error}</Block> : null}
      <Block>
        <Card className="demo-card-header-pic">
          <CardHeader className="card-title">
            <p>{product.name}</p>
            <p>{(product.price / 1000).toFixed(3)}</p>
          </CardHeader>
          <CardContent>
            <img src={product.imageUrl} width="100%" height="250" alt=""/>
            <p>{product.description}</p>
          </CardContent>
        </Card>
        <List form>
          <ListInput 
            name="price" 
            label={state.labels.price}
            clearButton 
            floatingLabel 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            onInputClear={() => setPrice('')}
          />
          <ListInput 
            name="storeName" 
            label={state.labels.storeName}
            clearButton 
            floatingLabel 
            type="text" 
            value={storeName} 
            onChange={(e) => setStoreName(e.target.value)}
            onInputClear={() => setStoreName('')}
          />
          <ListInput 
            name="storePlace" 
            label={state.labels.storePlace}
            clearButton 
            floatingLabel 
            type="text" 
            value={storePlace} 
            onChange={(e) => setStorePlace(e.target.value)}
            onInputClear={() => setStorePlace('')}
          />
        </List>
      </Block>
      <Fab position="center-bottom" slot="fixed" text={state.labels.submit} color="green" onClick={() => handleSubmit()}>
        <Icon ios="f7:check" aurora="f7:check" md="material:done"></Icon>
      </Fab>
    </Page>
  )
}
export default LessPrice