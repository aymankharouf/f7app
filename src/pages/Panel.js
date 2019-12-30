import React, { useContext } from 'react'
import { Page, Navbar, List, ListItem, Badge } from 'framework7-react'
import { StoreContext } from '../data/store'
import { logout } from '../data/actions'
import labels from '../data/labels'

const Panel = props => {
  const { user, state, dispatch } = useContext(StoreContext)
  const handleLogout = () => {
    logout().then(() => {
      props.f7router.app.views.main.router.navigate('/home/', {reloadAll: true})
      props.f7router.app.panel.close('right') 
      dispatch({type: 'CLEAR_BASKET'})
    })
  }
  return(
    <Page>
      <Navbar title={labels.mainPanelTitle} />
      <List>
        {user ?
          <ListItem 
            link="#" 
            title={labels.logout} 
            onClick={() => handleLogout()} 
          />
        : 
          <ListItem 
            link="/panelLogin/" 
            title={labels.loginTitle} 
          />
        }
        {user ? 
          <ListItem 
            link="/basket/"
            view="#main-view"
            title={labels.basket} 
            panelClose
          >
            {state.basket.length > 0 ? <Badge color="red">{state.basket.length}</Badge> : ''}
          </ListItem>
        : ''}
        {user ? <ListItem link="/changePassword/" title={labels.changePassword} /> : ''}
        {user ? <ListItem link="/ordersList/" title={labels.myOrders} view="#main-view" panelClose /> : ''}
        {user ? <ListItem link="/inviteFriend/" title={labels.inviteFriend} view="#main-view" panelClose /> : ''}
        {state.customer.storeId ? <ListItem link={`/ownerPacks/${state.customer.storeId}`} title={labels.ownerPacks} view="#main-view" panelClose /> : ''}
        {user ? '' : <ListItem link="/storeOwner/" title={labels.registerStoreOwner} view="#main-view" panelClose />}
        <ListItem link="/contactUs/" title={labels.contactUsTitle} view="#main-view" panelClose />
      </List>
    </Page>
  )
}
export default Panel
