import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon, Toggle } from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import ReLogin from './ReLogin'
import { StoreContext } from '../data/Store';
import { confirmOrder, showMessage, showError, getMessage, quantityText } from '../data/Actions'


const ConfirmOrder = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [withDelivery, setWithDelivery] = useState(state.customer.withDelivery || false)
  const [urgent, setUrgent] = useState(false)
  const customerLocation = useMemo(() => state.customer.locationId ? state.locations.find(l => l.id === state.customer.locationId) : ''
  , [state.locations, state.customer])
  const [deliveryFees, setDeliveryFees] = useState(customerLocation ? customerLocation.deliveryFees : '')
  const [error, setError] = useState('')
  const basket = useMemo(() => state.basket.map(p => {
    const packInfo = state.packs.find(pa => pa.id === p.packId)
    let price = packInfo.price
    if (p.offerId) {
      const offerInfo = state.packs.find(pa => pa.id === p.offerId)
      if (offerInfo.subPackId === p.packId) {
        price = parseInt((offerInfo.price / offerInfo.subQuantity) * (offerInfo.subPercent / 100))
      } else {
        price = parseInt((offerInfo.price / offerInfo.bonusQuantity) * (offerInfo.bonusPercent / 100))
      }
    }
    return {
      ...p,
      price,
      oldPrice: p.price,
      name: packInfo.name,
      productId: packInfo.productId,
      byWeight: packInfo.byWeight
    }
  }), [state.packs, state.basket])
  const total = useMemo(() => basket.reduce((sum, p) => sum + p.price * p.quantity, 0)
  , [basket])
  const fixedFees = useMemo(() => {
    const offersTotal = basket.reduce((sum, p) => sum + p.offerId ? p.price * p.quantity : 0, 0)
    const fees = Math.ceil(((urgent ? 1.5 : 1) * (state.labels.fixedFees * (total - offersTotal) + state.labels.fixedFees * 2 * offersTotal) / 100) / 50) * 50
    const fraction = total - Math.floor(total / 50) * 50
    return fees - fraction
  }, [basket, total, urgent, state.labels])
  const discount = useMemo(() => {
    const orders = state.orders.filter(o => o.status !== 'c')
    let discount = 0
    if (orders.length === 0) {
      discount = state.labels.firstOrderDiscount
    } else if (state.customer.discounts > 0) {
      discount = Math.min(state.customer.discounts, state.labels.maxDiscount)
    }
    return discount
  }, [state.orders, state.customer, state.labels.maxDiscount, state.labels.firstOrderDiscount]) 
  
  const weightedPacks = useMemo(() => basket.filter(p => p.byWeight)
  , [basket])
  useEffect(() => {
    if (withDelivery) {
      setDeliveryFees(customerLocation ? (urgent ? 1.5 : 1) * customerLocation.deliveryFees : '')
    } else {
      setDeliveryFees('')
    }
  }, [withDelivery, urgent, customerLocation])
  useEffect(() => {
    if (error) {
      showError(props, error)
      setError('')
    }
  }, [error, props])

  const handleConfirm = async () => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
      const totalOrders = activeOrders.reduce((sum, o) => sum + o.total, 0)
      if (totalOrders + total > state.customer.orderLimit) {
        throw new Error('limitOverFlow')
      }
      let packs = basket.filter(p => p.price > 0)
      packs = packs.map(p => {
        return {
          packId: p.packId,
          price: p.price,
          quantity: p.quantity,
          gross: parseInt(p.price * p.quantity),
          offerId: p.offerId ?? '',
          purchased: 0,
          status: 'n'
        }
      })
      const order = {
        basket: packs,
        fixedFees,
        deliveryFees,
        discount,
        withDelivery,
        urgent,
        total
      }
      await confirmOrder(order)
      showMessage(props, state.labels.confirmSuccess)
      props.f7router.navigate('/home/', {reloadAll: true})
      dispatch({ type: 'CLEAR_BASKET' })
    } catch (err){
      setError(getMessage(props, err))
    }
  }
  if (!user) return <ReLogin />
  return (
    <Page>
      <Navbar title={state.labels.confirmOrder} backLink={state.labels.back} />
      <Block>
        <List mediaList>
          {basket.map(p => {
            const productInfo = state.products.find(pr => pr.id === p.productId)
            return(
              <ListItem
                key={p.packId}
                title={productInfo.name}
                subtitle={`${state.labels.quantity}: ${quantityText(p.quantity)}`}
                text={p.price === p.oldPrice ? '' : p.price === 0 ? state.labels.unAvailableNote : state.labels.changePriceNote}
                after={`${(parseInt(p.price * p.quantity) / 1000).toFixed(3)} ${p.byWeight ? '*' : ''}`}
              />
            )
          })}
          <ListItem 
            title={state.labels.total} 
            className="total" 
            after={(total / 1000).toFixed(3)} 
          />
          <ListItem 
            title={state.labels.fixedFeesTitle} 
            className="fees" 
            after={(fixedFees / 1000).toFixed(3)} 
          />
          {withDelivery ? 
            <ListItem 
              title={state.labels.deliveryFees} 
              className="fees" 
              after={(deliveryFees / 1000).toFixed(3)} 
            /> 
          : ''}
          {discount > 0 ? 
            <ListItem 
              title={state.labels.discount}
              className="discount" 
              after={(discount / 1000).toFixed(3)} 
            /> 
          : ''}
          <ListItem 
            title={state.labels.net} 
            className="net" 
            after={((total + fixedFees + deliveryFees - discount) / 1000).toFixed(3)} 
          />
          </List>
          <List form>
          <ListItem>
            <span>{state.labels.withDelivery}</span>
            <Toggle 
              name="withDelivery" 
              color="green" 
              checked={withDelivery} 
              onToggleChange={() => setWithDelivery(!withDelivery)}
              disabled={customerLocation ? !customerLocation.hasDelivery : false}
            />
          </ListItem>
          <ListItem>
            <span>{state.labels.urgent}</span>
            <Toggle 
              name="urgent" 
              color="green" 
              checked={urgent} 
              onToggleChange={() => setUrgent(!urgent)}
            />
          </ListItem>
        </List>
        <p className="note">{weightedPacks.length > 0 ? state.labels.weightedPricesNote : ''}</p>
        <p className="note">{withDelivery ? (urgent ? state.labels.withUrgentDeliveryNote : state.labels.withDeliveryNote) : (urgent ? state.labels.urgentNoDeliveryNote : state.labels.noDeliveryNote)}</p>
      </Block>
      <Fab position="center-bottom" slot="fixed" text={state.labels.confirm} color="green" onClick={() => handleConfirm()}>
        <Icon material="done"></Icon>
      </Fab>
      <Toolbar bottom>
        <BottomToolbar />
      </Toolbar>
    </Page>
  )
}
export default ConfirmOrder
