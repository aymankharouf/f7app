import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar} from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/Store';

const OrdersList = props => {
  const { state } = useContext(StoreContext)
  const orders = useMemo(() => {
    const orders = state.orders.filter(o => ['n', 'a', 's', 'f', 'd'].includes(o.status))
    return orders.sort((o1, o2) => o2.time.seconds - o1.time.seconds)
  }, [state.orders])
  return(
    <Page>
      <Navbar title={state.labels.myOrders} backLink={state.labels.back} />
      <Block>
          <List mediaList>
            {orders && orders.map(o =>
              <ListItem
                link={`/order/${o.id}`}
                title={moment(o.time.toDate()).fromNow()}
                after={(o.total / 1000).toFixed(3)}
                text={state.orderStatus.find(s => s.id === o.status).name}
                key={o.id}
              />
            )}
            {orders.length === 0 ? <ListItem title={state.labels.not_found} /> : ''}

          </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default OrdersList
