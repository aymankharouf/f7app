import { useContext, useState, useEffect } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar } from 'framework7-react'
import Footer from './footer'
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/store'
import labels from '../data/labels'
import { orderStatus, setup } from '../data/config'
import { Order } from '../data/interfaces'

const OrdersList = () => {
  const { state } = useContext(StoreContext)
  const [orders, setOrders] = useState<Order[]>([])
  useEffect(() => {
    setOrders(() => {
      const filteredOrders = state.orders.filter(o => ['n', 'a', 'e', 'u', 'f', 'p', 'd'].includes(o.status))
      let orders = filteredOrders.map(o => {
        const orderStatusInfo = orderStatus.find(s => s.id === o.status)
        return {
          ...o,
          statusName: setup.locale === 'en' ? orderStatusInfo?.ename : orderStatusInfo?.name
        }
      })
      return orders.sort((o1, o2) => o2.time! > o1.time! ? -1 : 1)
    })
  }, [state.orders])
  return(
    <Page>
      <Navbar title={labels.myOrders} backLink={labels.back} />
      <Block>
        <List mediaList>
          {orders.length === 0 ? 
            <ListItem title={labels.noData} /> 
          : orders.map(o =>
              <ListItem
                link={`/order-details/${o.id}`}
                title={o.statusName}
                subtitle={moment(o.time).fromNow()}
                after={(o.total / 100).toFixed(2)}
                key={o.id}
              />
            )
          }
        </List>
      </Block>
      <Toolbar bottom>
        <Footer/>
      </Toolbar>
    </Page>
  )
}

export default OrdersList
